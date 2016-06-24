import findByCss from './css';

/*
 Searching the dom by xpath or css for value only gets the default. Inputs dynamically set don't update the dom which
 xpath and css won't find. The method is used to get search those dynamic values as well.
 */
export default function (label, container, config, resultHandler = result => result) {
    return customExecute(findByCss, "button,input,option,param", container, function (result) {
        return resultHandler(result.filter(function (input) {
            return input.value && input.value.toLowerCase().indexOf(label.toLowerCase()) != -1;
        }));
    });
}
