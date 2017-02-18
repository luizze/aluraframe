
class ProxyFactory {

    static create(objeto, props, acao) {

        return new Proxy(objeto, {

            get(target, prop, receiver) {

                if (props.includes(prop) && ProxyFactory._eFuncao(target[prop])) {

                    return function () {

                        console.log(`Iterceptando: ${prop}`);
                        Reflect.apply(target[prop], target, arguments);
                        acao(target);
                    }
                }

                return Reflect.get(target, prop, receiver);
            },

            set(target, prop, value, receiver) {

                if (props.includes(prop)) {

                    target[prop] = value;
                    acao(target);
                }

                return Reflect.set(target, prop, value, receiver);
            }
        });
    }

    static _eFuncao(func) {

        return typeof (func) == typeof (Function);
    }
}