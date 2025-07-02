const BASE_URL = "http://localhost:3003";

//sign in
export const registerUser = async (user: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      credentials: "include", //The browser will send the cookie from the server with the request.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user), //Converts the user object to JSON text.
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }
    return await response.json(); //If everything is OK, returns the registered user.
  } catch (error) {
    console.error("Registration error:", error);
  }
};

//login
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
  }
};

//checks if the user already login
export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      credentials: "include",
    });

    if (!res.ok) throw new Error("User not authenticated");

    return await res.json();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};
