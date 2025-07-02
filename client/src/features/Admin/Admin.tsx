import { Link, Outlet } from "react-router";
import styles from "./Admin.module.css";

const Admin = () => {
  return (
    <div className={styles.container}>
      <ul className={styles.adminList}>
        <li>
          <Link to="products" className={styles.link}>
            Manage Products
          </Link>{" "}
          {/*An internal link that takes the user to the admin/products path. */}
        </li>
        <li>
          <Link to="users" className={styles.link}>
            users management
          </Link>
          {/* */}
        </li>
      </ul>
      <div className={styles.outletWrapper}>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
