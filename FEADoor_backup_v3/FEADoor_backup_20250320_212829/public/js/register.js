// Função para validar o formulário
function validateForm(formData) {
    const errors = [];

    // Validar nome
    if (formData.name.length < 3) {
        errors.push('Nome deve ter pelo menos 3 caracteres');
    }

    // Validar email USP
    if (!formData.email.endsWith('@usp.br')) {
        errors.push('Por favor, use seu email USP (@usp.br)');
    }

    // Validar senha
    if (formData.password.length < 6) {
        errors.push('A senha deve ter pelo menos 6 caracteres');
    }

    // Validar confirmação de senha
    if (formData.password !== formData.confirmPassword) {
        errors.push('As senhas não coincidem');
    }

    // Validar curso
    if (!['Administração', 'Ciências Contábeis', 'Economia', 'Atuária'].includes(formData.course)) {
        errors.push('Selecione um curso válido');
    }

    // Validar ano de formatura
    const currentYear = new Date().getFullYear();
    const graduationYear = parseInt(formData.graduationYear);
    if (graduationYear < currentYear || graduationYear > currentYear + 5) {
        errors.push('Ano de formatura inválido');
    }

    return errors;
}

// Função para mostrar mensagens de erro
function showErrors(errors) {
    // Remove mensagens de erro anteriores
    const existingErrors = document.querySelector('.error-messages');
    if (existingErrors) {
        existingErrors.remove();
    }

    if (errors.length > 0) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-messages';
        errorDiv.style.color = '#ff4444';
        errorDiv.style.marginBottom = '1rem';
        errorDiv.style.padding = '1rem';
        errorDiv.style.backgroundColor = '#ffebee';
        errorDiv.style.borderRadius = 'var(--radius)';

        const errorList = document.createElement('ul');
        errorList.style.marginLeft = '1.5rem';
        errors.forEach(error => {
            const li = document.createElement('li');
            li.textContent = error;
            errorList.appendChild(li);
        });

        errorDiv.appendChild(errorList);
        const form = document.querySelector('.register-form');
        form.insertBefore(errorDiv, form.firstChild);
    }
}

// Função para lidar com o registro
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        course: document.getElementById('course').value,
        graduationYear: document.getElementById('graduationYear').value
    };

    // Validar formulário
    const errors = validateForm(formData);
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            // Salva o token e dados do usuário
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redireciona para o dashboard
            window.location.href = '/dashboard.html';
        } else {
            showErrors([data.error || 'Erro ao criar conta']);
        }
    } catch (error) {
        showErrors(['Erro ao conectar com o servidor']);
    }
}

// Adiciona o evento de submit ao formulário quando a página carregar
window.onload = function() {
    document.querySelector('.register-form').addEventListener('submit', handleRegister);
}; 