import findByCss from '../../src/find-strategies/css';

/*
    Searching the dom by xpath or css for value only gets the default. Inputs dynamically set don't update the dom which
    xpath and css won't find. The meathod is used to get search those dynamic values as well.
 */
export default function (label, container) {
    return findByCss("button,input,option,param", container).filter(function(input){
        return input.value && input.value.toLowerCase().indexOf(label.toLowerCase()) != -1;
    })
}
