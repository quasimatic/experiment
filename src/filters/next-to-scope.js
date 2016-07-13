export default function nextToScope(elements, scope, resultHandler) {
    let siblings = elements.filter(function(e) {
        return scope && scope.nextElementSibling == e;
    });

    return resultHandler(null, siblings.length == 0 ? elements : siblings);
}
