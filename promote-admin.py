import sqlite3
import os

# Caminho para o banco de dados
db_path = os.path.join(os.path.dirname(__file__), 'database.sqlite')

# Email do usuário a ser promovido
user_email = 'ianeliascl@usp.br'

try:
    # Conectar ao banco de dados
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Verificar se o usuário existe
    cursor.execute("SELECT * FROM Users WHERE email = ?", (user_email,))
    user = cursor.fetchone()
    
    if user:
        # Atualizar o usuário para admin
        cursor.execute("UPDATE Users SET role = 'admin' WHERE email = ?", (user_email,))
        conn.commit()
        print(f"Usuário {user_email} promovido a administrador com sucesso!")
        
        # Verificar se a atualização foi bem-sucedida
        cursor.execute("SELECT role FROM Users WHERE email = ?", (user_email,))
        role = cursor.fetchone()[0]
        print(f"Role atual do usuário: {role}")
    else:
        print(f"Usuário {user_email} não encontrado.")
    
    # Fechar a conexão
    conn.close()
    print("Conexão com o banco de dados fechada")
    
except sqlite3.Error as e:
    print(f"Erro ao acessar o banco de dados: {e}")
except Exception as e:
    print(f"Erro inesperado: {e}") 