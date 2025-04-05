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

    // Verificar a estrutura da tabela Internships
    db.all("PRAGMA table_info(Internships)", (err, rows) => {
        if (err) {
            console.error('Erro ao verificar a estrutura da tabela:', err);
            return;
        }

        console.log('Estrutura da tabela Internships:');
        rows.forEach(row => {
            console.log(`${row.name} (${row.type})${row.notnull ? ' NOT NULL' : ''}${row.pk ? ' PRIMARY KEY' : ''}`);
        });

        // Verificar alguns registros para ver o valor do campo workload
        db.all("SELECT id, workload, typeof(workload) as workload_type FROM Internships LIMIT 5", (err, rows) => {
            if (err) {
                console.error('Erro ao consultar registros:', err);
                return;
            }

            console.log('\nAmostra de registros:');
            rows.forEach(row => {
                console.log(`ID: ${row.id}, Workload: ${row.workload} (${row.workload_type})`);
            });

            // Fechar a conexão com o banco de dados
            db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar a conexão com o banco de dados:', err);
                } else {
                    console.log('\nConexão com o banco de dados fechada');
                }
            });
        });
    });
}); 