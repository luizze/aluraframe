
class NegociacaoController {

    constructor() {

        let $ = document.querySelector.bind(document);
        this._inputData = $('#data');
        this._inputQuantidade = $('#quantidade');
        this._inputValor = $('#valor');

        this._ordemAtual = '';

        this._negociacaoService = new NegociacaoService();

        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia', 'ordena', 'inverteOrdem'
        );

        this._mensagem = new Bind(
            new Mensagem(),
            new MensagemView($('#mensagemView')),
            'texto'
        );

        ConnectionFactory
            .getConnection()
            .then(c => new NegociacaoDao(c))
            .then(dao => dao.obterTodos())
            .then(negociacoes => negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao)))
            .catch(error => this._mensagem.texto = error);
    }

    adiciona(event) {

        event.preventDefault();

        ConnectionFactory
            .getConnection()
            .then(c => {

                let negociacao = this._criaNegociacao();

                new NegociacaoDao(c)
                    .adiciona(negociacao)
                    .then(e => {

                        this._listaNegociacoes.adiciona(negociacao);
                        this._mensagem.texto = e;
                        this._limpaFormulario();
                    })
                    .catch(e => this._mensagem = e);
            })
            .catch(e => this._mensagem = e);;
    }

    importaNegociacoes() {

        this._negociacaoService.obterTodasAsNegociacoes()
            .then(negociacoes => {

                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações importadas com sucesso!';
            })
            .catch(erro => this._mensagem.texto = erro);
    }

    apaga() {
        ConnectionFactory
            .getConnection()
            .then(c => new NegociacaoDao(c))
            .then(dao => dao.apagarTodos())
            .then(mensagem => {

                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(error => this._mensagem.texto = error);
    }

    _criaNegociacao() {

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value),
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        );
    }

    ordena(coluna) {

        if (this._ordemAtual == coluna) {

            this._listaNegociacoes.inverteOrdem();
        } else {

            this._listaNegociacoes.ordena((a, b) => a[coluna] - b[coluna]);
        }

        this._ordemAtual = coluna;
    }

    _limpaFormulario() {

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value = 0.0;
        this._inputData.focus();
    }
}