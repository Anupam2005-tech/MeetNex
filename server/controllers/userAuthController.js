const { setUser } = require("../services/cookies");
const userModel = require("../modals/userSchema");
const { hashPassword, checkHashPassword } = require("../services/hashPassword");
const dotenv = require("dotenv");

dotenv.config();

// create user
 async function userRegister(req, res) {
  try {
    const { name, email, password } = req.body;
    const userQuery = await userModel.findOne({ email });
    if (userQuery) {
      return res.status(409).json({ msg: `user already exist` });
    }
    const hashedPassword = await hashPassword(password);

    await userModel.create({ name, email, password: hashedPassword});
    return res.status(201).json("user created successfully");
  } catch (err) {
    console.error("error while registration");
    return res
      .status(500)
      .json({ msg: `Network error or internal server error` });
  }
}

// user login

async function userLogin(req, res) {
  try {
    const { email, password } = req.body;
    const userQuery = await userModel.findOne({ email });
    if (!userQuery) {
      return res.status(401).json({ msg: `invalid credentials` });
    }
    const passwordMatch = await checkHashPassword(password, userQuery.password);
    if (!passwordMatch) {
      return res.status(401).json({ msg: `invalid credentials` });
    }
    const setUserToken = setUser(userQuery);
    res.cookie("token", setUserToken);
    const { _id, name, email: userEmail } = userQuery;
    return res.status(200).json({
        msg: `login successfully`,
        user: {
          _id,
          name,
          email: userEmail,
        },
      });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: `Network error or internal server error` });
  }
}

// user update

async function userUpdate(req, res) {
  try {
   const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ msg: "Invalid user" });
    }
    const { email, password, name } = req.body;

    const fieldsToUpdate = {};
    if (email) fieldsToUpdate.email = email;
    if (name) fieldsToUpdate.name = name;
    if (password) fieldsToUpdate.password = await hashPassword(password);


    if (Object.keys(fieldsToUpdate).length === 0) {
      return res.status(400).json({ msg: "No fields provided to update" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
        userId,
      fieldsToUpdate,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "account not found" });
    }

    return res.status(200).json({ msg: "account updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    return res
      .status(500)
      .json({ msg: "Network error or internal server error" });
  }
}

//   delete user
async function userDelete(req, res) {
  try {
   const userId = req.user._id;

    const deleteUser = await userModel.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ msg: "User not found or already deleted" });
    }
    res.clearCookie("token");
    return res.status(200).json({ msg: "Account deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Network error or internal server error" });
  }
}

// user logout

async function userLogout(req, res) {
  try {
   const userId = req.user._id;

    res.clearCookie("token");
    return res.status(200).json({ msg: `logout successfully` });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Network error or internal server error" });
  }
}

// user auth check

async function usercheckAuth(req, res) {
  try {
   const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ msg: `user unauthenticated` });
    }
    return res.status(200).json({ msg: `user authenticated` });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: "Network error or internal server error" });
  }
}

module.exports = {
  userLogin,
  userRegister,
  userUpdate,
  userDelete,
  userLogout,
  usercheckAuth,
};
