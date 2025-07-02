import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { Link, useNavigate } from "react-router";
import { setCurrentUser } from "./authSlice";
import { registerUser } from "../api/loginApi";
import style from "./AuthForm.module.css";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Prevents the default page refresh when submitting a form.
    setError(""); //Resets old errors if any.
    const newUser = {
      name,
      email,
      password,
      role: "user",
    }; //Constructs an object with the user information. And updates ROLE to be USER

    try {
      const registeredUser = await registerUser(newUser); //Sends the user to the server via registerUser.
      //The response is an object containing user and message.

      dispatch(setCurrentUser(registeredUser.user)); //Sends the user we received from the server to Redux
      //  and saves it as the current user.
      setSuccessMessage(registeredUser.message);
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/products"); //Takes the user to the products page after successful login.
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <div className={style.authContainer}>
      <h2>sign in</h2>
      <form onSubmit={(e) => handleSubmit(e)} className={style.authForm}>
        <label htmlFor="name"></label>
        <input
          type="text"
          placeholder="Full Name:"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

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
          placeholder="Password:"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Sign In</button>
      </form>
      {error && <span className={style.errorMessage}>{error}</span>}

      <div className={style.authLinks}>
        Have an account? <Link to="/login">Login Here</Link>
      </div>
      {successMessage && (
        <span className={style.successMessage}>{successMessage}</span>
      )}
    </div>
  );
};

export default SignIn;
