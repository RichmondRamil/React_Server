const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, firstname, lastname, age, email, position, password } =
    req.body;

  if (
    !username ||
    !firstname ||
    !lastname ||
    !age ||
    !position ||
    !email ||
    !password
  )
    return res.status(400).json({
      message:
        "Username, Firstname, Lastname, Age, Email and Password are required",
    });

  //Check for dulicate usernames and email in the db
  const duplicateUsername = await User.findOne({ username: username }).exec();
  const duplicateEmail = await User.findOne({ email: email }).exec();
  if (duplicateUsername && duplicateEmail) return res.sendStatus(409); //Conflict

  try {
    //Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Create and Store the new user
    const result = await User.create({
      username: username,
      firstname: firstname,
      lastname: lastname,
      age: age,
      position: position,
      email: email,
      password: hashedPassword,
    });

    console.log(result);

    res.status(201).json({ success: `New user ${username} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
