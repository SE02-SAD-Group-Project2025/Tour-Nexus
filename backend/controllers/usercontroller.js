import bcrypt from 'bcrypt';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || "secretkey";

export function createUser(req, res) {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const user = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        phone: req.body.phone,
        role: req.body.role,
        password: hashedPassword,
    });

    user.save()
        .then(() => {
            res.status(201).json({
                message: "User created successfully",
            });
        })
        .catch((err) => {
            res.status(500).json({
                message: "Error creating user",
                error: err.message
            });
        });
}

export function loginUser(req, res) {
    if (User.db.readyState !== 1) {
        return res.status(503).json({
            message: "Database not connected. Please try again in a moment."
        });
    }

    const { email, password } = req.body;

    User.findOne({ email: email })
        .then((user) => {

            if (user == null) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user.isblocked) {
                return res.status(403).json({
                    message: "User is blocked"
                });
            }
            else {

                const isPasswordCorrect = bcrypt.compareSync(password, user.password);
                if (isPasswordCorrect) {
                    const token = jwt.sign({
                        fullname: user.fullname,
                        email: user.email,
                        phone: user.phone,
                        role: user.role
                    },
                        jwtSecret
                    );
                    res.status(200).json({
                        message: "Login successful",
                        token: token,
                        role: user.role
                    });
                } else {
                    res.status(401).json({
                        message: "Invalid password"

                    });
                }

            }

        })
        .catch((err) => {
            console.error("Login error:", err);
            res.status(500).json({
                message: "An error occurred during login",
                error: err.message
            });
        });

}

export async function updateUser(req, res) {
    try {
        const email = req.params?.email;
        const { fullname, phone, role, password, isblocked } = req.body;

        if (
            fullname === undefined &&
            phone === undefined &&
            role === undefined &&
            password === undefined &&
            isblocked === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "No fields to update"
            });
        }

        const updates = {};

        if (fullname !== undefined) updates.fullname = fullname;
        if (phone !== undefined) updates.phone = phone;
        if (role !== undefined) updates.role = role;
        if (password !== undefined) updates.password = bcrypt.hashSync(password, 10);
        if (isblocked !== undefined) updates.isblocked = isblocked;

        const result = await User.updateOne(
            { email: email },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully"
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message
        });
    }
}

export async function deleteUser(req, res) {
    try {
        await User.deleteOne({ email: req.params.email });
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting user",
        });
    }
}

export function isAdmin(req, res) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role == "Admin") {
        return true;
    }
}

export function isTourist(req, res) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role == "Tourist") {
        return true;
    }
}

export function isHotel_owner(req, res) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role == "HotelOwner") {
        return true;
    }
}

export function isGuide(req, res) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role == "Guide") {
        return true;
    }
}

export function isVehicleCompany(req, res) {
    if (req.user == null) {
        return false;
    }
    if (req.user.role == "Vehicle") {
        return true;
    }
}

export function isBlocked(req, res) {
    if (req.user == null) {
        return false;
    }
    if (req.user.isblocked === true) {
        return true;
    }
}

export async function view_all_users(req, res) {

    try {
        const viewUsers = await User.find().select('-password');
        res.status(200).json(viewUsers);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get Users",
            error: err.message,
        });
    }
}

export async function viewDetails(req, res) {

    const email = req.params.email;

    try {
        const user = await User.findOne({ email: email }).select('-password');
        res.json(user);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message
        });
    }
}
