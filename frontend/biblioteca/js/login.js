// =============================================
// SISTEMA DE AUTENTICAÇÃO - BIBLIOTECA
// =============================================

// ===== BANCO DE DADOS DE USUÁRIOS =====
// Carrega usuários do localStorage 
let usuarios = [
    // ADMIN MANUAL
    {usuario: "Fátima", senha: "123", matricula: "ADM001", tipo: "administrador", turma: "Administração"},
    {usuario: "Zirlândio", senha: "123", matricula: "ADM002", tipo: "administrador", turma: "Administração"}
];

// =============================================
// FUNÇÃO: carregarUsuarios()
// Descrição: Carrega usuários salvos no localStorage
// Chamada por: Inicialização
// =============================================
function carregarUsuarios() {
    const usuariosSalvos = localStorage.getItem('usuarios');
    if (usuariosSalvos) {
        const cadastrados = JSON.parse(usuariosSalvos);
        // Manter admin + cadastrados 
        usuarios = [
            {usuario: "admin", senha: "admin123", matricula: "ADM001", tipo: "administrador", turma: "Administração"},
            ...cadastrados.filter(u => u.usuario !== "admin")
        ];
    }
}



// =============================================
// FUNÇÃO: salvarUsuarios()
// Descrição: Salva usuários no localStorage
// Chamada por: Qualquer modificação no array
// =============================================
function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log("Usuários salvos:", usuarios.length);
}

// =============================================
// FUNÇÃO: entrar()
// Descrição: Valida credenciais e realiza login
// Chamada por: Botão "Entrar" no index.html
// =============================================

function entrar() {
    event.preventDefault();
    
    let usuario = document.getElementById("usuario").value.trim();
    let senha = document.getElementById("senha").value;

    // Campos vazios
    if (!usuario || !senha) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos Incompletos',
            text: 'Preencha seu usuário e senha para continuar.',
            confirmButtonColor: '#1e3a8a',
            confirmButtonText: 'Entendi',
            background: '#fff',
            iconColor: '#ff9800'
        });
        return;
    }

    // Verificar base de dados
    if (typeof usuarios === 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Erro Crítico',
            text: 'Sistema indisponível. Contate o suporte.',
            confirmButtonColor: '#1e3a8a'
        });
        return;
    }

    // Mostrar loading enquanto verifica
    Swal.fire({
        title: 'Verificando acesso...',
        text: 'Por favor, aguarde',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    // Simular pequeno delay para processamento
    setTimeout(() => {
        const usuarioEncontrado = usuarios.find(u => 
            u.usuario === usuario && u.senha === senha
        );

        if (usuarioEncontrado) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));
            
            // Fechar loading e mostrar sucesso
            Swal.fire({
                icon: 'success',
                title: '✅ Login realizado!',
                text: `Bem-vindo(a), ${usuarioEncontrado.nome || usuario}!`,
                showConfirmButton: false,
                timer: 1800,
                background: '#fff',
                iconColor: '#4caf50'
            }).then(() => {
                window.location.href = "../sistema.html";
            });
        } else {
            const usuarioExiste = usuarios.find(u => u.usuario === usuario);
            
            Swal.close(); // Fechar loading
            
            if (!usuarioExiste) {
                Swal.fire({
                    icon: 'error',
                    title: '🔍 Usuário não encontrado',
                    html: `O usuário "<strong>${usuario}</strong>" não está cadastrado.<br><br>Deseja criar uma conta?`,
                    confirmButtonColor: '#1e3a8a',
                    confirmButtonText: 'Tentar novamente',
                    showCancelButton: true,
                   
                    cancelButtonColor: '#4caf50',
                    reverseButtons: true
                }).then((result) => {
                    if (result.dismiss === 'cancel') {
                        irParaCadastro();
                    } else {
                        document.getElementById("usuario").focus();
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '🔒 Senha incorreta',
                    text: 'A senha digitada está errada. Tente novamente!',
                    confirmButtonColor: '#1e3a8a',
                    confirmButtonText: 'Tentar novamente',
                    footer: '<a href="#" onclick="recuperarSenha()">Esqueceu a senha?</a>'
                }).then(() => {
                    document.getElementById("senha").value = "";
                    document.getElementById("senha").focus();
                });
            }
        }
    }, 800); // Delay de 800ms para o loading
}
// =============================================
// FUNÇÃO: sair()
// Descrição: Encerra a sessão do usuário
// Chamada por: Botão "Sair" no sistema.html
// =============================================
function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "index.html";
}

// =============================================
// FUNÇÃO: verificarLogin()
// Descrição: Verifica se há um usuário logado
// Retorno: Objeto do usuário ou redireciona para login
// Chamada por: Todas as páginas protegidas
// =============================================
function verificarLogin() {
    const usuarioSalvo = sessionStorage.getItem('usuarioLogado');
    
    if (!usuarioSalvo) {
        window.location.href = "index.html";
        return null;
    }
    
    return JSON.parse(usuarioSalvo);
}

// =============================================
// FUNÇÃO: mostrarLogin()
// Descrição: Mostra o formulário de login na página inicial
// Chamada por: Card de Login no index.html
// =============================================
function mostrarLogin() {
    document.getElementById('loginContainer').classList.remove('hidden');
}

// =============================================
// FUNÇÃO: voltarInicio()
// Descrição: Volta para a tela inicial escondendo o login
// Chamada por: Botão "Voltar" no formulário de login
// =============================================
function voltarInicio() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('erro').innerText = '';
}

// =============================================
// FUNÇÃO: irParaCadastro()
// Descrição: Navega para a página de cadastro
// =============================================
function irParaCadastro() {
    window.location.href = 'cadastro.html';
}

// =============================================
// FUNÇÃO: voltarParaIndex()
// Descrição: Volta para a página inicial
// =============================================
function voltarParaIndex() {
    window.location.href = 'index.html';
}

// =============================================
// FUNÇÃO: mostrarTurmas()
// Descrição: Mostra o campo de turma quando um ano é selecionado
// Chamada por: Select de ano na página de cadastro
// =============================================
function mostrarTurmas() {
    const ano = document.getElementById('anoUsuario').value;
    const campoTurma = document.getElementById('campoTurma');
    
    if (ano) {
        campoTurma.classList.remove('hidden');
    } else {
        campoTurma.classList.add('hidden');
    }
}

// =============================================
// FUNÇÃO: cadastrarNovoUsuario()
// Descrição: Cadastra um novo usuário no sistema
// Chamada por: Botão "Criar Conta" no cadastro.html
// =============================================
function cadastrarNovoUsuario() {
    // ----- CAPTURAR VALORES DOS CAMPOS -----
    const usuario = document.getElementById('novoUsuario').value;
    const senha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const matricula = document.getElementById('novaMatricula').value;
    const ano = document.getElementById('anoUsuario').value;
    const turma = document.getElementById('turmaUsuario').value;
    
    const mensagemDiv = document.getElementById('mensagemCadastro');
    
    // ----- VALIDAÇÕES -----
    
    // 1. Campos obrigatórios
    if (!usuario || !senha || !confirmarSenha || !matricula || !ano || !turma) {
        mensagemDiv.innerHTML = '<span style="color:red">❌ Preencha todos os campos!</span>';
        return;
    }
    
    // 2. Tamanho da senha
    if (senha.length < 6) {
        mensagemDiv.innerHTML = '<span style="color:red">❌ A senha deve ter no mínimo 6 caracteres!</span>';
        return;
    }
    
    // 3. Confirmação de senha
    if (senha !== confirmarSenha) {
        mensagemDiv.innerHTML = '<span style="color:red">❌ As senhas não conferem!</span>';
        return;
    }
    
    // 4. Verificar se matrícula já existe
    const matriculaExistente = usuarios.find(u => u.matricula === matricula);
    if (matriculaExistente) {
        mensagemDiv.innerHTML = '<span style="color:red">❌ Esta matrícula já está cadastrada!</span>';
        return;
    }
    
    // 5. Verificar se usuário já existe
    const usuarioExistente = usuarios.find(u => u.usuario === usuario);
    if (usuarioExistente) {
        mensagemDiv.innerHTML = '<span style="color:red">❌ Este nome de usuário já existe!</span>';
        return;
    }
    
    // ----- CADASTRO BEM-SUCEDIDO -----
    
    // Criar objeto do novo usuário
    const novoUsuario = {
        usuario: usuario,
        senha: senha,
        matricula: matricula,
        tipo: 'aluno',
        turma: `${ano} ${turma}`
    };
    
    // Adicionar ao array de usuários
    usuarios.push(novoUsuario);
    
    // SALVAR NO LOCALSTORAGE
    salvarUsuarios();
    
    // Mostrar mensagem de sucesso
    mensagemDiv.innerHTML = '<span style="color:green">✅ Usuário cadastrado com sucesso! Redirecionando...</span>';
    
    // Limpar campos do formulário
    document.getElementById('novoUsuario').value = '';
    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';
    document.getElementById('novaMatricula').value = '';
    document.getElementById('anoUsuario').value = '';
    document.getElementById('turmaUsuario').value = '';
    document.getElementById('campoTurma').classList.add('hidden');
    
    // Mostrar os usuários cadastrados no console
    console.log("Usuários cadastrados:", usuarios);
    
    // Redirecionar para a página de login após 2 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// =============================================
// FUNÇÃO: listarUsuarios()
// Descrição: Mostra todos os usuários cadastrados (para debug)
// =============================================
function listarUsuarios() {
    console.log("=== USUÁRIOS CADASTRADOS ===");
    usuarios.forEach((u, index) => {
        console.log(`${index + 1}. ${u.usuario} - ${u.turma} (${u.matricula})`);
    });
    console.log("Total:", usuarios.length);
}

// =============================================
// FUNÇÕES AUXILIARES
// =============================================

function getTipoUsuario() {
    const usuario = verificarLogin();
    return usuario ? usuario.tipo : null;
}

function getTurmaUsuario() {
    const usuario = verificarLogin();
    return usuario ? usuario.turma : null;
}

function getMatriculaUsuario() {
    const usuario = verificarLogin();
    return usuario ? usuario.matricula : null;
}

function isAdmin() {
    const usuario = verificarLogin();
    return usuario ? usuario.tipo === 'administrador' : false;
}

// =============================================
// INICIALIZAÇÃO
// =============================================
// Carregar usuários quando a página iniciar
carregarUsuarios();

// Mostrar usuários carregados no console
setTimeout(() => {
    listarUsuarios();
}, 500);

/*
    ===== SISTEMA DE PERSISTÊNCIA =====
    
    localStorage:
    - Os dados ficam salvos mesmo fechando o navegador
    - Para limpar: localStorage.removeItem('usuarios')
    
    Fluxo:
    1. Ao carregar a página: carrega usuários do localStorage
    2. Ao cadastrar: adiciona ao array e salva no localStorage
    3. Ao fazer login: busca no array (que veio do localStorage)
    
    Os dados persistem entre recarregamentos!

    ===== RESUMO DO SISTEMA =====
    
    CADASTRO:
    - Pede: usuário, senha, matrícula, ano, turma
    - Matrícula é usada para controle interno
    
    LOGIN:
    - Pede: usuário, senha
   
    
    A matrícula fica guardada no cadastro mas não é necessária no login
*/