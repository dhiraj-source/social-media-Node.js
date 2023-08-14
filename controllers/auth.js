import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import User from "../models/User.js";

// REGISTER USER

export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,

        } = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res.status(401).json({ message: "please enter all fields" })
        }

        //already register
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(401).json({ message: "User already exists" })
        }

        //encrypt
        const salt = await bcrypt.genSalt()
        const passwordhash = await bcrypt.hash(password, salt)

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordhash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000)
        })

        await newUser.save()
        res.status(201).json(newUser)

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        if (!email || !password) {
            return res.status(401).json({ message: "please enter all fields" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "user doesnot exists, please register first" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: "incorrect pasword" })
        }

        //token
        const token = JWT.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" })
        delete user.password;

        res.status(201).json({ message: "user login success", user, token })
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}