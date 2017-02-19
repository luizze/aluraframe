
class NegociacaoService {

    constructor() {

        this._httpService = new HttpService();
    }

    obterTodasAsNegociacoes() {

        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ])
            .then(arraysDeNegociacoes => arraysDeNegociacoes.reduce((negociacoes, arrayDeNegociacoes) => negociacoes.concat(arrayDeNegociacoes)))
            .catch(erro => { throw new Error(erro) });
    }

    obterNegociacoesDaSemana() {

        return this._httpService.get('negociacoes/semana')
            .then(negociacoes => negociacoes
                .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)))
            .catch(erro => {

                console.log(erro);
                throw new Error("Ocorreu um erro interno no servidor ao tentar obter as negociações da semana!\n");
            });
    }

    obterNegociacoesDaSemanaAnterior() {

        return this._httpService.get('negociacoes/anterior')
            .then(negociacoes => negociacoes
                .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)))
            .catch(erro => {

                console.log(erro);
                throw new Error("Ocorreu um erro interno no servidor ao tentar obter as negociações da semana anterior!\n");
            });
    }

    obterNegociacoesDaSemanaRetrasada() {

        return this._httpService.get('negociacoes/retrasada')
            .then(negociacoes => negociacoes
                .map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)))
            .catch(erro => {

                console.log(erro);
                throw new Error("Ocorreu um erro interno no servidor ao tentar obter as negociações da semana retrasada!\n");
            });
    }
}