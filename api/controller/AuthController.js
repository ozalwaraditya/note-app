    import jwt from 'jsonwebtoken';
    import bcrypt from 'bcryptjs';
    import { errorHandler } from '../utils/errorHandler.js';
    import User from '../models/UserModel.js';

    export const signup = async (req, res, next) => {
        const { username, password, email } = req.body;

        if (!username || !email || !password) {
            return next(errorHandler(400, "All fields (username, email, password) are required."));
        }

        try {
            const user = await User.findOne({ email });

            if (user) {
                return next(errorHandler(409, "User already exists with this email."));
            }

            const hashedPassword = bcrypt.hashSync(password, 10);

            const newUser = await User.create({ username, email, password: hashedPassword });

            const { password: pwd, ...rest } = newUser.toObject();

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: rest
            });
        } catch (error) {
            if (error.code === 11000) {
                const duplicatedField = Object.keys(error.keyValue)[0]; 
                return next(errorHandler(409, `${duplicatedField} already exists.`));
            }
            next(error);
        }
    }


    export const signin = async (req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                next(errorHandler(401,"Invalid email!"));
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                next(errorHandler(401,"Wrong password"));
            }

            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000,
            });

            res.json({
                success : true,
                message: 'Login successful',
                token : token,
                user: {
                    id: user._id,
                    username : user.username,
                    email: user.email,
                },
            });

        } catch (error) {
            next(error);
        }
    }