require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ---------- MongoDB (Mongoose) ----------
const looksLikeEvmAddress = v => typeof v === "string" && /^0x[a-fA-F0-9]{40}$/.test(v);

// subdocument schema for assets
const AssetSchema = new mongoose.Schema(
  {    
    address: {
      type: String,
      required: true,
      validate: {
        validator: looksLikeEvmAddress,
        message: "assets.address must be a 0x-prefixed 40-hex address"
      }
    },
    share: {
      type: Number,
      required: true,
      min: [0, "assets.share must be > 0"],
    }
  },
  { _id: false }
);

const FundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    descirption: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    commission: {
      type: Number,
      required: true,
      min: [0, "commission must be between 0 and 100"],
      max: [100, "commission must be between 0 and 100"]
    },
    assets: {
      type: [AssetSchema],
      validate: [
        {
          validator: function (arr) {
            return Array.isArray(arr) && arr.length > 0;
          },
          message: "assets must be a non-empty array"
        },
        {
          // sum of shares must equal 100 (± 1e-6 tolerance)
          validator: function (arr) {
            const sum = arr.reduce((s, a) => s + (Number(a.share) || 0), 0);
            return Math.abs(sum - 100) < 1e-6;
          },
          message: "sum of all asset 'share' values must equal 100"
        }
      ]
    },
    status: {
      type: String,
      enum: ["pending" , "active", "inactive", "closed"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// helpful index for filtering by asset address
// FundSchema.index({ "assets.address": 1 });

const Fund = mongoose.model("Fund", FundSchema);

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI missing in .env");
  await mongoose.connect(uri, { autoIndex: true });
  console.log("✅ Connected to MongoDB");
}

// ---------- Routes ----------

// Health
app.get("/", (_req, res) => res.send("Hedge Fund API (Mongo) is running"));

// Create a hedge fund
app.post("/funds", async (req, res) => {
  try {
    const { name, descirption , commission, assets } = req.body;

    // normalize shares to numbers
    const normAssets = Array.isArray(assets)
      ? assets.map(a => ({ address: a.address, share: Number(a.share) }))
      : assets;

    const fund = await Fund.create({
      name: (name || "").trim(),
      descirption: (descirption || "").trim(),
      commission: Number(commission),
      assets: normAssets
    });

    res.status(201).json(fund);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        errors: Object.values(err.errors).map(e => e.message)
      });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all funds (filter + pagination)
app.get("/funds", async (req, res) => {
  try {
    const { address } = req.query;
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "25", 10)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (address && typeof address === "string") {
      filter["assets.address"] = address;
    }

    const [data, total] = await Promise.all([
      Fund.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Fund.countDocuments(filter)
    ]);

    res.json({ page, limit, total, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a fund by id
app.get("/funds/:id", async (req, res) => {
  try {
    const fund = await Fund.findById(req.params.id).lean();
    if (!fund) return res.status(404).json({ error: "Fund not found" });
    res.json(fund);
  } catch (err) {
    // invalid ObjectId
    if (err.name === "CastError") {
      return res.status(400).json({ error: "Invalid fund id" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ---------- Server ----------
const PORT = process.env.PORT || 3000;
connect()
  .then(() => app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`)))
  .catch(err => {
    console.error("Mongo connection failed:", err.message);
    process.exit(1);
  });
