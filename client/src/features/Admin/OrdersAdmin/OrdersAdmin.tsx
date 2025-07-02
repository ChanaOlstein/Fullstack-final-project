import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getOrdersByUserId } from "../../api/ordersApi";
import { useParams } from "react-router";
import { setOrders } from "../../Orders/OrdersSlice";
import styles from "./OrdersAdmin.module.css";

const OrdersAdmin = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const { userId } = useParams();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      try {
        const data = await getOrdersByUserId(userId);
        dispatch(setOrders(data));
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, [userId, dispatch]);

  const handleDeleteOrder = async (orderId: string) => {
    try {
      console.log("Delete order:", orderId);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Orders for User {userId}</h2>
      {orders.length === 0 ? (
        <span className={styles.empty}>No orders found for this user.</span>
      ) : (
        orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <span className={styles.orderId}>Order ID: {order._id}</span>
            <br />
            <ul className={styles.itemList}>
              {order.items.map((item, idx) => (
                <li key={idx} className={styles.item}>
                  {item.product?.name} - {item.quantity} × {item.product?.price}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleDeleteOrder(order._id)}
              className={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersAdmin;
