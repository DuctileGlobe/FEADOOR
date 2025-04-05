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

    // Criar uma tabela temporária com a estrutura correta
    db.serialize(() => {
        // Criar tabela temporária
        db.run(`
            CREATE TABLE Internships_temp (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                position TEXT NOT NULL,
                company_name TEXT NOT NULL,
                company_domain TEXT,
                salary REAL NOT NULL,
                workload REAL NOT NULL,
                benefits TEXT,
                work_environment TEXT,
                reconciliation_difficulty INTEGER NOT NULL,
                process_difficulty INTEGER NOT NULL,
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
                    id, position, company_name, company_domain, CAST(salary AS REAL), 
                    COALESCE(CAST(workload AS REAL), 30), benefits, work_environment, 
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

                        // Verificar a estrutura final da tabela
                        db.all("PRAGMA table_info(Internships)", (err, rows) => {
                            if (err) {
                                console.error('Erro ao verificar estrutura final:', err);
                                closeDb();
                                return;
                            }

                            console.log('\nEstrutura final da tabela:');
                            rows.forEach(row => {
                                console.log(`${row.name} (${row.type})${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
                            });

                            // Verificar alguns registros
                            db.all("SELECT id, workload, typeof(workload) as workload_type FROM Internships LIMIT 5", (err, rows) => {
                                if (err) {
                                    console.error('Erro ao verificar registros:', err);
                                } else {
                                    console.log('\nAmostra de registros:');
                                    rows.forEach(row => {
                                        console.log(`ID: ${row.id}, Workload: ${row.workload} (${row.workload_type})`);
                                    });
                                }
                                closeDb();
                            });
                        });
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
            console.log('\nConexão com o banco de dados fechada');
        }
    });
} 