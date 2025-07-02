import type { User } from "../Auth/authSlice";

const BASE_URL = "http://localhost:3003";

//get  all users
export const fetchAllUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (error) {
    console.error("fetch error:", error);
  }
};

//get user by id
export const fetchUserById = async (userId: string) => {
  try {
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch user");
    return await res.json();
  } catch (error) {
    console.error("fetch error:", error);
  }
};

//create user
export const fetchCreateUser = async (user: User) => {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

//edit user
export const updateUser = async (updateUser: {
  _id: string;
  name: string;
  email: string;
  role: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${updateUser._id}`, {
      method: "put",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUser),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return await response.json();
  } catch (error) {
    console.error("edit user error:", error);
  }
};

//delete user
export const deleteUser = async (userId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};
