import {reduce} from "../utils/array-utils"

export default {
    filter: function ({elements, target, log = { debug: () => {}}}, resultHandler = (err, result) => result) {
        let attributes = target.properties.filter(p => !isNaN(p));

        if (attributes.length > 0) {
            return reduce(attributes, [], (result, attribute, callback) => {
                let position = attribute;
                log.debug("Selecting the", position, "element out of", elements.length);

                if (position == null) {
                    return callback(null, result.concat(elements));
                }

                if (position <= 0) {
                    console.log("Positions start at 1")
                    return callback("Positions start at 1", result.concat([]));
                }

                if (elements.length < position) {
                    console.log(`Position ${position} out of range`);
                    return callback(`Position ${position} out of range`, result.concat([]));
                }

                let i = position - 1;
                return callback(null, result.concat(elements[i]));
            }, resultHandler);
        }

        return resultHandler(null, elements);
    }
}