const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      message: "Email and Password are required",
    });
  const foundUser = await User.findOne({ email: email }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  // Evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles).filter(Boolean);

    //Create JWTs to send and to use with the routes that we want protected on our api
    const accessToken = jwt.sign(
      {
        UserInfo: {
          email: foundUser.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
    //Saving refreshToken with current user
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    }); // secure: true,
    res.json({ roles, accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
