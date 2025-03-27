const sequelize = require('./database');
const models = require('../models');

async function migrate() {
    try {
        // Força a recriação das tabelas uma única vez
        await sequelize.sync({ force: true });
        console.log('Banco de dados migrado com sucesso!');
        process.exit(0);
    } catch (error) {
        console.error('Erro ao migrar banco de dados:', error);
        process.exit(1);
    }
}

migrate(); 