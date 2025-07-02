import { Router } from "express";
import { verifyUser, verifyAdmin } from "../../middleware/authMiddleware.js";
import products from "../../models/Product.js";

const router = Router();

//get all product
router.get("/", async (req, res) => {
  try {
    const allProducts = await products.find();
    const returnProducts = allProducts.map((product) => ({
      name: product.name,
      price: product.price,
      currency: product.currency,
      description: product.description,
      image: product.image,
      _id: product._id,
    }));
    res.status(200).send(returnProducts);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//get product by id
router.get("/:id", async (req, res) => {
  try {
    const currentProduct = await products.findById(req.params.id);
    if (!currentProduct) return res.status(404).send("product not found");
    const returnProduct = {
      name: currentProduct.name,
      price: currentProduct.price,
      currency: currentProduct.currency,
      description: currentProduct.description,
      image: currentProduct.image,
      _id: currentProduct._id,
    };
    res.status(200).send(returnProduct);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//create product
router.post("/", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { name, price, currency, description, image } = req.body;

    if (!name || !price || !currency || !description || !image)
      return res.status(400).send("invalid request");

    if (name.length < 2)
      return res.status(400).send("name should have at least 3 character");

    if (price < 0) return res.status(400).send("price must be greater then 0");

    if (description.trim().split(/\s+/).length < 1)
      return res.status(400).send("description should have at least 1 word");

    if (currency !== "$" && currency !== "₪" && currency !== "€")
      return res.status(400).send("invalid currency");

    const isProductExist = await products.findOne({ name });
    if (isProductExist) return res.status(400).send("product already exist");

    const product = await products.create({
      name,
      price,
      currency,
      description,
      image,
    });
    const returnProduct = {
      name: product.name,
      price: product.price,
      currency: product.currency,
      description: product.description,
      image: product.image,
      _id: product._id,
    };
    res
      .status(200)
      .send({ message: "product created successfully", returnProduct });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//edit product
router.put("/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const { name, price, currency, description, image } = req.body;
    const currentProduct = await products.findById(req.params.id); //find the product
    if (!currentProduct) return res.status(404).send("product not found");
    if (!name || !price || !currency || !description || !image)
      return res.status(400).send("invalid request");

    if (name.length < 2)
      return res.status(400).send("name should have at least 3 character");

    if (price < 0) return res.status(400).send("price must be greater then 0");

    if (description.trim().split(/\s+/).length < 1)
      return res.status(400).send("description should have at least 1 word");

    if (currency !== "$" && currency !== "₪" && currency !== "€")
      return res.status(400).send("invalid currency");
    const updateProduct = await products.findByIdAndUpdate(
      req.params.id,
      { name, price, currency, description, image },
      { new: true }
    );
    const returnProduct = {
      name: updateProduct.name,
      price: updateProduct.price,
      currency: updateProduct.currency,
      description: updateProduct.description,
      image: updateProduct.image,
      _id: updateProduct._id,
    };
    res.status(200).send({ message: "update successfully", returnProduct });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//delete product
router.delete("/:id", verifyUser, verifyAdmin, async (req, res) => {
  try {
    const deleteProduct = await products.findByIdAndDelete(req.params.id);
    if (!deleteProduct) return res.status(404).send("product not found");
    res.send({ message: "product deleted", _id: deleteProduct._id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
