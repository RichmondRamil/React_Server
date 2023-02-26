const User = require("../model/User");

const handleLogout = async (req, res) => {
  //OnClient, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content to sent back
  const refreshToken = cookies.jwt;

  //is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  // const foundUser = usersDB.users.find((person) => person.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //maxAge: 24 * 60 * 60 * 1000
    return res.sendStatus(204); //Successfull but no content
  }

  //Delete refreshToken in DB
  foundUser.refreshToken = "";
  const result = await foundUser.save();
  console.log(result);

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  }); //  maxAge: 24 * 60 * 60 * 1000,
  res.sendStatus(204);
};

module.exports = { handleLogout };
