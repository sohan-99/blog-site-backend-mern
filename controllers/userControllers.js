import User from "../models/user.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User has already registered" });
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
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
