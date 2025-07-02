import express from "express";
import carts from "../../models/Cart.js";
import { verifyUser } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyUser, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const cart = await carts
      .findOne({ user: req.user._id })
      .populate("items.product");
    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/add", verifyUser, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  try {
    let cart = await carts.findOne({ user: req.user._id });
    if (!cart) {
      cart = new carts({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/update", verifyUser, async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const cart = await carts.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );
    if (itemIndex === -1)
      return res.status(404).json({ error: "Item not in cart" });

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/remove/:productId", verifyUser, async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await carts.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/clear", verifyUser, async (req, res) => {
  try {
    const cart = await carts.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: "Cart cleared" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
