import { Link, useNavigate } from "react-router";
import style from "./Nav.module.css";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCurrentUser } from "../../features/Auth/authSlice";
import { setCart } from "../../features/Cart/cartSlice";
import { setOrders } from "../../features/Orders/OrdersSlice";

const Nav = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const handleLogOut = async () => {
    try {
      const res = await fetch("http://localhost:3003/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      dispatch(setCurrentUser(null));
      dispatch(setCart([]));
      dispatch(setOrders([]));
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <header className={style.header}>
      <h1>Shopping Online</h1>
      <nav className={style.nav}>
        <ul className={style.pages}>
          <li>
            <Link to="/products" className={style.navLink}>
              Products
            </Link>
          </li>
          <li>
            <Link to="/carts" className={style.navLink}>
              Cart
            </Link>
          </li>
          <li>
            <Link to="/orders" className={style.navLink}>
              Orders
            </Link>
          </li>
          {currentUser?.role === "admin" && (
            <li>
              <Link to="/admin" className={style.navLink}>
                Admin
              </Link>
            </li>
          )}
          {currentUser && (
            <>
              <li>
                <button
                  type="button"
                  onClick={handleLogOut}
                  className={style.navLink}
                >
                  Logout
                </button>
              </li>
              <li>
                <span className={style.userName}>hey {currentUser.name}</span>
              </li>
            </>
          )}
          {!currentUser && (
            <>
              <li>
                <Link to="/" className={style.navLink}>
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className={style.navLink}>
                  Log in
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Nav;
