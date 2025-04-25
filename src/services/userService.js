// src/services/userService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';


import prisma from '../models/userModel.js'; // Now this is the full Prisma client




// Register user and hash password
export const registerUserService = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword, // Save hashed password
            },
        });
        return user; // Return the created user object
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};

// Login user and generate JWT
export const loginUserService = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    // Generate JWT token using secret from environment variable
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
    return token;  // Return the JWT token
};
