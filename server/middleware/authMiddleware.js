import jwt from "jsonwebtoken";

export const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.access_token; //retrieve the token from cookies
    if (!token) return res.status(401).send("access denied"); //if there is no token in cookies
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY); //checks if the token is valid and ok
    // and return an object with the user's data
    req.user = decoded; //saving the user's data for next action
    next();
  } catch (error) {
    res.status(401).send("Invalid or expired token.");
  }
};

export const verifyAdmin = (req, res, next) => {
  const currentUser = req.user;
  if (!currentUser || currentUser.role !== "admin") {
    return res.status(403).send("Not allowed, admin only");
  }
  next();
};
