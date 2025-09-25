// --- Funções Globais (podem ser chamadas de qualquer lugar) ---

/**
 * Configura todos os botões e links relacionados aos modais.
 */
function initializeModals() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const closeBtns = document.querySelectorAll('#modal-container .close-btn');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');

    const closeAllModals = () => {
        if (loginModal) loginModal.style.display = 'none';
        if (registerModal) registerModal.style.display = 'none';
    };

    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            loginModal.style.display = 'flex';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            registerModal.style.display = 'flex';
        });
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal || e.target === registerModal) {
            closeAllModals();
        }
    });

    // Evento para fechar o modal de cadastro após o sucesso da validação
    window.addEventListener('closeActiveModal', closeAllModals);


    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            registerModal.style.display = 'flex';
        });
    }

    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            loginModal.style.display = 'flex';
        });
    }
}

/**
 * Valida o formulário de cadastro.
 * Retorna false para impedir o envio do formulário se houver erros.
 */
function validaForm() {
    let formValido = true;
    document.querySelectorAll('#formCadastroModal .input-error').forEach(input => input.classList.remove('input-error'));
    document.querySelectorAll('#formCadastroModal .error-message').forEach(span => span.textContent = '');

    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const idade = document.getElementById('idade');
    const turma = document.getElementById('turma');
    const esporte = document.getElementById('esporte');
    const cpf = document.getElementById('cpf');
    const senha = document.getElementById('senha');

    const setError = (inputElement, message) => {
        inputElement.classList.add('input-error');
        document.getElementById(`${inputElement.id}-error`).textContent = message;
        formValido = false;
    };

    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']{3,}$/;
    if (nome.value.trim() === '') setError(nome, 'O campo nome é obrigatório.');
    else if (!nomeRegex.test(nome.value)) setError(nome, 'Nome inválido. Use apenas letras e espaços.');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') setError(email, 'O campo email é obrigatório.');
    else if (!emailRegex.test(email.value)) setError(email, 'Formato de e-mail inválido.');

    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (senha.value.trim() === '') setError(senha, 'O campo senha é obrigatório.');
    else if (!senhaRegex.test(senha.value)) setError(senha, 'A senha deve ter 8+ caracteres, com maiúscula, minúscula e número.');

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (cpf.value.trim() !== '' && !cpfRegex.test(cpf.value)) setError(cpf, 'Formato de CPF inválido. Use XXX.XXX.XXX-XX.');

    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (telefone.value.trim() !== '' && !telefoneRegex.test(telefone.value)) setError(telefone, 'Formato de telefone inválido. Use (XX) XXXXX-XXXX.');

    if (idade.value.trim() !== '' && (isNaN(idade.value) || idade.value <= 0 || idade.value > 120)) setError(idade, 'Idade inválida.');
    if (turma.value.trim() === '') setError(turma, 'O campo turma é obrigatório.');
    if (esporte.value.trim() === '') setError(esporte, 'O campo esporte é obrigatório.');

    if (formValido) {
        alert('Cadastro realizado com sucesso! (simulação)');
        document.getElementById('formCadastroModal').reset();
        gerarJson(true); // O 'true' indica para baixar o arquivo

        const closeModalEvent = new Event('closeActiveModal');
        window.dispatchEvent(closeModalEvent);
    }
    return false;
}

/**
 * Aplica máscara de CPF (XXX.XXX.XXX-XX).
 */
function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '').substring(0, 11);
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = valor;
}

/**
 * Aplica máscara de celular (XX) XXXXX-XXXX.
 */
function mascaraCelular(input) {
    let valor = input.value.replace(/\D/g, '').substring(0, 11);
    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    valor = valor.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    input.value = valor;
}

/**
 * Gera um arquivo JSON com os dados do formulário e, opcionalmente, inicia o download.
 */
function gerarJson(iniciarDownload = false) {
    const form = document.getElementById('formCadastroModal');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data, null, 2);

    console.log("JSON Gerado:");
    console.log(jsonData);

    if (iniciarDownload) {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const linkDownload = document.createElement('a');
        linkDownload.href = url;
        linkDownload.download = 'cadastro.json';
        document.body.appendChild(linkDownload);
        linkDownload.click();
        document.body.removeChild(linkDownload);
        URL.revokeObjectURL(url);
    } else {
        alert("O JSON com os dados do formulário foi gerado no console (Pressione F12 para ver).");
    }
}


// --- Lógica Principal da Página ---
document.addEventListener('DOMContentLoaded', () => {
    // Carrega o conteúdo dos modais em todas as páginas
    const containerModal = document.getElementById('modal-container');
    if (containerModal) {
        fetch('modais_index.html')
            .then(resposta => resposta.text())
            .then(html => {
                containerModal.innerHTML = html;
                initializeModals();
                // Adiciona o listener ao botão Gerar JSON depois que o modal for carregado
                const btnGerarJson = document.getElementById('btnGerarJson');
                if (btnGerarJson) {
                    btnGerarJson.addEventListener('click', () => gerarJson(true));
                }
            })
            .catch(erro => console.error('Erro ao carregar os modais:', erro));
    }

    // --- LÓGICA ESPECÍFICA DO CARROSSEL ---
      const trilho = document.querySelector('.carrossel-trilho');
    if (!trilho) return; // Só executa se estiver na página da galeria

    const botaoProximo = document.getElementById('botaoProximo');
    const botaoAnterior = document.getElementById('botaoAnterior');
    const slides = Array.from(trilho.children);
    const totalSlides = slides.length;
    let slideAtualIndex = 0; // Variável para guardar o slide atual

    const moverTrilho = () => {
        const larguraSlide = slides[0].getBoundingClientRect().width;
        trilho.style.transform = `translateX(-${slideAtualIndex * larguraSlide}px)`;
    };

    const atualizarBotoes = () => {
        botaoAnterior.classList.toggle('escondido', slideAtualIndex === 0);
        botaoProximo.classList.toggle('escondido', slideAtualIndex === totalSlides - 1);
    };

    // Evento para o botão "Próximo"
    botaoProximo.addEventListener('click', () => {
        if (slideAtualIndex < totalSlides - 1) {
            slideAtualIndex++;
            moverTrilho();
            atualizarBotoes();
        }
    });

    // Evento para o botão "Anterior"
    botaoAnterior.addEventListener('click', () => {
        if (slideAtualIndex > 0) {
            slideAtualIndex--;
            moverTrilho();
            atualizarBotoes();
        }
    });
    
    // Inicia os botões na posição correta
    atualizarBotoes();
});

