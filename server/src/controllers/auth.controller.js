import { ENV } from "../config/ENV.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js"

export const Register = async (req, res) => {
  try {

    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Email and name are required" });
    }

    // Check if user already exists
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      // User exists - log them in instead
      const token = generateToken(isEmailExist._id);

      res.cookie("token", token, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: "user logged in successfully",
        user: {
          _id: isEmailExist._id,
          name: isEmailExist.name,
          email: isEmailExist.email,
          credits: isEmailExist.credits,
          isCreditsAvailable: isEmailExist.isCreditsAvailable
        }
      });
    }

    const user = await User.create({ email, name });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "user registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits,
        isCreditsAvailable: user.isCreditsAvailable
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const Logout = (_, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "user logged out successfully" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const Profile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-__v")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    return res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        credits: user.credits
      }
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
