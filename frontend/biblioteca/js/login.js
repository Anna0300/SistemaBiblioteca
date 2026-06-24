// =============================================
// SISTEMA DE AUTENTICAÇÃO - BIBLIOTECA
// =============================================

// ===== BANCO DE DADOS DE USUÁRIOS =====
let usuarios = [
    {usuario: "Fátima", senha: "123", matricula: "ADM001", tipo: "administrador", turma: "Administração"},
    {usuario: "Zirlândio", senha: "123", matricula: "ADM002", tipo: "administrador", turma: "Administração"}
];

function carregarUsuarios() {
    const usuariosSalvos = localStorage.getItem('usuarios');
    if (usuariosSalvos) {
        const cadastrados = JSON.parse(usuariosSalvos);
        usuarios = [
            {usuario: "admin", senha: "admin123", matricula: "ADM001", tipo: "administrador", turma: "Administração"},
            ...cadastrados.filter(u => u.usuario !== "admin")
        ];
    }
}

function salvarUsuarios() {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    console.log("Usuários salvos:", usuarios.length);
}

function entrar() {
    event.preventDefault();

    let usuario = document.getElementById("usuario").value.trim();
    let senha = document.getElementById("senha").value;

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

    if (typeof usuarios === 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Erro Crítico',
            text: 'Sistema indisponível. Contate o suporte.',
            confirmButtonColor: '#1e3a8a'
        });
        return;
    }

    Swal.fire({
        title: 'Verificando acesso...',
        text: 'Por favor, aguarde',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    setTimeout(() => {
        const usuarioEncontrado = usuarios.find(u =>
            u.usuario === usuario && u.senha === senha
        );

        if (usuarioEncontrado) {
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioEncontrado));

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

            Swal.close();

            if (!usuarioExiste) {
                // Removido o botão "Criar conta" — não há tela de cadastro neste projeto
                Swal.fire({
                    icon: 'error',
                    title: '🔍 Usuário não encontrado',
                    html: `O usuário "<strong>${usuario}</strong>" não está cadastrado.`,
                    confirmButtonColor: '#1e3a8a',
                    confirmButtonText: 'Tentar novamente'
                }).then(() => {
                    document.getElementById("usuario").focus();
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '🔒 Senha incorreta',
                    text: 'A senha digitada está errada. Tente novamente!',
                    confirmButtonColor: '#1e3a8a',
                    confirmButtonText: 'Tentar novamente'
                }).then(() => {
                    document.getElementById("senha").value = "";
                    document.getElementById("senha").focus();
                });
            }
        }
    }, 800);
}

function sair() {
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "index.html";
}

function verificarLogin() {
    const usuarioSalvo = sessionStorage.getItem('usuarioLogado');

    if (!usuarioSalvo) {
        window.location.href = "index.html";
        return null;
    }

    return JSON.parse(usuarioSalvo);
}

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
carregarUsuarios();
