import { registerUserService, loginUserService } from '../services/userService.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication and registration
 */

export const registerUser = async (req, res) => {
    const {email,password} = req.body;

    try {
        const user = await registerUserService(email, password);
        res.status(201).json({ message: 'User registered successfully', user });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const token = await loginUserService(email, password);
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };