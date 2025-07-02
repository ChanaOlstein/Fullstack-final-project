import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSelectedUser, setUsers } from "./userSlice";
import { deleteUser, fetchAllUsers, updateUser } from "../../api/usersApi";
import { MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import type { User } from "../../Auth/authSlice";
import { useNavigate } from "react-router";
import styles from "./Users.module.css";
import { toast } from "react-toastify";

const Users = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const users = useAppSelector((state) => state.users.users);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [dispatch]);
  const fetchUsers = async () => {
    try {
      const allUsers = await fetchAllUsers();
      dispatch(setUsers(allUsers));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId); //delete the user by the id
      const updatedUsers = users.filter((user) => user._id !== userId); //return the list of users without the deleted user
      dispatch(setUsers(updatedUsers)); //update the users list in redux
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((user) => user._id === userId);
    if (user) {
      dispatch(setSelectedUser(user));
      setFormData(user);
      setEditMode(true);
    }
  };

  const handleSave = async () => {
    try {
      const updatedResponse = await updateUser(formData);
      const updated = updatedResponse?.returnUser;

      if (!updated) {
        toast.success(`Email already exists. Please use a different email.`);
        console.error("Update failed no data returned");
        return;
      }
      const updatedUsers = users.map((user) =>
        user._id === updated._id ? updated : user
      );
      dispatch(setUsers(updatedUsers));
      console.log(users);

      dispatch(setSelectedUser(null));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleViewOrders = (user: User) => {
    navigate(`/admin/orders/${user._id}`);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Users List</h2>
      {users.length === 0 ? (
        <span className={styles.noUsers}>No users found.</span>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user._id)}
                    className={styles.iconBtn}
                  >
                    <MdDeleteOutline />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditUser(user._id)}
                    className={styles.iconBtn}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleViewOrders(user)}
                    className={styles.iconBtn}
                  >
                    View Orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editMode && (
        <>
          <div className={styles.backdrop} />
          <div className={styles.modal}>
            <h3>Edit User</h3>
            <label>
              Name:
              <input
                type="text"
                name="name"
                placeholder="name:"
                value={formData.name}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                name="email"
                placeholder="email:"
                value={formData.email}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Role:
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="guest">Guest</option>
              </select>
            </label>
            <br />
            <div className={styles.modalActions}>
              <button onClick={handleSave} className={styles.saveBtn}>
                save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className={styles.cancelBtn}
              >
                cancel
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Users;
