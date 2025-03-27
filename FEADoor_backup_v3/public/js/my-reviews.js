document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticação
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // Carregar nome do usuário
    try {
        const userResponse = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (userResponse.ok) {
            const userData = await userResponse.json();
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }

    // Função para carregar avaliações do usuário
    async function loadUserReviews() {
        const token = checkAuth();
        if (!token) return;

        try {
            const response = await fetch('/api/internships/my-reviews', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar avaliações');
            }

            const reviews = await response.json();
            const reviewsList = document.querySelector('.reviews-list');
            const totalReviews = reviews.length;

            // Atualiza o contador de avaliações
            document.querySelector('.stat-number').textContent = totalReviews;

            // Se não houver avaliações, mostra o estado vazio
            if (totalReviews === 0) {
                reviewsList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Nenhuma avaliação encontrada</h3>
                        <p>Você ainda não avaliou nenhum estágio. Que tal compartilhar sua experiência?</p>
                        <a href="add-review.html" class="add-review-btn">
                            <i class="fas fa-plus"></i>
                            Avaliar Estágio
                        </a>
                    </div>
                `;
                return;
            }

            // Renderiza as avaliações
            reviewsList.innerHTML = reviews.map(review => `
                <div class="review-card" data-id="${review.id}">
                    <div class="review-header">
                        <div class="company-info">
                            <img src="https://logo.clearbit.com/${review.company_domain}" 
                                 alt="${review.company_name}" 
                                 class="company-logo"
                                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(review.company_name)}&background=1a237e&color=fff'">
                            <div>
                                <h3>${review.position}</h3>
                                <h4>${review.company_name}</h4>
                                <span class="review-date">Avaliado em ${formatDate(review.created_at)}</span>
                            </div>
                        </div>
                        <div class="review-actions">
                            <button class="edit-btn" onclick="editReview(${review.id})">
                                <i class="fas fa-edit"></i>
                                Editar
                            </button>
                            <button class="delete-btn" onclick="deleteReview(${review.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="review-content">
                        <div class="review-stats">
                            <div class="stat-item">
                                <i class="fas fa-money-bill-wave"></i>
                                <span>${formatSalary(review.salary)}</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-graduation-cap"></i>
                                <span>Conciliação: ${review.reconciliation_difficulty}</span>
                            </div>
                            <div class="stat-item">
                                <i class="fas fa-user-graduate"></i>
                                <span>Processo: ${review.process_difficulty}</span>
                            </div>
                        </div>
                        
                        <div class="review-text">
                            <h5>Benefícios</h5>
                            <p>${review.benefits}</p>
                            
                            <h5>Ambiente de Trabalho</h5>
                            <p>${review.work_environment}</p>
                        </div>

                        <div class="review-metrics">
                            <div class="metric">
                                <i class="fas fa-eye"></i>
                                <span>${review.views} visualizações</span>
                            </div>
                            <div class="metric">
                                <i class="fas fa-thumbs-up"></i>
                                <span>${review.likes} curtidas</span>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Erro ao carregar avaliações:', error);
            document.querySelector('.reviews-list').innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Erro ao carregar avaliações</h3>
                    <p>Ocorreu um erro ao carregar suas avaliações. Por favor, tente novamente mais tarde.</p>
                </div>
            `;
        }
    }

    // Carregar avaliações inicialmente
    await loadUserReviews();

    // Função para editar avaliação
    window.editReview = function(id) {
        window.location.href = `/edit-review.html?id=${id}`;
    };

    // Função para deletar avaliação
    window.deleteReview = async function(id) {
        const token = checkAuth();
        if (!token) return;

        if (!confirm('Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const response = await fetch(`/api/internships/reviews/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar avaliação');
            }

            // Remove o card da avaliação da página
            const reviewCard = document.querySelector(`[data-id="${id}"]`);
            reviewCard.remove();

            // Atualiza o contador de avaliações
            const statNumber = document.querySelector('.stat-number');
            const currentCount = parseInt(statNumber.textContent);
            statNumber.textContent = currentCount - 1;

            // Se não houver mais avaliações, mostra o estado vazio
            if (currentCount - 1 === 0) {
                document.querySelector('.reviews-list').innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <h3>Nenhuma avaliação encontrada</h3>
                        <p>Você ainda não avaliou nenhum estágio. Que tal compartilhar sua experiência?</p>
                        <a href="add-review.html" class="add-review-btn">
                            <i class="fas fa-plus"></i>
                            Avaliar Estágio
                        </a>
                    </div>
                `;
            }

            alert('Avaliação excluída com sucesso!');
        } catch (error) {
            console.error('Erro ao deletar avaliação:', error);
            alert('Erro ao excluir avaliação. Por favor, tente novamente.');
        }
    };
});

// Função para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

// Função para formatar salário
function formatSalary(salary) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(salary);
} 