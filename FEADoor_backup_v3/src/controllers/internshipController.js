const { Internship, User } = require('../models');
const { Op } = require('sequelize');

exports.listInternships = async (req, res) => {
    try {
        const internships = await Internship.findAll({
            attributes: [
                'id',
                'position',
                'company_name',
                'company_domain',
                'salary',
                'benefits',
                'work_environment',
                'reconciliation_difficulty',
                'process_difficulty',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(internships);
    } catch (error) {
        console.error('Erro ao listar estágios:', error);
        res.status(500).json({ error: 'Erro ao listar estágios' });
    }
};

exports.getInternship = async (req, res) => {
    try {
        const internship = await Internship.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name']
            }]
        });
        
        if (!internship) {
            return res.status(404).json({ error: 'Estágio não encontrado' });
        }
        
        res.json(internship);
    } catch (error) {
        console.error('Erro ao buscar estágio:', error);
        res.status(500).json({ error: 'Erro ao buscar estágio' });
    }
};

exports.createInternship = async (req, res) => {
    try {
        const {
            companyName,
            position,
            area,
            location,
            salary,
            workload,
            benefits,
            rating,
            conciliationRating,
            conciliationComments,
            processDifficulty,
            processComments,
            pros,
            cons,
            learningExperience,
            hasRemote
        } = req.body;

        const internship = await Internship.create({
            company_name: companyName,
            position,
            company_domain: `${area} - ${location}${hasRemote ? ' (Remoto)' : ''}`,
            salary,
            benefits,
            work_environment: `${pros}\n\nPontos Negativos:\n${cons}\n\nAprendizado:\n${learningExperience}\n\nProcesso Seletivo:\n${processComments}`,
            reconciliation_difficulty: conciliationRating,
            process_difficulty: processDifficulty,
            UserId: req.user.id
        });

        res.status(201).json(internship);
    } catch (error) {
        console.error('Erro ao criar estágio:', error);
        
        if (error.name === 'SequelizeValidationError') {
            const errorMessages = error.errors.map(err => {
                const fieldMap = {
                    'company_name': 'nome da empresa',
                    'reconciliation_difficulty': 'dificuldade de conciliação',
                    'process_difficulty': 'dificuldade do processo'
                };
                const fieldName = fieldMap[err.path] || err.path;
                return `${fieldName}: ${err.message}`;
            });
            return res.status(400).json({
                error: 'Erro de validação',
                errors: errorMessages
            });
        }
        
        if (error.name === 'SequelizeDatabaseError') {
            return res.status(500).json({
                error: 'Erro no banco de dados',
                message: 'Houve um erro ao salvar os dados. Por favor, tente novamente.'
            });
        }
        
        res.status(500).json({ error: 'Erro ao criar estágio' });
    }
};

exports.updateInternship = async (req, res) => {
    try {
        const internship = await Internship.findOne({
            where: {
                id: req.params.id,
                UserId: req.user.id
            }
        });

        if (!internship) {
            return res.status(404).json({ error: 'Estágio não encontrado' });
        }

        await internship.update(req.body);
        res.json(internship);
    } catch (error) {
        console.error('Erro ao atualizar estágio:', error);
        
        // Se for erro de validação do Sequelize
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                error: 'Erro de validação',
                errors: error.errors.map(err => ({
                    field: err.path,
                    message: err.message
                }))
            });
        }
        
        res.status(500).json({ error: 'Erro ao atualizar estágio' });
    }
};

exports.deleteInternship = async (req, res) => {
    try {
        const internship = await Internship.findOne({
            where: {
                id: req.params.id,
                UserId: req.user.id
            }
        });

        if (!internship) {
            return res.status(404).json({ error: 'Estágio não encontrado' });
        }

        await internship.destroy();
        res.json({ message: 'Estágio excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar estágio:', error);
        res.status(500).json({ error: 'Erro ao deletar estágio' });
    }
};

exports.searchByCompany = async (req, res) => {
    const { query } = req.query;
    
    try {
        const internships = await Internship.findAll({
            where: {
                [Op.or]: [
                    {
                        company_name: {
                            [Op.like]: `%${query}%`
                        }
                    },
                    {
                        position: {
                            [Op.like]: `%${query}%`
                        }
                    },
                    {
                        company_domain: {
                            [Op.like]: `%${query}%`
                        }
                    }
                ]
            },
            attributes: [
                'id',
                'position',
                'company_name',
                'company_domain',
                'salary',
                'benefits',
                'work_environment',
                'reconciliation_difficulty',
                'process_difficulty',
                'createdAt'
            ],
            order: [['createdAt', 'DESC']]
        });
        
        res.json(internships);
    } catch (error) {
        console.error('Erro ao buscar estágios:', error);
        res.status(500).json({ error: 'Erro ao buscar estágios' });
    }
};

exports.listUserInternships = async (req, res) => {
    try {
        const internships = await Internship.findAll({
            where: {
                UserId: req.user.id
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(internships);
    } catch (error) {
        console.error('Erro ao listar estágios do usuário:', error);
        res.status(500).json({ error: 'Erro ao listar estágios do usuário' });
    }
}; 