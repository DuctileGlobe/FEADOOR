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

    // Criar uma tabela temporária com a nova estrutura
    db.serialize(() => {
        // Criar tabela temporária
        db.run(`
            CREATE TABLE Internships_temp (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                position VARCHAR(255) NOT NULL,
                company_name VARCHAR(255) NOT NULL,
                company_domain VARCHAR(255),
                salary FLOAT NOT NULL,
                workload FLOAT,
                benefits TEXT,
                work_environment TEXT,
                reconciliation_difficulty VARCHAR(255) NOT NULL,
                process_difficulty VARCHAR(255) NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                UserId INTEGER,
                FOREIGN KEY (UserId) REFERENCES Users(id)
            )
        `, (err) => {
            if (err) {
                console.error('Erro ao criar tabela temporária:', err);
                closeDb();
                return;
            }
            console.log('Tabela temporária criada com sucesso');

            // Copiar dados da tabela original para a temporária
            db.run(`
                INSERT INTO Internships_temp (
                    id, position, company_name, company_domain, salary, 
                    workload, benefits, work_environment, 
                    reconciliation_difficulty, process_difficulty, 
                    createdAt, updatedAt, UserId
                )
                SELECT 
                    id, position, company_name, company_domain, salary, 
                    CAST(workload AS FLOAT), benefits, work_environment, 
                    reconciliation_difficulty, process_difficulty, 
                    createdAt, updatedAt, UserId
                FROM Internships
            `, (err) => {
                if (err) {
                    console.error('Erro ao copiar dados:', err);
                    closeDb();
                    return;
                }
                console.log('Dados copiados com sucesso');

                // Remover tabela original
                db.run('DROP TABLE Internships', (err) => {
                    if (err) {
                        console.error('Erro ao remover tabela original:', err);
                        closeDb();
                        return;
                    }
                    console.log('Tabela original removida');

                    // Renomear tabela temporária
                    db.run('ALTER TABLE Internships_temp RENAME TO Internships', (err) => {
                        if (err) {
                            console.error('Erro ao renomear tabela temporária:', err);
                        } else {
                            console.log('Tabela temporária renomeada com sucesso');
                        }
                        closeDb();
                    });
                });
            });
        });
    });
});

function closeDb() {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar a conexão com o banco de dados:', err);
        } else {
            console.log('Conexão com o banco de dados fechada');
        }
    });
} 