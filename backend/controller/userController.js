import User from "../model/userModel.js";
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { name, email, password } = req.body;
        
        if (!name || !password) {
            return res.status(400).json({ message: 'Name and password are required' });
        }

        // If email isn't provided, create a dev-local email so the schema constraint is satisfied
        const userEmail = email || `${name.replace(/\s+/g, '').toLowerCase()}@local.test`;

        // Check if user already exists (by email or name)
        const existingUser = await User.findOne({ $or: [{ email: userEmail }, { name }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email or name' });
        }
        
        const newUser = new User({ name, email: userEmail, password });
        await newUser.save();
        
        console.log("User created successfully:", newUser._id);
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        console.log("Login request received:", req.body);
        const { email, name, password } = req.body;

        if ((!email && !name) || !password) {
            return res.status(400).json({ message: 'Email or name and password are required' });
        }

        // Find user by email or name
        const user = await User.findOne(email ? { email } : { name });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        console.log("User logged in successfully:", user._id);

        // Sign JWT
        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }   
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, password },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};