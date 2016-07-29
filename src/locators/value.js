import findByCss from './css';

/*
 Searching the dom by xpath or css for value only gets the default. Inputs dynamically set don't update the dom which
 xpath and css won't find. The method is used to get search those dynamic values as well.
 */
export default function ({label, container, config}, resultHandler = (err, result) => result) {
    try {
        let results = container.querySelectorAll("button,input,option,param");

        return browserExecute(function (elements, l, handler) {
            return handler(null, elements.filter(function (input) {
                return input.value && input.value.toLowerCase().indexOf(l.toLowerCase()) != -1;
            }));
        }, Array.prototype.slice.apply(results), label, resultHandler);
    }
    catch(error) {
        return resultHandler(error, []);
    }
}
