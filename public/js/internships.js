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

    // Função para carregar estágios
    async function loadInternships(filters = {}) {
        try {
            let url = '/api/internships/public';
            if (filters.search) {
                url += `?search=${encodeURIComponent(filters.search)}`;
            }
            if (filters.area) {
                url += `${url.includes('?') ? '&' : '?'}area=${encodeURIComponent(filters.area)}`;
            }
            if (filters.location) {
                url += `${url.includes('?') ? '&' : '?'}location=${encodeURIComponent(filters.location)}`;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar estágios');
            }

            const internships = await response.json();
            const internshipsContainer = document.querySelector('.internships-grid');
            
            if (internships.length === 0) {
                internshipsContainer.innerHTML = `
                    <div class="no-internships">
                        <p>Nenhum estágio encontrado.</p>
                        <a href="/add-review.html" class="btn-primary">Adicionar Avaliação</a>
                    </div>
                `;
                return;
            }

            internshipsContainer.innerHTML = internships.map(internship => {
                // Função para gerar estrelas coloridas
                const getStarRating = (rating) => {
                    const fullStars = Math.floor(rating);
                    const hasHalfStar = rating % 1 !== 0;
                    let stars = '';
                    
                    for (let i = 0; i < 5; i++) {
                        if (i < fullStars) {
                            stars += '<i class="fas fa-star star"></i>';
                        } else if (i === fullStars && hasHalfStar) {
                            stars += '<i class="fas fa-star-half-alt star"></i>';
                        } else {
                            stars += '<i class="far fa-star star empty"></i>';
                        }
                    }
                    return stars;
                };

                // Separar o ambiente de trabalho em tópicos
                const workEnv = internship.work_environment || '';
                const sections = workEnv.split('\n\n');
                let pros = '', cons = '', learning = '', process = '';
                
                sections.forEach(section => {
                    if (section.includes('Pontos Positivos:')) {
                        pros = section.replace('Pontos Positivos:', '').trim();
                    } else if (section.includes('Pontos Negativos:')) {
                        cons = section.replace('Pontos Negativos:', '').trim();
                    } else if (section.includes('Aprendizado:')) {
                        learning = section.replace('Aprendizado:', '').trim();
                    } else if (section.includes('Processo Seletivo:')) {
                        process = section.replace('Processo Seletivo:', '').trim();
                    }
                });

                return `
                    <div class="internship-card" data-id="${internship.id}">
                        <div class="card-header">
                            <div class="company-header">
                                <h3>${internship.company_name || 'Empresa não especificada'}</h3>
                                <div class="location-info">
                                    <i class="fas fa-building"></i>
                                    <span>${internship.company_domain ? internship.company_domain.split(' - ')[1] : 'Localização não especificada'}</span>
                                </div>
                            </div>
                            <div class="rating">
                                <span class="rating-value">${internship.process_difficulty || '0'}/5</span>
                                <div class="stars">
                                    ${getStarRating(internship.process_difficulty || 0)}
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="position-info">
                                <span class="position">${internship.position || 'Cargo não especificado'}</span>
                                <span class="area">${internship.company_domain ? internship.company_domain.split(' - ')[1] : 'Localização não especificada'}</span>
                            </div>
                            
                            <div class="details">
                                <div class="detail-item">
                                    <i class="fas fa-money-bill-wave"></i>
                                    <span>R$ ${formatSalary(internship.salary || 0)}</span>
                                </div>
                                <div class="detail-item">
                                    <i class="fas fa-clock"></i>
                                    <span>${internship.workload || 'N/A'} horas/semana</span>
                                </div>
                            </div>

                            <div class="benefits-section">
                                <h4><i class="fas fa-gift"></i> Benefícios</h4>
                                <ul class="benefits-list">
                                    ${(internship.benefits || '').split('\n').map(benefit => 
                                        `<li><i class="fas fa-check"></i> ${benefit.trim()}</li>`
                                    ).join('')}
                                </ul>
                            </div>

                            <div class="work-environment">
                                <h4><i class="fas fa-briefcase"></i> Ambiente de Trabalho</h4>
                                <div class="environment-points">
                                    ${pros ? `
                                        <div class="point-item positive">
                                            <h5><i class="fas fa-check-circle"></i> Pontos Positivos</h5>
                                            <p>${pros}</p>
                                        </div>
                                    ` : ''}
                                    ${cons ? `
                                        <div class="point-item negative">
                                            <h5><i class="fas fa-times-circle"></i> Pontos Negativos</h5>
                                            <p>${cons}</p>
                                        </div>
                                    ` : ''}
                                    ${learning ? `
                                        <div class="point-item neutral">
                                            <h5><i class="fas fa-graduation-cap"></i> Aprendizado</h5>
                                            <p>${learning}</p>
                                        </div>
                                    ` : ''}
                                    ${process ? `
                                        <div class="point-item neutral">
                                            <h5><i class="fas fa-clipboard-list"></i> Processo Seletivo</h5>
                                            <p>${process}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            <div class="reconciliation">
                                <h4><i class="fas fa-balance-scale"></i> Conciliação com a FEA</h4>
                                <div class="rating">
                                    <div class="stars">
                                        ${getStarRating(internship.reconciliation_difficulty || 0)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

            // Adiciona event listener de clique aos cards de estágio
            const cards = internshipsContainer.querySelectorAll('.internship-card');
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const internshipId = card.getAttribute('data-id');
                    window.location.href = `/internship-details.html?id=${internshipId}`;
                });
            });

        } catch (error) {
            console.error('Erro:', error);
            document.querySelector('.internships-grid').innerHTML = `
                <div class="error-message">
                    <p>Erro ao carregar os estágios. Por favor, tente novamente mais tarde.</p>
                </div>
            `;
        }
    }

    // Carregar estágios inicialmente
    await loadInternships();

    // Configurar busca e filtros
    const searchInput = document.getElementById('searchInput');
    const areaFilter = document.getElementById('areaFilter');
    const locationFilter = document.getElementById('locationFilter');

    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const filters = {
                search: searchInput.value,
                area: areaFilter.value,
                location: locationFilter.value
            };
            loadInternships(filters);
        }, 300);
    });

    areaFilter.addEventListener('change', function() {
        const filters = {
            search: searchInput.value,
            area: areaFilter.value,
            location: locationFilter.value
        };
        loadInternships(filters);
    });

    locationFilter.addEventListener('change', function() {
        const filters = {
            search: searchInput.value,
            area: areaFilter.value,
            location: locationFilter.value
        };
        loadInternships(filters);
    });
});

// Função para formatar o salário
function formatSalary(salary) {
    return salary.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
} 