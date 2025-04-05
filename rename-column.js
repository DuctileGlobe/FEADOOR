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

// Renomear a coluna work_schedule para workload
db.serialize(() => {
    // Criar uma tabela temporária com a nova estrutura
    db.run(`
        CREATE TABLE Internships_temp (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            position TEXT NOT NULL,
            company_name TEXT NOT NULL,
            company_domain TEXT,
            salary REAL,
            workload TEXT,
            benefits TEXT,
            work_environment TEXT,
            reconciliation_difficulty TEXT,
            process_difficulty TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Copiar os dados da tabela antiga para a nova
    db.run(`
        INSERT INTO Internships_temp (id, position, company_name, company_domain, salary, workload, benefits, work_environment, reconciliation_difficulty, process_difficulty, createdAt)
        SELECT id, position, company_name, company_domain, salary, work_schedule, benefits, work_environment, reconciliation_difficulty, process_difficulty, createdAt
        FROM Internships
    `);

    // Remover a tabela antiga
    db.run('DROP TABLE Internships');

    // Renomear a tabela temporária para o nome original
    db.run('ALTER TABLE Internships_temp RENAME TO Internships');

    console.log('Coluna work_schedule renomeada para workload com sucesso!');
});

// Fechar a conexão com o banco de dados
db.close((err) => {
    if (err) {
        console.error('Erro ao fechar a conexão com o banco de dados:', err);
    } else {
        console.log('Conexão com o banco de dados fechada');
    }
}); 