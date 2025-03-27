// Função para pegar parâmetros da URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Função principal que será executada quando a página carregar
window.onload = function() {
    const emailFromUrl = getUrlParameter('email');
    if (emailFromUrl) {
        document.getElementById('email').value = emailFromUrl;
        // Foca no campo de senha já que o email já está preenchido
        document.getElementById('password').focus();
    }

    // Adiciona o evento de submit ao formulário
    document.querySelector('.email-login-form').addEventListener('submit', handleLogin);
};

// Função para lidar com o login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redireciona para o dashboard
            window.location.href = '/dashboard.html';
        } else {
            alert(data.error || 'Erro ao fazer login');
        }
    } catch (error) {
        alert('Erro ao conectar com o servidor');
    }
} 