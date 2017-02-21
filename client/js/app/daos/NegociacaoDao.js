
class NegociacaoDao {

    constructor(connection) {

        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao) {

        return new Promise((resolve, reject) => {

            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .add(negociacao);

            request.onsuccess = e => {

                resolve('Negociação adicionada com sucesso!');
            };

            request.onerror = e => {

                console.log(e.target.error);
                reject('Não foi possivel adicionar a negociação!');
            };
        });
    }

    obterTodos() {

        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .openCursor();

            let negociacoes = [];

            cursor.onsuccess = e => {

                let negociacaoAtual = e.target.result;

                if (negociacaoAtual) {

                    let objeto = negociacaoAtual.value;

                    negociacoes.push(new Negociacao(objeto._data, objeto._quantidade, objeto._valor));

                    negociacaoAtual.continue();
                }
                else {

                    resolve(negociacoes);
                }
            };

            cursor.onerror = e => {

                console.log(e.target.error);
                reject('Não foi possivel obter as negociações!');
            };
        });
    }

    apagarTodos() {

        return new Promise((resolve, reject) => { 
            
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store)
                .clear();

            request.onsuccess = e => {

                resolve('Negociações apagadas com sucesso!');
            };

            request.onerror = e => {

                console.log(e.target.error);
                reject('Não foi possivel apagar as negociações!');
            };
        });
    }
}