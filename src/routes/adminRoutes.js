const express = require('express');
const router = express.Router();
const { User, Internship } = require('../models');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

// Middleware para proteger todas as rotas admin
router.use(authenticateToken, isAdmin);

// Listar todos os usuários
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role', 'isBanned', 'createdAt'],
            order: [['createdAt', 'DESC']]
        });
        res.json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).json({ error: 'Erro ao listar usuários' });
    }
});

// Banir/Desbanir usuário
router.put('/users/:id/ban', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // Não permite banir outros admins
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Não é possível banir um administrador' });
        }

        await user.update({ isBanned: !user.isBanned });
        res.json({ message: `Usuário ${user.isBanned ? 'banido' : 'desbanido'} com sucesso` });
    } catch (error) {
        console.error('Erro ao banir/desbanir usuário:', error);
        res.status(500).json({ error: 'Erro ao banir/desbanir usuário' });
    }
});

// Promover usuário a administrador
router.put('/users/:id/promote', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        await user.update({ role: 'admin' });
        res.json({ message: 'Usuário promovido a administrador com sucesso' });
    } catch (error) {
        console.error('Erro ao promover usuário:', error);
        res.status(500).json({ error: 'Erro ao promover usuário' });
    }
});

// Deletar estágio
router.delete('/internships/:id', async (req, res) => {
    try {
        const internship = await Internship.findByPk(req.params.id);
        if (!internship) {
            return res.status(404).json({ error: 'Estágio não encontrado' });
        }

        await internship.destroy();
        res.json({ message: 'Estágio deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar estágio:', error);
        res.status(500).json({ error: 'Erro ao deletar estágio' });
    }
});

// Listar todos os estágios
router.get('/internships', async (req, res) => {
    try {
        const internships = await Internship.findAll({
            include: [{
                model: User,
                attributes: ['name', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });
        res.json(internships);
    } catch (error) {
        console.error('Erro ao listar estágios:', error);
        res.status(500).json({ error: 'Erro ao listar estágios' });
    }
});

module.exports = router; 