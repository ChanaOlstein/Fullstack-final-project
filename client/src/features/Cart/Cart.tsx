import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../api/cartApi";
import { setCart } from "../Cart/cartSlice";
import { createOrder, getUserOrders } from "../api/ordersApi";
import { setOrders } from "../Orders/OrdersSlice";
import styles from "./Cart.module.css";
import { toast } from "react-toastify";

const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Load cart when the user is authenticated
  useEffect(() => {
    async function loadCart() {
      if (!currentUser) return; // Skip if user not logged in
      try {
        const data = await fetchCart(); // Fetch cart from API
        const items = Array.isArray(data) ? data : data.items || []; // Extract items safely
        //Checks if DATA is an array, if so → items = data, otherwise return an empty array []
        dispatch(setCart(items));
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    }
    loadCart();
  }, [currentUser, dispatch]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFromCart(productId); // Remove product from cart via API
      const data = await fetchCart(); // Refresh cart
      const items = Array.isArray(data) ? data : data.items || [];
      dispatch(setCart(items));
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  const handleClear = async () => {
    try {
      await clearCart();
      dispatch(setCart([]));
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  const handleIncrease = async (productId: string, currentQuantity: number) => {
    try {
      const newQuantity = currentQuantity + 1;
      await updateCart(productId, newQuantity);
      const data = await fetchCart(); // Refresh
      const items = Array.isArray(data) ? data : data.items || [];
      dispatch(setCart(items));
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  };

  const handleDecrease = async (productId: string, currentQuantity: number) => {
    try {
      if (currentQuantity > 1) {
        const newQuantity = currentQuantity - 1;
        await updateCart(productId, newQuantity);
      } else {
        await removeFromCart(productId);
      }
      const data = await fetchCart();
      const items = Array.isArray(data) ? data : data.items || [];
      dispatch(setCart(items));
    } catch (error) {
      console.error("Failed to decrease quantity:", error);
    }
  };

  const total = safeCartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);

  const handlePlaceOrder = async () => {
    try {
      if (safeCartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      const orderItems = safeCartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      }));
      await createOrder(orderItems);
      const updatedOrders = await getUserOrders();
      dispatch(setOrders(updatedOrders));
      await clearCart();
      dispatch(setCart([]));
      navigate("/orders");
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Shopping Cart</h2>
      {safeCartItems.length === 0 ? (
        <span className={styles.empty}>Your cart is empty.</span>
      ) : (
        <ul className={styles.cartList}>
          {safeCartItems.map(
            (item) =>
              item.product && (
                <li key={item.product._id} className={styles.cartCard}>
                  <img
                    src={item.product.image || "/images/placeholder.png"}
                    alt={item.product.name}
                    className={styles.image}
                  />
                  <div className={styles.details}>
                    <h3>{item.product.name}</h3>
                    <div>
                      <span className={styles.bold}>Price:</span>{" "}
                      {item.product.price} {item.product.currency}
                    </div>
                    <div className={styles.quantity}>
                      <span className={styles.bold}>Quantity:</span>
                      <button
                        onClick={() =>
                          handleDecrease(item.product._id, item.quantity)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncrease(item.product._id, item.quantity)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div>
                      <span className={styles.bold}>Total:</span>{" "}
                      {(item.product.price * item.quantity).toFixed(2)}{" "}
                      {item.product.currency}
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.product._id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              )
          )}
        </ul>
      )}
      <h3 className={styles.total}>Total: {total.toFixed(2)}$</h3>
      {cartItems.length > 0 && (
        <button type="button" onClick={handleClear} className={styles.clearBtn}>
          Clear Cart
        </button>
      )}
      <button
        type="button"
        onClick={handlePlaceOrder}
        className={styles.placeOrderBtn}
      >
        Place Order
      </button>
    </div>
  );
};

export default Cart;
