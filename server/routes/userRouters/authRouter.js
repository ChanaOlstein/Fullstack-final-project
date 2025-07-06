import { Router } from "express";
import users from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyUser } from "../../middleware/authMiddleware.js";

const router = Router();

//create user
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send("invalid request");
    }
    if (name.length < 3)
      return res.status(400).send("name should have at least 3 character");
    if (!email.includes("@")) return res.status(400).send("invalid email");
    if (password.length < 6)
      return res.status(400).send("password should have at least 6 digits");

    const isExist = await users.findOne({ email });
    if (isExist) return res.status(400).send("user already exist");

    const salt = await bcrypt.genSalt(); //create a salt to the password
    password = await bcrypt.hash(password, salt); //hashing the password with the salt

    const user = await users.create({ name, email, password, role: "user" });
    const payload = {
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "3d",
    });
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .send({ message: "user created successfully", user: payload });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("email or password are required");
    }
    if (!email.includes("@")) return res.status(400).send("invalid email");
    const currentUser = await users.findOne({ email });
    if (!currentUser) return res.status(404).send("user not found");
    const isPasswordMatch = await bcrypt.compare(
      password,
      currentUser.password
    ); //comparing between the password the the user enter and the pass in DB, return boolean
    if (!isPasswordMatch)
      return res.status(401).send("invalid email or password");
    const payload = {
      name: currentUser.name,
      email: currentUser.email,
      _id: currentUser._id,
      role: currentUser.role,
    };
    const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "3d",
    });
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      })
      .send({ message: "login successfully", user: payload });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/me", verifyUser, (req, res) => {
  res.send(req.user);
});

//logout
router.post("/logout", (req, res) => {
  res
    .clearCookie("access_token", { httpOnly: true })
    .send({ message: "Logged out successfully" });
  res.send({ message: "Logged out successfully" });
});

export default router;
