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

// Email do usuário a ser promovido
const userEmail = 'ianeliascl@usp.br';

// Atualizar o usuário para admin
db.run(
  "UPDATE Users SET role = 'admin' WHERE email = ?",
  [userEmail],
  function(err) {
    if (err) {
      console.error('Erro ao atualizar usuário:', err);
    } else {
      if (this.changes > 0) {
        console.log(`Usuário ${userEmail} promovido a administrador com sucesso!`);
      } else {
        console.log(`Usuário ${userEmail} não encontrado.`);
      }
    }
    
    // Fechar a conexão
    db.close((err) => {
      if (err) {
        console.error('Erro ao fechar o banco de dados:', err);
      } else {
        console.log('Conexão com o banco de dados fechada');
      }
    });
  }
); 