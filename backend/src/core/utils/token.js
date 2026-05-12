import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.id,
            role: user.role,
        },
        process.env.ACCESS_SECRET,
        {
            expiresIn: "15m",
        }
    );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export default {
    generateAccessToken,
    generateRefreshToken
}