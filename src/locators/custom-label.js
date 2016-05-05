import Extensions from "../utils/extensions"

import isDescendant from '../utils/is-descendant';

export default function(label, scope, config) {
    let customLabel = Extensions.locatorForLabel(label, config.extensions);

    let elements = customLabel.reduce((e, c) => {
        if(e.length > 0) return e;

        if(c.locate) {
            return [].concat(c.locate(label, scope, config));
        }

        return [];
    }, [])
    
    let r = [];

    try {
        elements.forEach(function(e) {
            if (isDescendant(scope, e)) {
                r.push(e)
            }
        });

        return r;
    }
    catch (e) {
        return [];
    }
}