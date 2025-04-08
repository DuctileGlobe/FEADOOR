document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const internshipId = urlParams.get('id');

    if (!internshipId) {
        document.getElementById('internship-details').innerHTML = '<p>ID do estágio não encontrado.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/internships/public/${internshipId}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar detalhes do estágio');
        }

        const internship = await response.json();
        const [area, location] = (internship.company_domain || 'Não especificada').split(' - ');
        const workEnvSections = (internship.work_environment || '').split('\n\n');
        let pros = '', cons = '', learning = '', process = '';
        
        workEnvSections.forEach(section => {
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

        const getStarRating = (rating) => {
            let stars = '';
            
            if (rating >= 1) {
                stars += '⭐';
            }
            if (rating >= 2) {
                stars += '⭐';
            }
            if (rating >= 3) {
                stars += '⭐';
            }
            if (rating >= 4) {
                stars += '⭐';
            }
            if (rating >= 5) {
                stars += '⭐';
            }

            return stars;
        };

        document.getElementById('internship-details').innerHTML = `
            <h2>${internship.position || 'Cargo não especificado'}</h2>
            <p><strong>Empresa:</strong> ${internship.company_name || 'Não especificada'}</p>
            <p><strong>Área:</strong> ${area || 'Não especificada'}</p>
            <p><strong>Localização:</strong> ${location || 'Não especificada'}</p>
            <p><strong>Salário:</strong> R$ ${internship.salary || 'N/A'}</p>
            <p><strong>Carga Horária:</strong> ${internship.workload || 'N/A'} horas/semana</p>
            <p><strong>Benefícios:</strong> ${internship.benefits || 'Nenhum'}</p>
            <p><strong>Pontos Positivos:</strong> ${pros || 'Nenhum'}</p>
            <p><strong>Pontos Negativos:</strong> ${cons || 'Nenhum'}</p>
            <p><strong>Experiência de Aprendizado:</strong> ${learning || 'Nenhuma'}</p>
            <p><strong>Comentários do Processo Seletivo:</strong> ${process || 'Nenhum'}</p>
            <p><strong>Dificuldade de Conciliação:</strong> ${getStarRating(internship.reconciliation_difficulty || 0)}</p>
            <p><strong>Dificuldade do Processo Seletivo:</strong> ${getStarRating(internship.process_difficulty || 0)}</p>
        `;
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('internship-details').innerHTML = '<p>Erro ao carregar os detalhes do estágio. Por favor, tente novamente mais tarde.</p>';
    }
}); 