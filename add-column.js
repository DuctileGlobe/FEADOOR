const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados
const dbPath = path.join(__dirname, 'database.sqlite');

// Conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        process.exit(1);
    }
    console.log('Conectado ao banco de dados SQLite');
});

// Adicionar a coluna workload à tabela Internships
db.serialize(() => {
    // Verificar se a coluna já existe
    db.get("PRAGMA table_info(Internships)", (err, rows) => {
        if (err) {
            console.error('Erro ao verificar a estrutura da tabela:', err);
            return;
        }

        // Adicionar a coluna workload
        db.run('ALTER TABLE Internships ADD COLUMN workload TEXT', (err) => {
            if (err) {
                if (err.message.includes('duplicate column name')) {
                    console.log('A coluna workload já existe na tabela Internships');
                } else {
                    console.error('Erro ao adicionar a coluna workload:', err);
                }
            } else {
                console.log('Coluna workload adicionada com sucesso!');
            }

            // Fechar a conexão com o banco de dados
            db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar a conexão com o banco de dados:', err);
                } else {
                    console.log('Conexão com o banco de dados fechada');
                }
            });
        });
    });
}); 