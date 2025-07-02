import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect } from "react";
import { fetchAllProducts } from "../api/productApi";
import { setCurrentProduct, setProducts, type Product } from "./productsSlice";
import { addToCart } from "../api/cartApi";
import { setCart } from "../Cart/cartSlice";
import styles from "./products.module.css";
import { toast } from "react-toastify";

const Products = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const products = useAppSelector((state) => state.product.products); //Retrieves the list of products saved in "products"
  const user = useAppSelector((state) => state.auth.currentUser); //Retrieves the current user.

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchAllProducts(); //Calling API to get products from the server
        dispatch(setProducts(data)); //Updates the products within Redux so they are available throughout the app.
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    dispatch(setCurrentProduct(null)); //Reset currentProduct in Redux (so as not to use previous product details).
    navigate("/admin/products/add"); //Navigate to the add page
  };

  const handleAddToCart = async (product: Product) => {
    try {
      const updatedCart = await addToCart(product._id, 1);
      dispatch(setCart(updatedCart));
      toast.success(`${product.name} added to cart ✅`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("You Should Login First!");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Our Product</h2>
      {user?.role === "admin" && (
        <button onClick={() => handleAddProduct()} className={styles.addButton}>
          Add Product
        </button>
      )}

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
              <span className={styles.productPrice}>
                {product.currency}
                {product.price}
              </span>
              <div className={styles.buttons}>
                <Link to={`/products/${product._id}`} className={styles.view}>
                  View
                </Link>
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className={styles.addToCartButton}
                >
                  Add to cart
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Products;
