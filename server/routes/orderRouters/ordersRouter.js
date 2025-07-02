import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../middleware/authMiddleware.js";
import orders from "../../models/order.js";
import products from "../../models/Product.js";
import { log } from "node:console";

const router = Router();

// GET user's own orders
router.get("/", verifyUser, async (req, res) => {
  try {
    const userOrders = await orders
      .find({ customer: req.user._id }) //get all the user orders
      .populate("items.product", "name price currency description");
    //gives the name price currency description from product schema

    res.status(200).send(userOrders);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/user/:userId", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const userOrders = await orders
      .find({ customer: req.params.userId })
      .populate("items.product");
    res.json(userOrders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user orders" });
  }
});

// POST create new order
router.post("/", verifyUser, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send("no items in order");
    }
    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        return res.status(400).send("invalid item in order");
      }
    }
    const newOrder = await orders.create({
      customer: req.user._id,
      items,
    });
    const populatedOrder = await orders
      .findById(newOrder._id)
      .populate("items.product", "name price currency description");
    res
      .status(201)
      .send({ message: "Order created successfully", order: populatedOrder });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// DELETE order by ID
router.delete("/:id", verifyUser, async (req, res) => {
  try {
    const order = await orders.findById(req.params.id);
    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }
    if (
      order.customer.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .send({ error: "Not authorized to delete this order" });
    }

    await orders.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
