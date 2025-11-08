import User from "../model/userModel.js";

export const createUser = async (req, res) => {
    try {
        console.log("Signup request received:", req.body);
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        
        // Set role to admin if email is admin@gmail.com
        const role = email === 'admin@gmail.com' ? 'admin' : 'user';
        
        const newUser = new User({ name, email, password, role });
        await newUser.save();
        
        console.log("User created successfully:", newUser._id, "Role:", role);
        
        res.status(201).json({ 
            message: 'User created successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
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
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        
        console.log("User logged in successfully:", user._id);
        
        res.status(200).json({ 
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { email } = req.query;
        
        // If email query param provided, search by email
        if (email) {
            const user = await User.findOne({ email }).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        }
        
        // Otherwise return all users (without passwords)
        const users = await User.find().select('-password');
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