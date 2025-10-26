
const fs =  require("fs");
const path = require("path"); 
const axios = require("axios");
const  { fileURLToPath } = require("url");
const dotenv = require("dotenv");
const { aiAssess } = require("./aiAssess.js");
dotenv.config(); 

const DATA_DIR = path.join(__dirname, "data");
const REPORT_DIR = path.join(__dirname, "reports");

// ====== CONFIG ======
const ETHERSCAN_KEY   = process.env.ETHERSCAN_API_KEY || "";
const CHAIN_ID        = String(process.env.ETHERSCAN_CHAINID || "1");
const ETHERSCAN_BASE  = process.env.ETHERSCAN_BASE_URL || "https://api.etherscan.io";
const PAGE_SIZE       = Number(process.env.ETHERSCAN_PAGE_SIZE || 10000);
const RETRIES         = Number(process.env.ETHERSCAN_RETRIES || 8);
const RETRY_DELAY_MS  = Number(process.env.ETHERSCAN_RETRY_DELAY_MS || 2500);
const TIMEOUT_MS      = Number(process.env.ETHERSCAN_TIMEOUT_MS || 45000);

const OPENAI_KEY   = process.env.OPENAI_API_KEY || "";
const OPENAI_BASE  = process.env.OPENAI_BASE_URL || undefined;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

// Heuristic — lightweight (AI does the heavy lift)
function quickHeuristic(normal, token, address) {
  const now = Date.now() / 1000;
  const thirty = 30 * 24 * 60 * 60;
  const allTs = [...normal, ...token]
    .map((t) => Number(t.timeStamp || 0))
    .filter(Boolean);
  const last = allTs.length ? Math.max(...allTs) : 0;
  const recent = last && now - last < thirty;

  const me = address.toLowerCase();
  const counterparties = new Set();
  normal.forEach((t) => {
    if (t.from?.toLowerCase() !== me) counterparties.add(t.from.toLowerCase());
    if (t.to?.toLowerCase() !== me) counterparties.add(t.to.toLowerCase());
  });
  token.forEach((t) => {
    if (t.from?.toLowerCase() !== me) counterparties.add(t.from.toLowerCase());
    if (t.to?.toLowerCase() !== me) counterparties.add(t.to.toLowerCase());
  });
  const tokens = new Set(token.map((t) => (t.tokenSymbol || "").toUpperCase()));

  let label = "Neutral";
  if (recent && tokens.size > 50) label = "Aggressive";
  if (!recent && tokens.size === 0 && allTs.length === 0) label = "Dormant";

  return {
    lastActivityISO: last ? new Date(last * 1000).toISOString() : null,
    uniqueCounterparties: counterparties.size,
    tokenDiversity: tokens.size,
    label,
  };
}

function sumETHWei(txs, addrLC) {
  let inWei = 0n, outWei = 0n;
  for (const t of txs || []) {
    const v = BigInt(t.value || "0");
    const from = (t.from || "").toLowerCase();
    const to = (t.to || "").toLowerCase();
    if (to === addrLC) inWei += v;
    if (from === addrLC) outWei += v;
  }
  return { inWei, outWei };
}
function saveSnapshot(address, payload) {
  const safe = `eth_${address.toLowerCase()}`;
  const jsonPath = path.join(DATA_DIR, `${safe}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));

  const tokenTx = payload.token || [];
  if (tokenTx.length) {
    const csvPath = path.join(DATA_DIR, `${safe}_token.csv`);
    const writer = createObjectCsvWriter({
      path: csvPath,
      header: [
        { id: "hash", title: "hash" },
        { id: "blockNumber", title: "blockNumber" },
        { id: "timeStamp", title: "timeStamp" },
        { id: "from", title: "from" },
        { id: "to", title: "to" },
        { id: "contractAddress", title: "contractAddress" },
        { id: "tokenName", title: "tokenName" },
        { id: "tokenSymbol", title: "tokenSymbol" },
        { id: "value", title: "valueRaw" },
      ],
    });
    writer.writeRecords(tokenTx).catch(console.error);
    return { json: path.basename(jsonPath), csv: path.basename(csvPath) };
  }
  return { json: path.basename(jsonPath) };
}
 
async function etherscanGet(params) {
  const url = `${ETHERSCAN_BASE}/v2/api`;
  let lastErr;
  for (let i = 0; i < RETRIES; i++) {
    try {
      const { data } = await axios.get(url, {
        params: { chainid: CHAIN_ID, apikey: ETHERSCAN_KEY, ...params },
        timeout: TIMEOUT_MS,
        headers: { "User-Agent": "wallet-snapshot/2.0 (+node)" },
        validateStatus: () => true,
      });

      const msg = (data && data.message) || "";
      const rateLimited =
        /rate limit|max rate|busy|timeout/i.test(msg) ||
        data?.result === "Max rate limit reached";
      if (rateLimited) {
        console.warn(`[etherscan] rate-limited attempt ${i + 1}/${RETRIES}`);
        await sleep(RETRY_DELAY_MS * (i + 1));
        continue;
      }
      return data;
    } catch (err) {
      lastErr = err;
      console.warn(
        `[etherscan] network error attempt ${i + 1}/${RETRIES}:`,
        err.code || err.message
      );
      await sleep(RETRY_DELAY_MS * (i + 1));
    }
  }
  console.error("[etherscan] retries exhausted");
  return { status: "0", message: "Retries exhausted", result: [] };
}

async function fetchPaginated({ action, address }) {
  const all = [];
  let page = 1;
  while (true) {
    const data = await etherscanGet({
      module: "account",
      action,
      address,
      startblock: 0,
      endblock: 99999999,
      page,
      offset: PAGE_SIZE,
      sort: "asc",
    });
    if (page === 1)
      console.log(`[DEBUG] ${action} p1 message=${data?.message}`);

    const arr = Array.isArray(data?.result) ? data.result : [];
    if (arr.length === 0) break;

    all.push(...arr);
    if (arr.length < PAGE_SIZE) break;
    page += 1;
  }
  return all;
}

async function fetchAllForAddress(address) {
  const [normal, internal, token] = await Promise.all([
    fetchPaginated({ action: "txlist", address }),
    fetchPaginated({ action: "txlistinternal", address }),
    fetchPaginated({ action: "tokentx", address }),
  ]);

  const key = (h, li) => `${(h || "").toLowerCase()}:${String(li ?? "")}`;
  const seen = new Set();

  const normalNorm = normal.map((t) => ({
    ...t,
    __bucket: "normal",
    hash: t.hash || t.transactionHash,
    logIndex: t.logIndex ?? 0,
  }));
  const internalNorm = internal.map((t, i) => ({
    ...t,
    __bucket: "internal",
    hash:
      t.hash ||
      t.transactionHash ||
      t.parentHash ||
      `internal_${i}_${t.blockNumber}`,
    logIndex: t.traceId ?? t.transactionIndex ?? 0,
  }));
  const tokenNorm = token.map((t) => ({
    ...t,
    __bucket: "token",
    hash: t.hash || t.transactionHash,
    logIndex: typeof t.logIndex === "string" ? parseInt(t.logIndex) : t.logIndex ?? 0,
  }));

  const merged = [...normalNorm, ...internalNorm, ...tokenNorm].filter((t) => {
    const k = key(t.hash, t.logIndex);
    if (!t.hash && t.__bucket !== "internal") return false;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  return { normal: normalNorm, internal: internalNorm, token: tokenNorm, merged };
}


const saveSnapshotForAddress = async (address) => {
// const { address } = req.body || {};
    if (!isValidAddress(address))
      return res.status(400).json({ error: "Provide valid 0x address" });

    const { normal, internal, token, merged } = await fetchAllForAddress(address);

    const payload = {
      fetchedAt: new Date().toISOString(),
      address: address.toLowerCase(),
      counts: {
        normal: normal.length,
        internal: internal.length,
        token: token.length,
        merged: merged.length,
      },
      normal,
      internal,
      token,
    };

    const files = saveSnapshot(address.toLowerCase(), payload);
    const heur = quickHeuristic(normal, token, address);
}

async function getTokenPriceUSD(contract) {
  try {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${contract}`;
    const { data } = await axios.get(url, { timeout: 10000 });
    const pairs = data?.pairs || [];
    const usd = pairs
      .map(p => Number(p?.priceUsd || 0))
      .filter(v => v > 0)
      .sort((a,b)=>b-a)[0];
    return usd || 0;
  } catch {
    return 0;
  }
}

// ---------- helpers ----------
function topContractsByCount(tokenTx, n) {
  const map = new Map();
  for (const t of tokenTx || []) {
    const c = (t.contractAddress || "").toLowerCase();
    if (!c) continue;
    map.set(c, (map.get(c) || 0) + 1);
  }
  return [...map.entries()]
    .sort((a,b)=>b[1]-a[1])
    .slice(0, n)
    .map(([c])=>c);
}

async function getEthPriceUSD() {
  const { data } = await axios.get(
    "https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT",
    { timeout: 10000 }
  );
  return Number(data?.price || 0);
}
function isValidAddress(addr) {
  return /^0x[a-fA-F0-9]{40}$/.test(addr || "");
}
// ---------- main one-shot for a wallet ----------
exports.analyzeOnce = async (address) => {
  const addrLC = address.toLowerCase();

  // 1) Fetch fresh snapshot (your server does the heavy lifting)
  await saveSnapshotForAddress(address);

  // 2) Load snapshot
  const safe = `eth_${addrLC}.json`;
  const jsonPath = path.join(DATA_DIR, safe);
  const payload = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  const normal = payload.normal || [];
  const token  = payload.token  || [];

  // 3) Prepare numeric inputs the AI can use
  const { inWei, outWei } = sumETHWei(normal, addrLC);
  const netDepositedETH = Number(inWei - outWei) / 1e18;

  // Current ETH balance (v1 balance endpoint is simplest)
  let currETH = null;
  try {
    const { data: balResp } = await axios.get(
      `https://api.etherscan.io/api`,
      { params: { module: "account", action: "balance", address, tag: "latest", apikey: process.env.ETHERSCAN_API_KEY }, timeout: 15000 }
    );
    currETH = Number(balResp?.result || 0) / 1e18;
  } catch {}

  const ethPriceUSD = await getEthPriceUSD();

  // Top-N contracts by activity and their prices (best-effort)
  const topContracts = topContractsByCount(token, MAX_PRICED_TOKENS);
  const tokensPriced = [];
  for (const c of topContracts) {
    const price = await getTokenPriceUSD(c);
    tokensPriced.push({ contract: c, priceUsd: price || null });
  }

  // 4) Build AI input (counts, heuristic, lightweight pricing/balance features)
  const aiInput = {
    address,
    counts: payload.counts,
    heuristic: payload.heuristic || null, // your server may include it; if not, the AI will infer from counts/timestamps
    features: {
      eth: {
        currETH,
        ethPriceUSD,
        netDepositedETH,
        estValueUSD: currETH != null && ethPriceUSD ? currETH * ethPriceUSD : null
      },
      tokenPricing: tokensPriced,
      notes: [
        "ETH ROI and token balances are approximate.",
        "Internal tx and gas costs are not fully accounted.",
        "Token balances are not computed; only token prices are provided."
      ]
    },
    samples: {
      // To help the model reason, we include only brief samples (avoid dumping 25k tx)
      // Provide last N timestamps and a few counterparties statistics
      lastTimeStamps: [...normal.slice(-10), ...token.slice(-10)]
        .map(t => Number(t.timeStamp || 0)).filter(Boolean).slice(-10),
      tokenSymbolsSample: [...new Set(token.slice(-50).map(t => (t.tokenSymbol || "").toUpperCase()))]
        .filter(Boolean).slice(0, 20)
    }
  };

  // 5) Ask the AI for a structured assessment (risk + performance + summary)
  const ai = await aiAssess(aiInput);

  // 6) Save combined report
  const report = {
    generatedAt: new Date().toISOString(),
    address,
    counts: payload.counts,
    heuristic: payload.heuristic || null,
    ai, // <-- AI owns: riskScore, riskReasons, label, performance, summary, notes
  };

  // const outPath = path.join(REPORT_DIR, `report_${address.toLowerCase()}_${Date.now()}.json`);
  // fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  // console.log(`[agent] Report saved: ${path.basename(outPath)}`);

  return report;
}

// // ---- Run once for all wallets in .env ----
// export async function runOnceAll(WALLETS) {
//   const results = [];
  
//   for (const w of WALLETS) {
//     try { results.push(await analyzeOnce(w)); }
//     catch (e) { console.error(`[agent] ${w} failed:`, e.message); }
//   }
//   return results;
// }