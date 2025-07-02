import { Router } from "express";
import users from "../../models/User.js";
import { verifyUser } from "../../middleware/authMiddleware.js";

const router = Router();

//get all users
router.get("/", async (req, res) => {
  try {
    const allUsers = await users.find();
    const returnUsers = allUsers.map((user) => ({
      name: user.name,
      email: user.email,
      _id: user._id,
      role: user.role,
    }));
    res.status(200).send(returnUsers);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//get user by id
router.get("/:id", async (req, res) => {
  try {
    const userById = await users.findById(req.params.id);
    if (!userById) {
      return res.status(404).send("user not found");
    }
    const returnUser = {
      name: userById.name,
      email: userById.email,
      _id: userById._id,
      role: userById.role,
    };
    res.status(200).send(returnUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//edit user
router.put("/:id", verifyUser, async (req, res) => {
  const currentUser = req.user;
  if (currentUser._id !== req.params.id && currentUser.role !== "admin")
    return res.status(403).send("not allowed");
  try {
    const { name, email } = req.body;
    const userById = await users.findById(req.params.id);
    if (!userById) {
      return res.status(404).send("user not found");
    }
    if (!email || !name)
      return res.status(400).send("name or email are require");
    if (name.length < 3) return res.send("name should have at least 3 char");
    if (!email.includes("@")) return res.send("invalid email");
    const updateUser = await users.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );
    const returnUser = {
      name: updateUser.name,
      email: updateUser.email,
      _id: updateUser._id,
      role: updateUser.role,
    };
    res.status(200).send({ message: "update successfully", returnUser });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//delete user
router.delete("/:id", verifyUser, async (req, res) => {
  const currentUser = req.user;
  if (currentUser._id !== req.params.id && currentUser.role !== "admin")
    return res.status(403).send("not allowed");
  try {
    const deletedUser = await users.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).send("user not found");
    }
    res.send({ message: "User deleted", _id: deletedUser._id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
