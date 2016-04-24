export default function nextToScope(elements, scope) {
    let siblings = elements.filter(function(e) {
        return scope && scope.nextElementSibling == e;
    });

    return siblings.length == 0 ? elements : siblings;
}
