const BASE_URL = "http://localhost:3003";

export async function fetchCart() {
  const res = await fetch(`${BASE_URL}/carts`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cart");
  return res.json();
}

export async function addToCart(productId: string, quantity = 1) {
  const res = await fetch(`${BASE_URL}/carts/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to add to cart");
  return res.json();
}

export async function updateCart(productId: string, quantity: number) {
  const res = await fetch(`${BASE_URL}/carts/update`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity }),
  });
  if (!res.ok) throw new Error("Failed to update cart");
  return res.json();
}

export async function removeFromCart(productId: string) {
  const res = await fetch(`${BASE_URL}/carts/remove/${productId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
}

export async function clearCart() {
  const res = await fetch(`${BASE_URL}/carts/clear`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}
