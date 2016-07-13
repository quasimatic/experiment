import isDescendant from '../utils/is-descendant';

export default function limitToScope(elements, scope, resultHandler) {
    let elementContainsContainer = false;
    let parentsContainingReference = [];
    for (let e = 0; e < elements.length; ++e) {
        if (isDescendant(elements[e], scope)) {
            elementContainsContainer = true;
            parentsContainingReference.push(elements[e]);
        }
    }

    if (elementContainsContainer)
        return resultHandler(null, parentsContainingReference);

    return resultHandler(null, elements);
}