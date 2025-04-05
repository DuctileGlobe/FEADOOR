const { User } = require('./src/models');
const sequelize = require('./src/config/database');

async function promoteToAdmin() {
    try {
        // Conectar ao banco de dados
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        // Buscar o usuário pelo email
        const user = await User.findOne({
            where: { email: 'ianeliascl@usp.br' }
        });

        if (!user) {
            console.error('Usuário não encontrado');
            process.exit(1);
        }

        // Promover a administrador
        await user.update({ role: 'admin' });
        console.log(`Usuário ${user.email} promovido a administrador com sucesso!`);

        // Fechar a conexão
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Erro ao promover usuário:', error);
        process.exit(1);
    }
}

// Executar a função
promoteToAdmin(); 