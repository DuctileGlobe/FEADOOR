document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('internshipForm');
    
    // Formatar input de salário
    const salaryInput = document.getElementById('salary');
    salaryInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value) {
            value = (parseFloat(value) / 100).toFixed(2);
            e.target.value = value;
        }
    });

    // Função para mostrar mensagens de erro
    function showError(message) {
        const errorDiv = document.getElementById('errorMessages') || (() => {
            const div = document.createElement('div');
            div.id = 'errorMessages';
            div.className = 'error-messages';
            form.insertBefore(div, form.firstChild);
            return div;
        })();

        errorDiv.innerHTML = `
            <div class="error-alert">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;

        // Scroll para o topo para mostrar o erro
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Função para limpar mensagens de erro
    function clearErrors() {
        const errorDiv = document.getElementById('errorMessages');
        if (errorDiv) {
            errorDiv.innerHTML = '';
        }
    }

    // Manipular envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        clearErrors();

        // Validar campos obrigatórios
        const requiredFields = {
            'companyName': 'nome da empresa',
            'position': 'cargo',
            'area': 'área',
            'location': 'localização',
            'salary': 'salário',
            'workload': 'carga horária',
            'benefits': 'benefícios',
            'rating': 'avaliação geral',
            'conciliationRating': 'dificuldade de conciliação',
            'conciliationComments': 'comentários sobre conciliação',
            'processDifficulty': 'dificuldade do processo',
            'processComments': 'comentários sobre o processo',
            'pros': 'pontos positivos',
            'cons': 'pontos negativos',
            'learningExperience': 'experiência de aprendizado'
        };

        const missingFields = [];
        for (const [id, label] of Object.entries(requiredFields)) {
            const element = document.getElementById(id);
            if (!element.value.trim()) {
                missingFields.push(label);
                element.classList.add('invalid');
            }
        }

        if (missingFields.length > 0) {
            showError(`Por favor, preencha os seguintes campos obrigatórios: ${missingFields.join(', ')}`);
            return;
        }

        // Validar valores numéricos
        const salary = parseFloat(document.getElementById('salary').value);
        if (salary <= 0) {
            showError('O salário deve ser maior que zero');
            return;
        }

        const rating = parseInt(document.getElementById('rating').value);
        const conciliationRating = parseInt(document.getElementById('conciliationRating').value);
        const processDifficulty = parseInt(document.getElementById('processDifficulty').value);
        
        if (rating < 1 || rating > 5 || 
            conciliationRating < 1 || conciliationRating > 5 ||
            processDifficulty < 1 || processDifficulty > 5) {
            showError('As avaliações devem estar entre 1 e 5');
            return;
        }

        // Coletar dados do formulário
        const formData = {
            companyName: document.getElementById('companyName').value.trim(),
            position: document.getElementById('position').value.trim(),
            area: document.getElementById('area').value.trim(),
            location: document.getElementById('location').value.trim(),
            salary: salary,
            workload: parseInt(document.getElementById('workload').value),
            benefits: document.getElementById('benefits').value.trim(),
            rating: rating,
            conciliationRating: conciliationRating,
            conciliationComments: document.getElementById('conciliationComments').value.trim(),
            processDifficulty: processDifficulty,
            processComments: document.getElementById('processComments').value.trim(),
            pros: document.getElementById('pros').value.trim(),
            cons: document.getElementById('cons').value.trim(),
            learningExperience: document.getElementById('learningExperience').value.trim(),
            hasRemote: document.getElementById('hasRemote').checked
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/login.html';
                return;
            }

            const response = await fetch('/api/internships', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (errorData.errors && Array.isArray(errorData.errors)) {
                    // Erros de validação do Sequelize
                    const errorMessages = errorData.errors.map(err => err.message);
                    showError(errorMessages.join('<br>'));
                } else {
                    throw new Error(errorData.error || 'Erro ao enviar avaliação');
                }
                return;
            }

            const result = await response.json();
            
            // Mostrar mensagem de sucesso
            alert('Avaliação enviada com sucesso! Ela será revisada antes de ser publicada.');
            
            // Redirecionar para a página de minhas avaliações
            window.location.href = '/my-reviews.html';

        } catch (error) {
            console.error('Erro:', error);
            showError(error.message || 'Erro ao enviar avaliação. Por favor, tente novamente.');
        }
    });

    // Validação em tempo real
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });

        input.addEventListener('input', function() {
            if (this.value) {
                this.classList.remove('invalid');
            }
        });
    });
}); 