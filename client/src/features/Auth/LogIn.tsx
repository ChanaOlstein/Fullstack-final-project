import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setCurrentUser } from "./authSlice";
import { Link, useNavigate } from "react-router";
import { loginUser } from "../api/loginApi";
import style from "./AuthForm.module.css";

const LogIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); //Resets the previous error message.
    try {
      const loggedInUser = await loginUser({ email, password });
      //Sends the data to the server and waits for a response via the loginUser API function.
      dispatch(setCurrentUser(loggedInUser.user)); //Saves the logged in user in Redux
      // (so that the entire application knows that he is logged in).

      setSuccessMessage(loggedInUser.message);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/products"); //Takes the user to the products page after successful login.
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  return (
    <div className={style.authContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={style.authForm}>
        <label htmlFor="email"></label>
        <input
          type="text"
          placeholder="Email:"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password"></label>
        <input
          type="text"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      {error && <span className={style.errorMessage}>{error}</span>}
      <div className={style.authLinks}>
        New Here? <Link to="/">Sign Up Here</Link>
      </div>
      {successMessage && (
        <span className={style.successMessage}>{successMessage}</span>
      )}
    </div>
  );
};

export default LogIn;
