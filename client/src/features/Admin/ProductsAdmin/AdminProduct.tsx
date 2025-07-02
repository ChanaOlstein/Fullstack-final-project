import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { deleteProduct, fetchAllProducts } from "../../api/productApi";
import {
  setCurrentProduct,
  setProducts,
  type Product,
} from "../../Products/productsSlice";
import { useNavigate } from "react-router";
import styles from "./AdminProductList.module.css";

const AdminProductList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const products = useAppSelector((state) => state.product.products);

  useEffect(() => {
    fetchProducts();
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const data = await fetchAllProducts();
      dispatch(setProducts(data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }; //An asynchronous function that fetches all products from the server and updates Redux using setProducts.

  const handleEdit = async (product: Product) => {
    dispatch(setCurrentProduct(product)); //Saves the product for editing.
    navigate(`edit/${product._id}`); //Navigates to /admin/products/edit/ID to edit the specific product.
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch {
      console.error("Error deleting product:");
    }
  }; //Deletes a product by ID, then refreshes the product list to display the updated list.

  const handleAddProduct = () => {
    dispatch(setCurrentProduct(null)); //Reset currentProduct in Redux (so as not to use previous product details).
    navigate("add"); //Navigate to the add page
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Admin - Product Management</h2>
      <button
        type="button"
        onClick={handleAddProduct}
        className={styles.addButton}
      >
        Add Product
      </button>
      <ul className={styles.productCards}>
        {products.map((product) => (
          <li key={product._id} className={styles.card}>
            <img
              src={product.image || "/images/placeholder.png"}
              alt={product.name}
              className={styles.productImage}
            />
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{product.name}</h3>
              <span className={styles.productDescription}>
                {product.description}
              </span>
              <span className={styles.productPrice}>
                {product.currency}
                {product.price}
              </span>
            </div>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => handleEdit(product)}
                className={styles.view}
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(product._id)}
                className={styles.addToCartButton}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductList;
