import axios from "axios";
import { getRandomName } from "../../lib/commonUtil.js";
import { getUserByNaverId, saveUser } from "../../lib/userUtil.js";
import { generateToken } from "../../lib/authUtil.js";

const doPost = async (req, res) => {
    const { code, state } = req.body;

    const tokenReponse = await axios.get('https://nid.naver.com/oauth2.0/token', {
        params: {
            grant_type: 'authorization_code',
            client_id: process.env.VITE_OAUTH_NAVER_CLIENT_ID,
            client_secret: process.env.VITE_OAUTH_NAVER_CLIENT_SECRET,
            code: code,
            state: state
        }
    });

    const profileResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
        headers: {
            Authorization: `Bearer ${tokenReponse.data.access_token}`
        }
    });

    const naverProfile = profileResponse.data.response;

    let name = naverProfile.nickname;
    if (!name) {
        name = await getRandomName();
    }

    let user = await getUserByNaverId(naverProfile.id);
    if (!user) {
        const userData = {
            naverId: naverProfile.id,
            name,
            profile: naverProfile.profile_image
        };

        user = await saveUser(userData);
    }  

    const token = generateToken(user);
    res.status(200).json({ token });
};

export default async function handler(req, res) {
    try {
         if (req.method === 'POST') {
            doPost(req, res);
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Failed to fetch data', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}