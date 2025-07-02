import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setOrders } from "./OrdersSlice";
import { getUserOrders } from "../api/ordersApi";
import styles from "./Orders.module.css";

const Orders = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders); //Accessing the orders state from Redux

  //Fetch user's orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(); // API call to fetch current user's orders
        dispatch(setOrders(data)); // Save fetched orders in Redux
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Order History</h2>
      {orders.length === 0 ? (
        <span className={styles.noOrders}>No orders yet.</span>
      ) : (
        orders.map((order) => {
          const total = order.items.reduce((sum, item) => {
            if (!item.product) return sum;
            return sum + item.quantity * item.product.price;
          }, 0);

          return (
            <div key={order._id} className={styles.orderCard}>
              <span className={styles.orderId}>
                <strong>Order ID:</strong> {order._id}
              </span>
              <ul className={styles.itemsList}>
                {order.items.map((item, idx) => (
                  <li key={idx} className={styles.item}>
                    {item.product ? (
                      <>
                        {item.product.name} - {item.quantity} x{" "}
                        {item.product.price} {item.product.currency}
                      </>
                    ) : (
                      <span className={styles.missingProduct}>
                        Product no longer available
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <div className={styles.total}>
                <strong>Total:</strong> {total.toFixed(2)}{" "}
                {order.items.find((item) => item.product)?.product.currency ||
                  ""}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Orders;
