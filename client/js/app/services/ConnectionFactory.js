var ConnectionFactory = (function () {

    var stores = ['negociacoes'];
    var dbName = 'aluraframe';
    var version = 1;

    var connection = null;

    return class ConnectionFactory {

        constructor() {

            throw new Error('Não é possivel obter uma instancia de ConnectionFactory.');
        }

        static getConnection() {

            return new Promise((resolve, reject) => {

                let openRequest = window.indexedDB.open(dbName, version);

                openRequest.onupgradeneeded = e => {

                    if (!connection) {

                        connection = e.target.result;
                    }

                    ConnectionFactory._createStores();
                };

                openRequest.onsuccess = e => {

                    resolve(e.target.result);
                };

                openRequest.onerror = e => {

                    console.log(e.target.error);
                    reject(e.target.error.name);
                };
            });
        }

        static _createStores() {

            stores.forEach(store => {

                if (connection.objectStoreNames.contains(store)) {

                    connection.deleteObjectStore(store);
                }

                connection.createObjectStore(store, { autoIncrement: true })
            });
        }
    }
})();