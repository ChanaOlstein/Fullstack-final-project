import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteProduct, fetchProductById } from "../api/productApi";
import { useEffect } from "react";
import { setCurrentProduct, type Product } from "./productsSlice";
import { addToCart } from "../api/cartApi";
import { setCart } from "../Cart/cartSlice";
import styles from "./CurrentProduct.module.css";
import { toast } from "react-toastify";

const CurrentProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); //takes the id param from the url
  const currentProduct = useAppSelector(
    (state) => state.product.currentProduct
  ); //Retrieves the current product from Redux
  const user = useAppSelector((state) => state.auth.currentUser);
  //Retrieves the currently logged in user to check if they are an admin and can edit/delete.

  useEffect(() => {
    const loadProduct = async () => {
      //A function that fetches a product by ID from the server. If there is no id, exits.
      if (!id) return;
      const product = await fetchProductById(id); //calls the api- get product by id
      if (product) dispatch(setCurrentProduct(product)); //If you receive a product, you send it to Redux.
    };
    loadProduct(); //Runs the function you wrote immediately when the component is loaded.
  }, [id, dispatch]);

  const handleEdit = async (product: Product) => {
    dispatch(setCurrentProduct(product)); //Saves the product for editing.
    navigate(`/admin/products/edit/${product._id}`); //Navigates to /admin/products/edit/ID to edit the specific product.
  };
  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct(productId);
    } catch {
      console.error("Error deleting product:");
    }
  }; //Deletes a product by ID, then refreshes the product list to display the updated list.

  const handleAddToCart = async (product: Product) => {
    try {
      const updatedCart = await addToCart(product._id, 1);
      dispatch(setCart(updatedCart));
      toast.success(`${product.name} added to cart ✅`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add product to cart ❌");
    }
  };

  if (!currentProduct) return <div>Loading...</div>;
  return (
    <div className={styles.card}>
      <img
        src={currentProduct.image || "/images/placeholder.png"}
        alt={currentProduct.name}
        className={styles.image}
      />

      <div className={styles.details}>
        <h3 className={styles.name}>{currentProduct.name}</h3>
        <span className={styles.description}>{currentProduct.description}</span>
        <span className={styles.price}>
          {currentProduct.currency}
          {currentProduct.price}
        </span>
        <button
          type="button"
          onClick={() => handleAddToCart(currentProduct)}
          className={styles.addToCart}
        >
          Add to cart
        </button>

        {user?.role === "admin" && (
          <div className={styles.adminButtons}>
            <button
              onClick={() => handleEdit(currentProduct)}
              className={styles.edit}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(currentProduct._id)}
              className={styles.delete}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentProduct;
