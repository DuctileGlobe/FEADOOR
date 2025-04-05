import sqlite3
import os

# Caminho para o banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'database.sqlite')

try:
    # Conectar ao banco de dados
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Adicionar coluna 'role' se não existir
    try:
        cursor.execute("ALTER TABLE Users ADD COLUMN role VARCHAR(255) DEFAULT 'user'")
        print("Coluna 'role' adicionada com sucesso!")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Coluna 'role' já existe.")
        else:
            print(f"Erro ao adicionar coluna 'role': {e}")
    
    # Adicionar coluna 'isBanned' se não existir
    try:
        cursor.execute("ALTER TABLE Users ADD COLUMN isBanned BOOLEAN DEFAULT 0")
        print("Coluna 'isBanned' adicionada com sucesso!")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print("Coluna 'isBanned' já existe.")
        else:
            print(f"Erro ao adicionar coluna 'isBanned': {e}")
    
    # Commit das alterações
    conn.commit()
    
    # Verificar a estrutura atual da tabela
    cursor.execute("PRAGMA table_info(Users)")
    columns = cursor.fetchall()
    
    print("\nEstrutura atual da tabela Users:")
    for column in columns:
        print(f"Coluna: {column[1]}, Tipo: {column[2]}, NotNull: {column[3]}, Default: {column[4]}, PK: {column[5]}")
    
    # Fechar a conexão
    conn.close()
    print("\nConexão com o banco de dados fechada")
    
except sqlite3.Error as e:
    print(f"Erro ao acessar o banco de dados: {e}")
except Exception as e:
    print(f"Erro inesperado: {e}") 