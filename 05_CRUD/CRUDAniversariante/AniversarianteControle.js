let listaAniversariante = []; //conjunto de dados
let oQueEstaFazendo = ''; //variável global de controle
let aniversariante = null; //variavel global 
bloquearAtributos(true);
//backend (não interage com o html)
function procurePorChavePrimaria(chave) {
    for (let i = 0; i < listaAniversariante.length; i++) {
        const aniversariante = listaAniversariante[i];
        if (aniversariante.cpf == chave) {
            aniversariante.posicaoNaLista = i;
            return listaAniversariante[i];
        }
    }
    return null;//não achou
}

// Função para procurar um elemento pela chave primária   -------------------------------------------------------------
function procure() {
    const cpf = document.getElementById("inputCpf").value;
    if (cpf) { // se digitou um Cpf
        aniversariante = procurePorChavePrimaria(cpf);
        if (aniversariante) { //achou na lista
            mostrarDadosAniversariante(aniversariante);
            visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none'); // Habilita botões de alterar e excluir
            mostrarAviso("Achou na lista, pode alterar ou excluir");
        } else { //não achou na lista
            limparAtributos();
            visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
            mostrarAviso("Não achou na lista, pode inserir");
        }
    } else {
        document.getElementById("inputCpf").focus();
        return;
    }
}

//backend->frontend
function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos e clic o botão salvar");
    document.getElementById("inputCpf").focus();

}

// Função para alterar um elemento da lista
function alterar() {

    // Remove o readonly dos campos
    bloquearAtributos(false);

    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');

    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos e clic o botão salvar");
}

// Função para excluir um elemento da lista
function excluir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); //visibilidadeDosBotoes(procure,inserir,alterar,excluir,salvar)

    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - clic o botão salvar para confirmar a exclusão");
}

function salvar() {
    //gerencia operações inserir, alterar e excluir na lista

// obter os dados a partir do html

    let cpf;
    if (aniversariante == null) {
         cpf = document.getElementById("inputCpf").value;
    } else {
        cpf = aniversariante.cpf;
    }

    const nome = document.getElementById("inputNome").value;
    const dataNasc = document.getElementById("inputDataNasc").value;
    //verificar se o que foi digitado pelo USUÁRIO está correto
if(cpf && nome && dataNasc ){// se tudo certo 
        switch (oQueEstaFazendo) {
            case 'inserindo':
                aniversariante = new Aniversariante(cpf,nome,dataNasc);
                listaAniversariante.push(aniversariante);
                mostrarAviso("Inserido na lista");
                break;
            case 'alterando':
                aniversarianteAlterado = new Aniversariante(cpf,nome,dataNasc);
                listaAniversariante[aniversariante.posicaoNaLista] = aniversarianteAlterado;
                mostrarAviso("Alterado");
                break;
            case 'excluindo':
                let novaLista = [];
                for (let i = 0; i < listaAniversariante.length; i++) {
                    if (aniversariante.posicaoNaLista != i) {
                        novaLista.push(listaAniversariante[i]);
                    }
                }
                listaAniversariante = novaLista;
                mostrarAviso("EXCLUIDO");
                break;
            default:
                // console.error('Ação não reconhecida: ' + oQueEstaFazendo);
                mostrarAviso("Erro aleatório");
        }
        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        listar();
        document.getElementById("inputCpf").focus();
    } else {
        alert("Erro nos dados digitados");
        return;
    }
}

//backend
function preparaListagem(vetor) {
    let texto = "";
    for (let i = 0; i < vetor.length; i++) {
        const linha = vetor[i];
        texto += 
            linha.cpf+" - " +
            linha.nome+" - " +
            linha.dataNasc+"<br>";
    }
    return texto;
}

//backend->frontend (interage com html)
function listar() {
    document.getElementById("outputSaida").innerHTML = preparaListagem(listaAniversariante);
}

function cancelarOperacao() {
    limparAtributos();
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação de edição");
}

function mostrarAviso(mensagem) {
    //printa a mensagem na divAviso
    document.getElementById("divAviso").innerHTML = mensagem;
}

// Função para mostrar os dados do Aniversariante nos campos
function mostrarDadosAniversariante(aniversariante) {
    document.getElementById("inputCpf").value = aniversariante.cpf;
    document.getElementById("inputNome").value = aniversariante.nome;
    document.getElementById("inputDataNasc").value = aniversariante.dataNasc;

    // Define os campos como readonly
    bloquearAtributos(true);
}

// Função para limpar os dados dos campos
function limparAtributos() {
    document.getElementById("inputNome").value = "";
    document.getElementById("inputDataNasc").value = "";

    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    //quando a chave primaria possibilita edicao, tranca (readonly) os outros e vice-versa
    document.getElementById("inputCpf").readOnly = !soLeitura;
    document.getElementById("inputNome").readOnly = soLeitura;
    document.getElementById("inputDataNasc").readOnly = soLeitura;
}

// Função para deixar visível ou invisível os botões
function visibilidadeDosBotoes(btProcure, btInserir, btAlterar, btExcluir, btSalvar) {
    //  visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline'); 
    //none significa que o botão ficará invisível (visibilidade == none)
    //inline significa que o botão ficará visível 

    document.getElementById("btProcure").style.display = btProcure;
    document.getElementById("btInserir").style.display = btInserir;
    document.getElementById("btAlterar").style.display = btAlterar;
    document.getElementById("btExcluir").style.display = btExcluir;
    document.getElementById("btSalvar").style.display = btSalvar;
    document.getElementById("btCancelar").style.display = btSalvar; // o cancelar sempre aparece junto com o salvar
    document.getElementById("inputCpf").focus();
}

