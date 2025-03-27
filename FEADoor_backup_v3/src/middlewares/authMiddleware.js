const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Verifica se o usuário ainda existe
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(403).json({ error: 'Token inválido' });
    }
}

module.exports = {
    authenticateToken
}; 