document.addEventListener('DOMContentLoaded', function() {
    const userMenu = document.querySelector('.user-menu');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const logoutBtn = document.getElementById('logoutBtn');

    // Carregar dados do usuário
    const token = localStorage.getItem('token');
    if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        userName.textContent = user.name;
        userEmail.textContent = user.email;
    }

    // Toggle do menu
    window.toggleUserMenu = function() {
        userMenuDropdown.classList.toggle('active');
    }

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target) && userMenuDropdown.classList.contains('active')) {
            userMenuDropdown.classList.remove('active');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/';
    });
});

// Função para alternar a visibilidade do menu do usuário
function toggleUserMenu() {
    const dropdown = document.querySelector('.user-menu-dropdown');
    dropdown.classList.toggle('active');

    // Fecha o menu quando clicar fora dele
    document.addEventListener('click', function closeMenu(e) {
        const userMenu = document.querySelector('.user-menu');
        if (!userMenu.contains(e.target)) {
            dropdown.classList.remove('active');
            document.removeEventListener('click', closeMenu);
        }
    });
}

// Função para fazer logout
document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    
    try {
        // Remove o token do localStorage
        localStorage.removeItem('token');
        
        // Redireciona para a página de login
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}); 