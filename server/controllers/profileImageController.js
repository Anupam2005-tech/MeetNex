const userModel = require("../modals/userSchema");
const cloudinary=require('cloudinary').v2

async function uploadprofieImage(req, res) {
  try {
    const userId = req.user._id;
    const userQuery = await userModel.findById(userId);
    if (!userQuery) {
      return res.status(404).json({ msg: `user not found` });
    }
    if (!req.file || !req.file.path) {
      return null;
    }
    userQuery.profileImage = {
      url: req.file.path,
      public_id: req.file.filename || null,
    };
    await userQuery.save();
    return res
      .status(200)
      .json({
        msg: `profile updated successfully`,
        profileImage: userQuery.profileImage,
      });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: `network error or internal server error` });
  }
}
async function getprofileImage(req, res) {
  try {
    const userId = req.user._id;
    const userQuery = await userModel.findById(userId);
    if (!userQuery) {
      return res.status(404).json({ msg: `User not found` });
    }
    if (!userQuery.profileImage || !userQuery.profileImage.url) {
      return res.status(404).json({ msg: `Profile image not found` });
    }
    return res.status(200).json({ profileImage: userQuery.profileImage });
  } catch (err) {
    return res.status(500).json({ msg: `Network error or internal server error` });
  }
}


async function deleteprofileImage(req, res) {
  try {
    const userId = req.user._id;
    const userQuery = await userModel.findById(userId);
    if (!userQuery) {
      return res.status(404).json({ msg: `user not found` });
    }
    if (!userQuery.profileImage || !userQuery.profileImage.public_id) {
        return null
      }
    await cloudinary.uploader.destroy(userQuery.profileImage.public_id)
    userQuery.profileImage = { url: null, public_id: null };
    await userQuery.save();
    return res.status(200).json({ msg: 'Profile image deleted successfully' });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: `network error or internal server error` });
  }
}

async function updateprofileImage(req, res) {
 try{
    const userId = req.user._id;
    const userQuery = await userModel.findById(userId);
    if (!userQuery) {
      return res.status(404).json({ msg: `user not found` });
    }
    if (!req.file || !req.file.path) {
        return res.status(400).json({ msg: 'No profile image provided' });
      }
      if (user.profileImage && user.profileImage.public_id) {
        await cloudinary.uploader.destroy(user.profileImage.public_id);
      }
      user.profileImage = {
        url: req.file.path,
        public_id: req.file.filename || null,
      };
  
      await user.save();  
      return res.status(200).json({msg:`profile photo updated `,   profileImage: user.profileImage})
 }
 catch(err){
    return res
      .status(500)
      .json({ msg: `network error or internal server error` });
  
 }
}

module.exports = {
  uploadprofieImage,
  getprofileImage,
  deleteprofileImage,
  updateprofileImage,
};
