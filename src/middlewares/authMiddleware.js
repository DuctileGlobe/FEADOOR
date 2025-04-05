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

        // Verifica se o usuário está banido
        if (user.isBanned) {
            return res.status(403).json({ error: 'Sua conta foi banida' });
        }

        // Atribui o usuário completo ao request
        req.user = user;
        next();
    } catch (error) {
        console.error('Erro na autenticação:', error);
        return res.status(403).json({ error: 'Token inválido' });
    }
}

async function isAdmin(req, res, next) {
    try {
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
        }
        next();
    } catch (error) {
        console.error('Erro ao verificar permissões de admin:', error);
        return res.status(500).json({ error: 'Erro ao verificar permissões' });
    }
}

module.exports = {
    authenticateToken,
    isAdmin
}; 