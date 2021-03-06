class DataBase {

    static getNextID() {

        let nextID = localStorage.getItem('id');

        if (nextID === null) {
            localStorage.setItem('id', '0');
            nextID = 0;
        } else {
            nextID = parseInt(nextID) + 1;
        }
        return nextID;
    }

    static save(despesa) {
        let nextID = DataBase.getNextID()
        localStorage.setItem(nextID, JSON.stringify(despesa));
        localStorage.setItem('id', String(nextID));
    }

    static loadAllExpenses() {

        /** Array de despesas */
        let despesas = [];
        let totalItens = localStorage.getItem("id");

        /** Recupera todas as despesas */
        for(let i=0; i<=totalItens;i++){
            let despesa = JSON.parse(localStorage.getItem(String(i)));
            if(despesa != null){
                despesa.id = i
                despesas.push(despesa)
            }
        }

        return despesas
    }

    static searchExpense(params) {
        let despesas = this.loadAllExpenses();

        if (params.dia !== ""){
            despesas = despesas.filter(d => params.dia === d.dia);
        }
        if (params.mes !== ""){
            despesas = despesas.filter(d => params.mes === d.mes);
        }
        if (params.ano !== ""){
            despesas = despesas.filter(d => params.ano === d.ano);
        }
        if (params.tipo !== "" && params.tipo !== "Tipo"){
            despesas = despesas.filter(d => params.tipo === d.tipo);
        }
        if (params.descricao !== ""){
            despesas = despesas.filter(d => params.descricao === d.descricao);
        }
        if (params.valor !== ""){
            despesas = despesas.filter(d => params.valor === d.valor);
        }
        return despesas
    }

    static removeExpense(id) {localStorage.removeItem(id);}
}

class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano;
        this.mes = mes;
        this.dia = dia;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;

    }

    validate() {

        for (let attr in this) {
            let valor = this[attr];
            if (valor === undefined || valor === "") {
                return false;
            }
        }
        return true;
    }
}


function cadastrarDespesa() {

    /** Obt??m refer??ncias aos elementos html */
    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    /** Instancia despesa */
    let despesa = new Despesa(ano.value, mes.value, dia.value,
        tipo.value, descricao.value, valor.value);

    /** Valida despesa */
    if (despesa.validate()) {

        /** sava a Despesa instanciada */
        DataBase.save(despesa);

        document.getElementById("modal_titulo").innerHTML = "Registro inserido com sucesso";
        document.getElementById("modal_titulo_div").className = "modal-header text-success";
        document.getElementById("modal_conteudo").innerHTML = "Despesa foi cadastrada com sucesso";

        let button = document.getElementById("modal_btn");

        button.innerHTML = "Voltar";
        button.className = "btn btn-success";

        $('#modalRegistraDespesa').modal('show');

        ano.value = '';
        mes.value = '';
        dia.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
        
    } else {

        let msg = "Erro na grava????o! Verifique se todos os campos foram preenchidos corretamentos"
        document.getElementById("modal_titulo").innerHTML = "Erro na inclus??o do registro";
        document.getElementById("modal_titulo_div").className = "modal-header text-danger";
        document.getElementById("modal_conteudo").innerHTML = msg;

        let button = document.getElementById("modal_btn");

        button.innerHTML = "Voltar e Corrigr";
        button.className = "btn btn-danger";

        $('#modalRegistraDespesa').modal('show');
        
    }
}

function loadExpensesList(despesas) {

    if (despesas === undefined){
        despesas = DataBase.loadAllExpenses();
    }

    /** Seleciona o elemento tbody da tabela de despesas */
    let tabelaDespesas = document.getElementById("listaDespesa");

    /** Percorre o array e lista as tabelas de forma din??mica */
    despesas.forEach(d => {

        /** Cria linha <tr> na tabela */
        let linha = tabelaDespesas.insertRow();

        /** Cria colunas <td> na linha */
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`; // Data

        switch (d.tipo) {
            case '1': d.tipo = 'Alimenta????o'
                break
            case '2': d.tipo = 'Educa????o'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Sa??de'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo; // Tipo
        linha.insertCell(2).innerHTML = d.descricao; // Descri????o
        linha.insertCell(3).innerHTML = d.valor; // Valor

        /** Cria bot??o que permite excluir uma despesa */
        let btn = document.createElement("button");
        btn.className = "btn btn-danger";
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_despesa_${d.id}`;
        btn.onclick = function() {
            DataBase.removeExpense(this.id.replace("id_despesa_", ""));
            window.location.reload();
        };
        linha.insertCell(4).append(btn);
    });
}

function findExpense() {

    /** Obt??m refer??ncias aos elementos html */
    let ano = document.getElementById('ano').value;
    let mes = document.getElementById('mes').value;
    let dia = document.getElementById('dia').value;
    let tipo = document.getElementById('tipo').value;
    let descricao = document.getElementById('descricao').value;
    let valor = document.getElementById('valor').value;

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
    document.getElementById("listaDespesa").innerHTML = '';
    loadExpensesList(DataBase.searchExpense(despesa));
}
