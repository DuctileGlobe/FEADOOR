// Função para fazer requisições autenticadas
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Adiciona o token no header
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        // Se o token expirou ou é inválido
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
            return;
        }

        return response;
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Função para obter o usuário atual
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Exporta as funções
window.api = {
    authenticatedFetch,
    isAuthenticated,
    getCurrentUser
}; 