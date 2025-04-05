// Verifica se o usuário está autenticado
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }
    return token;
}

// Carrega os dados do perfil do usuário
async function loadUserProfile() {
    const token = checkAuth();
    if (!token) return;

    try {
        const response = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar perfil');
        }

        const user = await response.json();
        
        // Atualiza os elementos do perfil apenas se eles existirem
        const userNameElement = document.getElementById('userName');
        const userEmailElement = document.getElementById('userEmail');
        
        if (userNameElement) {
            userNameElement.textContent = user.name;
        }
        
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }

        return user;
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    }
}

// Carrega o perfil quando a página carregar
document.addEventListener('DOMContentLoaded', loadUserProfile);

// Verificar autenticação em todas as páginas exceto login e registro
if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
    }
} else {
    // Se estiver na página de login ou registro e já estiver autenticado, redirecionar para internships
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = '/internships.html';
    }
} 