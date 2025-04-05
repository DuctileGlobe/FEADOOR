import sqlite3
import os

# Caminho para o banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'database.sqlite')

try:
    # Conectar ao banco de dados
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Obter informações sobre a tabela Users
    cursor.execute("PRAGMA table_info(Users)")
    columns = cursor.fetchall()
    
    print("Estrutura da tabela Users:")
    for column in columns:
        print(f"Coluna: {column[1]}, Tipo: {column[2]}, NotNull: {column[3]}, Default: {column[4]}, PK: {column[5]}")
    
    # Verificar se o usuário existe
    cursor.execute("SELECT * FROM Users WHERE email = ?", ('ianeliascl@usp.br',))
    user = cursor.fetchone()
    
    if user:
        print("\nUsuário encontrado:")
        # Obter nomes das colunas
        cursor.execute("PRAGMA table_info(Users)")
        column_names = [column[1] for column in cursor.fetchall()]
        
        # Imprimir valores
        for i, value in enumerate(user):
            print(f"{column_names[i]}: {value}")
    else:
        print("\nUsuário não encontrado.")
    
    # Fechar a conexão
    conn.close()
    print("\nConexão com o banco de dados fechada")
    
except sqlite3.Error as e:
    print(f"Erro ao acessar o banco de dados: {e}")
except Exception as e:
    print(f"Erro inesperado: {e}") 