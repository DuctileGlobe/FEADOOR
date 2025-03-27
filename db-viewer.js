const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

// Função para mostrar todas as tabelas
function showTables() {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error('Erro ao listar tabelas:', err);
            return;
        }
        console.log('\n=== TABELAS NO BANCO DE DADOS ===');
        tables.forEach(table => {
            console.log(`- ${table.name}`);
        });
        
        // Para cada tabela, mostrar seus dados
        tables.forEach(table => {
            showTableData(table.name);
        });
    });
}

// Função para mostrar dados de uma tabela
function showTableData(tableName) {
    db.all(`SELECT * FROM ${tableName}`, [], (err, rows) => {
        if (err) {
            console.error(`Erro ao ler dados da tabela ${tableName}:`, err);
            return;
        }
        
        console.log(`\n=== DADOS DA TABELA: ${tableName} ===`);
        if (rows.length === 0) {
            console.log('Nenhum registro encontrado');
        } else {
            console.table(rows);
        }
    });
}

// Iniciar visualização
showTables();

// Fechar conexão após 2 segundos (tempo para queries terminarem)
setTimeout(() => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar banco de dados:', err);
        }
        console.log('\nConexão com banco de dados fechada.');
    });
}, 2000); 