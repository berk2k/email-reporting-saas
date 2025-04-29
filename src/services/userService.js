
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

import prisma from '../models/prisma.js'; 

export const registerUserService = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword, 
            },
        });
        return user; 
    } catch (error) {
        throw new Error('Error creating user: ' + error.message);
    }
};


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
    return token; 
};
