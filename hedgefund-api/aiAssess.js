// aiAssess.js — ask the LLM to return strict JSON with risk + performance + summary
const  dotenv =  require("dotenv");
dotenv.config();

exports.aiAssess = async (input) => {
  const { OpenAI } = await import("openai");

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined, // supports OpenRouter
  });

  const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

  // We give the model structured inputs and ask for a strict JSON object.
  const systemPrompt =
    "You are an on-chain risk and performance analyst. " +
    "Return STRICT JSON ONLY (no prose). " +
    "Be conservative and avoid financial advice. " +
    "If data is insufficient, estimate cautiously and say so in notes.";

  const userPayload = {
    spec: {
      // What we expect back:
      schema: {
        riskScore: "number(0-100, where 100 is highest risk)",
        riskReasons: "string[]",
        label: "string (e.g., Dormant|Neutral|Active|Aggressive|Exchange|Bot|Whale)",
        performance: {
          eth: {
            currETH: "number|null",
            netDepositedETH: "number|null",
            ethPriceUSD: "number|null",
            estValueUSD: "number|null",
            roiPercent: "number|null"
          },
          tokens: [
            {
              contract: "string",
              symbol: "string|null",
              estBalance: "number|null",
              priceUsd: "number|null",
              estValueUsd: "number|null"
            }
          ]
        },
        summary: "string (120-160 words, concise)",
        notes: "string[]"
      }
    },
    // Raw features the model can reason over:
    input
  };

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: JSON.stringify(userPayload) }
  ];

  // Try to request a JSON object response (OpenAI supports response_format; OpenRouter passes through for many models)
  let content = "";
  try {
    const resp = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.2,
      response_format: { type: "json_object" }
    });
    content = resp.choices?.[0]?.message?.content || "{}";
  } catch {
    // Fallback without response_format if provider/model doesn't support it
    const resp = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.2
    });
    content = resp.choices?.[0]?.message?.content || "{}";
  }

  // Parse or fall back to a safe shape
  try {
    const parsed = JSON.parse(content);
    // Minimal shape guard
    return {
      riskScore: Number(parsed?.riskScore ?? 50),
      riskReasons: Array.isArray(parsed?.riskReasons) ? parsed.riskReasons : [],
      label: parsed?.label || "Neutral",
      performance: parsed?.performance ?? { eth: {}, tokens: [] },
      summary: parsed?.summary || "",
      notes: Array.isArray(parsed?.notes) ? parsed.notes : []
    };
  } catch {
    return {
      riskScore: 50,
      riskReasons: ["AI returned non-JSON response"],
      label: "Neutral",
      performance: { eth: {}, tokens: [] },
      summary: content?.slice(0, 500) || "",
      notes: []
    };
  }
}
