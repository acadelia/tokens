import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  const authorizationHeader = req.header("Authorization");

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: true, message: "Unauthorized: No valid token provided" });
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const tokenDetails = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_PRIVATE_KEY
    );
    req.user = tokenDetails;
    next();
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json({ error: true, message: "Unauthorized: Invalid token" });
  }
};

export default auth;
