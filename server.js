const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./src/config/database');
const models = require('./src/models');
const authRoutes = require('./src/routes/authRoutes');
const internshipRoutes = require('./src/routes/internshipRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/admin', adminRoutes);

// Rota principal para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'internships.html'));
});

// Inicializa o banco de dados e inicia o servidor
async function initializeDatabase() {
    try {
        // Tenta autenticar com o banco de dados
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        // Sincroniza os modelos com o banco de dados (sem force)
        await sequelize.sync();
        console.log('Modelos sincronizados com o banco de dados.');

        // Inicia o servidor
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        process.exit(1);
    }
}

// Inicia a aplicação
initializeDatabase(); 