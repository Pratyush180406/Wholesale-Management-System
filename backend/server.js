const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

require("dotenv").config()
// Middleware
app.use(cors());
app.use(express.json());

// 3. Validate environment variables
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Schemas
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, default: "" },
    category: { type: String, default: "General" },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["In Stock", "Low Stock", "Out of Stock"],
      default: "In Stock",
    },
  },
  { timestamps: true }
);

// Auto-set status based on quantity
ProductSchema.pre("save", function (next) {
  if (this.quantity === 0) this.status = "Out of Stock";
  else if (this.quantity <= 10) this.status = "Low Stock";
  else this.status = "In Stock";
  next();
});

const Product = mongoose.model("Product", ProductSchema);

// Root route
app.get("/", (req, res) => {
  res.send("WMS API is running...");
});

// ─── Routes ───────────────────────────────────────────

// Get all products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add product
app.post("/products", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
app.put("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
app.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats
app.get("/stats", async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ status: "Out of Stock" });
    const lowStock = await Product.countDocuments({ status: "Low Stock" });
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ["$price", "$quantity"] } } } },
    ]);
    res.json({
      total,
      outOfStock,
      lowStock,
      totalValue: totalValue[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Connect to MongoDB before starting Express
async function startServer() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is missing. Check your .env file.");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("✅ MongoDB Atlas Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err.message);
    process.exit(1);
  }
}

// Start application
startServer();