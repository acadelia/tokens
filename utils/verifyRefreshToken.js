import UserToken from "../models/UserToken.js";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (refreshToken) => {
  try {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    const doc = await UserToken.findOne({ token: refreshToken });

    if (!doc) throw { error: true, message: "Invalid refresh token" };

    const tokenDetails = jwt.verify(refreshToken, privateKey);

    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (err) {
    return { error: true, message: "Invalid refresh token" };
  }
};

export default verifyRefreshToken;
