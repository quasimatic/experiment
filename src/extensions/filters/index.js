import {reduce} from "../../utils/array-utils"
import log from "../../log"

export default {
    filter: {
        useDefaultFiltersIfFirst: true,
        apply: function ({elements, target}, resultHandler = (err, result) => result) {
            log.debug("Filtering by index");

            let attributes = target.options.filter(p => !isNaN(p));

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
}