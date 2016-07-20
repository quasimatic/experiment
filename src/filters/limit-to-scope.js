export default function limitToScope(elements, scope, resultHandler) {
    let elementContainsContainer = false;
    let parentsContainingReference = [];

    for (let e = 0; e < elements.length; ++e) {
        var isDescendant = false;

        let node = scope.parentNode;
        while (node != null) {
            if (node == elements[e]) {
                isDescendant = true;
            }
            node = node.parentNode;
        }

        if (isDescendant) {
            elementContainsContainer = true;
            parentsContainingReference.push(elements[e]);
        }
    }

    if (elementContainsContainer)
        return resultHandler(null, parentsContainingReference);

    return resultHandler(null, elements);
}