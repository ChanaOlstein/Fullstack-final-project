const BASE_URL = "http://localhost:3003";

//add order
export const createOrder = async (
  items: {
    product: string;
    quantity: number;
  }[]
) => {
  try {
    console.log(items);

    const response = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    const data = await response.json();
    console.log(data);

    return data.order;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get user orders
export const getUserOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to fetch orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//get all orders-admin
export const getOrdersByUserId = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/user/${userId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to fetch user orders");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//delete order
export const deleteOrder = async (orderId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to delete order");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
