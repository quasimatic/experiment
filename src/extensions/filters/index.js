import {reduce} from "../../utils/array-utils"
import log from "../../log"
import defaultResultHandler from "../../utils/default-result-handler"

export default {
    filter: {
        useDefaultFiltersIfFirst: true,
        apply: function ({elements, target}, resultHandler = defaultResultHandler) {
            log.debug("Filtering by index");

            let attributes = target.options.filter(p => p != null && !isNaN(p));

            if (attributes.length > 0) {
                return reduce(attributes, [], (result, attribute, callback) => {
                    let position = attribute;
                    log.debug("Selecting the", position, "element out of", elements.length);

                    if (position <= 0) {
                        return callback("Positions start at 1", []);
                    }

                    if (elements.length < position) {
                        return callback(`Position ${position} out of range`, []);
                    }

                    let i = position - 1;
                    return callback(null, result.concat(elements[i]));
                }, resultHandler);
            }

            return resultHandler(null, elements);
        }
    }
}