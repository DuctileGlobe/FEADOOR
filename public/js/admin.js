// Verificar se o usuário é admin
async function checkAdminAccess() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Decodifica o token JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (!payload.role || payload.role !== 'admin') {
            window.location.href = 'index.html';
            return;
        }

        // Se chegou aqui, é admin
        // Carrega os dados apenas se o usuário for admin
        await loadUsers();
        await loadInternships();
    } catch (error) {
        console.error('Erro ao verificar acesso:', error);
        window.location.href = 'login.html';
    }
}

// Verificar acesso de admin quando a página carregar
document.addEventListener('DOMContentLoaded', checkAdminAccess);

// Carregar usuários
async function loadUsers() {
    try {
        const response = await fetch('/api/admin/users', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar usuários');
        }

        const users = await response.json();
        const tbody = document.getElementById('usersTableBody');
        tbody.innerHTML = '';

        users.forEach(user => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${user.isBanned ? 'status-banned' : user.role === 'admin' ? 'status-admin' : 'status-active'}">
                        ${user.isBanned ? 'Banido' : user.role === 'admin' ? 'Admin' : 'Ativo'}
                    </span>
                </td>
                <td>
                    ${user.role !== 'admin' ? `
                        <button class="action-button ban-button" onclick="toggleBanUser(${user.id}, ${user.isBanned})">
                            ${user.isBanned ? 'Desbanir' : 'Banir'}
                        </button>
                    ` : ''}
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários');
    }
}

// Carregar estágios
async function loadInternships() {
    try {
        const response = await fetch('/api/admin/internships', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao carregar estágios');
        }

        const internships = await response.json();
        const tbody = document.getElementById('internshipsTableBody');
        tbody.innerHTML = '';

        internships.forEach(internship => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${internship.company_name}</td>
                <td>${internship.position}</td>
                <td>${internship.User ? internship.User.name : 'N/A'}</td>
                <td>${new Date(internship.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="action-button delete-button" onclick="deleteInternship(${internship.id})">
                        Deletar
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar estágios:', error);
        alert('Erro ao carregar estágios');
    }
}

// Banir/Desbanir usuário
async function toggleBanUser(userId, isCurrentlyBanned) {
    const action = isCurrentlyBanned ? 'desbanir' : 'banir';
    if (await showConfirmation(`Tem certeza que deseja ${action} este usuário?`)) {
        try {
            const response = await fetch(`/api/admin/users/${userId}/ban`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao ${action} usuário`);
            }

            loadUsers();
        } catch (error) {
            console.error(`Erro ao ${action} usuário:`, error);
            alert(`Erro ao ${action} usuário`);
        }
    }
}

// Deletar estágio
async function deleteInternship(internshipId) {
    if (await showConfirmation('Tem certeza que deseja deletar este estágio?')) {
        try {
            const response = await fetch(`/api/admin/internships/${internshipId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao deletar estágio');
            }

            loadInternships();
        } catch (error) {
            console.error('Erro ao deletar estágio:', error);
            alert('Erro ao deletar estágio');
        }
    }
}

// Modal de confirmação
function showConfirmation(message) {
    return new Promise((resolve) => {
        const modal = document.getElementById('confirmationModal');
        const modalMessage = document.getElementById('modalMessage');
        const confirmButton = document.getElementById('confirmAction');
        const cancelButton = document.getElementById('cancelAction');

        modalMessage.textContent = message;
        modal.style.display = 'block';

        confirmButton.onclick = () => {
            modal.style.display = 'none';
            resolve(true);
        };

        cancelButton.onclick = () => {
            modal.style.display = 'none';
            resolve(false);
        };
    });
}

// Busca de usuários
document.getElementById('userSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.getElementById('usersTableBody').getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        const email = row.cells[1].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) || email.includes(searchTerm) ? '' : 'none';
    });
});

// Busca de estágios
document.getElementById('internshipSearch').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.getElementById('internshipsTableBody').getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
        const company = row.cells[0].textContent.toLowerCase();
        const position = row.cells[1].textContent.toLowerCase();
        const author = row.cells[2].textContent.toLowerCase();
        row.style.display = company.includes(searchTerm) || position.includes(searchTerm) || author.includes(searchTerm) ? '' : 'none';
    });
});

// Navegação entre abas
document.getElementById('usersTab').addEventListener('click', function() {
    document.getElementById('usersSection').classList.add('active');
    document.getElementById('internshipsSection').classList.remove('active');
    this.classList.add('active');
    document.getElementById('internshipsTab').classList.remove('active');
});

document.getElementById('internshipsTab').addEventListener('click', function() {
    document.getElementById('internshipsSection').classList.add('active');
    document.getElementById('usersSection').classList.remove('active');
    this.classList.add('active');
    document.getElementById('usersTab').classList.remove('active');
});

// Logout
document.getElementById('logoutButton').addEventListener('click', function() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadUsers();
    loadInternships();
}); 