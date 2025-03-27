// Verifica autenticação ao carregar a página
window.onload = async function() {
    if (!window.api.isAuthenticated()) {
        window.location.href = '/login.html';
        return;
    }

    const user = window.api.getCurrentUser();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Atualiza informações do usuário no menu
    document.querySelector('.user-name').textContent = user.name;
    document.querySelector('.user-email').textContent = user.email;
    document.querySelector('.avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1a237e&color=fff`;

    // Carrega os dados do dashboard
    try {
        const response = await window.api.authenticatedFetch('/api/auth/profile');
        if (response.ok) {
            const profileData = await response.json();
            // Aqui você pode atualizar mais informações do usuário se necessário
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
};

// Toggle do menu do usuário
function toggleUserMenu() {
    const dropdown = document.querySelector('.user-menu-dropdown');
    dropdown.classList.toggle('active');

    // Fecha o menu ao clicar fora
    if (dropdown.classList.contains('active')) {
        document.addEventListener('click', closeMenuOnClickOutside);
    } else {
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

// Função para fechar o menu ao clicar fora
function closeMenuOnClickOutside(event) {
    const menu = document.querySelector('.user-menu');
    if (!menu.contains(event.target)) {
        document.querySelector('.user-menu-dropdown').classList.remove('active');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

// Função de logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
} 