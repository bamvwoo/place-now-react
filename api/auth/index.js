import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from "../../lib/authUtil.js";
import { getUserByEmail, getUserById } from '../../lib/userUtil.js';

const doGet = async (req, res) => {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    let user = jwt.verify(token, process.env.JWT_SECRET);
    user = await getUserById(user._id);

    token = generateToken(user);

    res.status(200).json({ token });
};

const doPost = async (req, res) => {
    const { email, password } = req.body;

    // 사용자 유무 검증
    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.status(200).json({ token });
};

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            doGet(req, res);
        } else if (req.method === 'POST') {
            doPost(req, res);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Failed to fetch data', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}