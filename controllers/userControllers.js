import User from "../models/user.js";

export const registerUser = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("User have already registered");
    }

    // Create a new user
    user = await User.create({
      name,
      email,
      password,
    });

    return res.status(201).json({
      _id: user._id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      verified: user.verified,
      admin: user.admin,
      // Call generateJWT on the user instance to get the token
      token: await user.generateJWT(),
    });
  } catch (error) {
    next(error);
  }
};
