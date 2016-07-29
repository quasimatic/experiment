import Modifiers from "../utils/modifiers"

import isDescendant from '../utils/is-descendant';

export default function ({label, container, config}, resultHandler = (err, result) => result) {
    let elements = [];
    
    if (elements.length == 0) {
        let customLabel = Modifiers.locatorForLabel(label, config.extensions || []);

        elements = customLabel.reduce((e, c) => {
            if (e.length > 0) return e;

            let locate = typeof(c) == "function" ? c : c.locate;

            if (locate) {
                return [].concat(c.locate({label, container, config}, function (err, result) {
                    return result;
                }));
            }

            return [];
        }, [])
    }

    let r = [];

    try {
        elements.forEach(function(e) {
            if (isDescendant(container, e)) {
                r.push(e)
            }
        });

        return resultHandler(null, r);
    }
    catch (e) {
        return resultHandler(null, []);
    }
}