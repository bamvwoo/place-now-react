export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}