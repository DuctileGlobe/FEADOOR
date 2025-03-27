const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Gerar token JWT
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// Registro de usuário
const register = async (req, res) => {
    try {
        const { name, email, password, course, graduationYear } = req.body;

        // Verificar se o email já está em uso
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Este email já está em uso.' });
        }

        // Verificar se é um email USP
        if (!email.endsWith('@usp.br')) {
            return res.status(400).json({ error: 'Por favor, use seu email USP.' });
        }

        // Criar novo usuário
        const user = await User.create({
            name,
            email,
            password,
            course,
            graduationYear
        });

        // Gerar token
        const token = generateToken(user.id);

        // Retornar usuário e token (sem a senha)
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.status(201).json({
            user: userResponse,
            token
        });
    } catch (error) {
        // Log do erro para debug
        console.error('Erro no registro:', error);

        // Verificar se é um erro de validação do Sequelize
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(err => err.message);
            return res.status(400).json({ error: messages.join(', ') });
        }

        res.status(400).json({ error: 'Erro ao criar conta. Por favor, tente novamente.' });
    }
};

// Login de usuário
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Encontrar usuário pelo email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // Verificar senha
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // Gerar token
        const token = generateToken(user.id);

        // Retornar usuário e token (sem a senha)
        const userResponse = user.toJSON();
        delete userResponse.password;

        res.json({
            user: userResponse,
            token
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obter perfil do usuário
const getProfile = async (req, res) => {
    try {
        const userResponse = req.user.toJSON();
        delete userResponse.password;
        res.json(userResponse);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    getProfile
}; 