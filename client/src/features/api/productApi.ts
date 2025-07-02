import type { Product } from "../Products/productsSlice";

const BASE_URL = "http://localhost:3003";

//get all products
export const fetchAllProducts = async () => {
  try {
    const res = await fetch(`${BASE_URL}/products`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
  } catch (error) {
    console.error("fetch error:", error);
  }
};

//get product by id
export const fetchProductById = async (productId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

//edit product by admin.
export const editProduct = async (updateProduct: Product) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${updateProduct._id}`, {
      method: "put",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("edit product error:", error);
  }
};

//add product
export const createProduct = async (product: Product) => {
  try {
    const response = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Create product error:", error);
    throw error;
  }
};

//delete product
export const deleteProduct = async (productId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Delete product error:", error);
    throw error;
  }
};
