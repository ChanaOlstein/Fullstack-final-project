import { Route, Routes } from "react-router";
import "./App.css";
import Nav from "./components/Nav/Nav";
import SignIn from "./features/Auth/SignIn";
import LogIn from "./features/Auth/LogIn";
import Products from "./features/Products/Products";
import CurrentProduct from "./features/Products/currentProduct";
import Cart from "./features/Cart/Cart";
import Admin from "./features/Admin/Admin";
import AdminProduct from "./features/Admin/ProductsAdmin/AdminProduct";
import AddOrEditProduct from "./features/Admin/ProductsAdmin/AddOrEditProduct";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./features/Auth/authSlice";
import Users from "./features/Admin/Users/Users";
import Orders from "./features/Orders/Orders";
import OrdersAdmin from "./features/Admin/OrdersAdmin/OrdersAdmin";
import { ToastContainer } from "react-toastify"; // Toast messages for notifications
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const dispatch = useDispatch();

  // On app load: try to fetch the currently logged-in user (via cookie/session)
  useEffect(() => {
    fetch("https://fullstack-final-project-5bku.onrender.com/auth/me", {
      credentials: "include",
    }) // include cookie for authentication
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((user) => {
        dispatch(setCurrentUser(user)); //// store user in Redux
      })
      .catch((err) => {
        console.log("Not logged in:", err.message);
      });
  }, [dispatch]);

  return (
    <div className="shoppingApp">
      <Nav />
      <div className="routes">
        <Routes>
          <Route path="/" element={<SignIn />}></Route>
          <Route path="login" element={<LogIn />}></Route>
          <Route path="products" element={<Products />}></Route>
          <Route path="/products/:id" element={<CurrentProduct />} />
          <Route path="/carts" element={<Cart />} />
          <Route path="/admin" element={<Admin />}>
            <Route path="products" element={<AdminProduct />} />
            <Route path="products/add" element={<AddOrEditProduct />} />
            <Route path="products/edit/:id" element={<AddOrEditProduct />} />
            <Route path="users" element={<Users />}></Route>
            <Route path="orders/:userId" element={<OrdersAdmin />} />
          </Route>

          <Route path="/orders" element={<Orders />} />
        </Routes>
        <ToastContainer position="bottom-center" />
      </div>
    </div>
  );
};

export default App;
