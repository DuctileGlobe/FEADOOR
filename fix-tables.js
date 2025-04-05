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

    // Primeiro, verifica se a tabela Internships_temp existe
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Internships_temp'", (err, row) => {
        if (err) {
            console.error('Erro ao verificar tabela:', err);
            closeDb();
            return;
        }

        // Se a tabela existe, deleta ela
        if (row) {
            db.run('DROP TABLE IF EXISTS Internships_temp', (err) => {
                if (err) {
                    console.error('Erro ao deletar tabela Internships_temp:', err);
                } else {
                    console.log('Tabela Internships_temp deletada com sucesso');
                }
                addWorkloadColumn();
            });
        } else {
            console.log('Tabela Internships_temp não existe');
            addWorkloadColumn();
        }
    });
});

function addWorkloadColumn() {
    // Verifica se a coluna workload já existe
    db.all("PRAGMA table_info(Internships)", (err, rows) => {
        if (err) {
            console.error('Erro ao verificar colunas:', err);
            closeDb();
            return;
        }

        const hasWorkload = rows.some(row => row.name === 'workload');
        
        if (!hasWorkload) {
            db.run('ALTER TABLE Internships ADD COLUMN workload INTEGER', (err) => {
                if (err) {
                    console.error('Erro ao adicionar coluna workload:', err);
                } else {
                    console.log('Coluna workload adicionada com sucesso à tabela Internships');
                }
                closeDb();
            });
        } else {
            console.log('Coluna workload já existe na tabela Internships');
            closeDb();
        }
    });
}

function closeDb() {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar a conexão com o banco de dados:', err);
        } else {
            console.log('Conexão com o banco de dados fechada');
        }
    });
} 