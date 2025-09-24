function validaForm() {
    let formValido = true;

    // --- Limpeza de Erros Anteriores ---
    // Remove a classe de erro de todos os inputs
    document.querySelectorAll('#formCadastroModal .input-error').forEach(input => {
        input.classList.remove('input-error');
    });
    // Limpa todas as mensagens de erro
    document.querySelectorAll('#formCadastroModal .error-message').forEach(span => {
        span.textContent = '';
    });

    // --- Seleção dos Campos do Formulário ---
    const nome = document.getElementById('nome');
    const email = document.getElementById('email');
    const telefone = document.getElementById('telefone');
    const idade = document.getElementById('idade');
    const turma = document.getElementById('turma');
    const esporte = document.getElementById('esporte');
    const cpf = document.getElementById('cpf');
    const senha = document.getElementById('senha');

    //Achei essa função que ajuda muito a evitar repetição de código :>
    const setError = (inputElement, message) => {
        inputElement.classList.add('input-error');
        document.getElementById(`${inputElement.id}-error`).textContent = message;
        formValido = false;
    };

    // --- VALIDAÇÕES COM REGEX ---

    // 1. Validação do Nome
    // Regex: Deve ter apenas letras e espaços, mínimo de 3 caracteres. Permite acentos.
    const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']{3,}$/;
    if (nome.value.trim() === '') {
        setError(nome, 'O campo nome é obrigatório.');
    } else if (!nomeRegex.test(nome.value)) {
        setError(nome, 'Nome inválido. Use apenas letras e espaços.');
    }

    // 2. Validação do Email
    // Regex: Padrão de e-mail comum.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === '') {
        setError(email, 'O campo email é obrigatório.');
    } else if (!emailRegex.test(email.value)) {
        setError(email, 'Formato de e-mail inválido.');
    }

    // 3. Validação da Senha
    // Regex: Mínimo 8 caracteres, com pelo menos 1 letra maiúscula, 1 minúscula e 1 número.
    const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (senha.value.trim() === '') {
        setError(senha, 'O campo senha é obrigatório.');
    } else if (!senhaRegex.test(senha.value)) {
        setError(senha, 'A senha deve ter 8+ caracteres, com maiúscula, minúscula e número.');
    }

    // 4. Validação do CPF (opcional)
    // Regex: Formato XXX.XXX.XXX-XX
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (cpf.value.trim() !== '' && !cpfRegex.test(cpf.value)) {
        setError(cpf, 'Formato de CPF inválido. Use XXX.XXX.XXX-XX.');
    }

    // 5. Validação do Telefone (opcional)
    // Regex: Formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const telefoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
    if (telefone.value.trim() !== '' && !telefoneRegex.test(telefone.value)) {
        setError(telefone, 'Formato de telefone inválido. Use (XX) XXXXX-XXXX.');
    }

    // --- VALIDAÇÕES SIMPLES (NÃO-REGEX) ---

    // 6. Validação da Idade
    if (idade.value.trim() !== '' && (isNaN(idade.value) || idade.value <= 0 || idade.value > 120)) {
        setError(idade, 'Idade inválida.');
    }

    // 7. Validação de Turma
    if (turma.value.trim() === '') {
        setError(turma, 'O campo turma é obrigatório.');
    }

    // 8. Validação de Esporte Favorito
    if (esporte.value.trim() === '') {
        setError(esporte, 'O campo esporte é obrigatório.');
    }

    // --- Resultado ---
    if (formValido) {
        alert('Cadastro realizado com sucesso! (simulação)');
        document.getElementById('formCadastroModal').reset();

        
        const closeModalEvent = new Event('closeActiveModal');
        window.dispatchEvent(closeModalEvent);
    }

    // Retorna 'false' se houver algum erro, impedindo o envio do formulário
    return false;
}

/*
    Deixa o CPF (XXX.XXX.XXX-XX).
 */
function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '');

    // Limita o valor a 11 dígitos, que é o tamanho de um CPF
    valor = valor.substring(0, 11);

    // Aplica a máscara de forma progressiva
    // Adiciona o primeiro ponto depois do 3º dígito
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    // Adiciona o segundo ponto depois do 6º dígito
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    // Adiciona o traço depois do 9º dígito
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    // Atualiza o valor do campo com a máscara
    input.value = valor;
}

// Deixa o celular no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
function mascaraCelular(input) {
    // Obtém o valor atual e remove tudo que não for dígito
    let valor = input.value.replace(/\D/g, '');

    // Limita o valor a 11 dígitos (DDD + 9 dígitos)
    valor = valor.substring(0, 11);

    // Aplica a máscara de forma progressiva
    // Adiciona os parênteses no DDD
    valor = valor.replace(/^(\d{2})(\d)/, '($1) $2');
    // Adiciona o hífen. A Regex lida tanto com 8 quanto 9 dígitos no número.
    valor = valor.replace(/(\d{4,5})(\d{4})$/, '$1-$2');

    // Atualiza o valor do campo com a máscara
    input.value = valor;
}

//Stack overflow <3
function baixarTxt(conteudo, nomeArquivo) {
    // 1. Crie um Blob com o conteúdo do ficheiro
    const blob = new Blob([conteudo], { type: 'text/plain' });

    // 2. Crie uma URL para o Blob
    const url = URL.createObjectURL(blob);

    // 3. Crie o elemento âncora dinamicamente
    const linkDownload = document.createElement('a');

    // 4. Configure o âncora
    linkDownload.href = url;
    linkDownload.download = nomeArquivo; // Define o nome do ficheiro

    // 5. Adicione a âncora ao corpo (necessário para alguns navegadores)
    document.body.appendChild(linkDownload);

    // 6. Simule um clique para iniciar o download
    linkDownload.click();

    // 7. Limpe os recursos, removendo o âncora e revogando o URL
    document.body.removeChild(linkDownload);
    URL.revokeObjectURL(url);
}

function gerarJson() {
    const form = document.getElementById('formCadastroModal');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const jsonData = JSON.stringify(data, null, 2);

    // Exibe o JSON no console do navegador
    console.log("JSON Gerado:");
    console.log(jsonData);

    baixarTxt(jsonData, 'cadastro.json');
}