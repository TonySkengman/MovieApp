import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function createToken(user) {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        message: 'Username and password are required.',
      });
    }

    const normalizedUsername = username.trim();

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(normalizedUsername)) {
      return res.status(400).json({
        message:
          'Username must be 3–20 characters and contain only letters, numbers, or underscores.',
      });
    }

    if (password.length < 5 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({
        message: 'Password must be at least 5 characters long.',
      });
    }

    const existingUser = await User.findOne({
      username: normalizedUsername,
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'Username is already taken.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: normalizedUsername,
      password: hashedPassword,
    });

    const token = createToken(user);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Username is already taken.',
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Something went wrong.',
    });
  }
}

export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: 'Username and password are required.',
      });
    }

    const user = await User.findOne({
      username: username.trim(),
    }).select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        message: 'Invalid username or password.',
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Something went wrong.',
    });
  }
}