const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const errorHandler = require("../middleware/errorHandler");

const handleLogin = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password || username === "" || email === "" || password === "") {
    return next(errorHandler(400, "Username and password are required."));
  }

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return next(errorHandler(401, "Unauthorized, no user found")); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          email: foundUser.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign({ username: foundUser.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" });
    // Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "None", maxAge: 24 * 60 * 60 * 1000 });

    // Send authorization roles and access token to user
    res.json({ roles, accessToken });
  } else {
    return next(errorHandler(401, "Unauthorized, no match found"));
  }
};

module.exports = { handleLogin };
