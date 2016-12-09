import findByXPath from "../lib/xpath"
import {reduce} from "../../utils/array-utils"
import log from "../../log"

export default {
    locator : {
        check: function({label, target}) {
            let attributes = target.options.filter(p => isNaN(p) && p.indexOf("attribute-") > -1);
            return attributes.length > 0;
        },
        locate: function ({label, target, scopeElement}, resultHandler = (err, result) => result) {
            let attributes = target.options.filter(p => isNaN(p) && p.indexOf("attribute-") > -1);

            if (attributes.length > 0) {
                return reduce(attributes, [], (result, attribute, callback) => {
                    let key = attribute.slice("attribute-".length);
                    log.debug("Searching " + key + " attribute:", label);

                    return findByXPath(".//*[contains(translate(@" + key + ", 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'), translate('" + label + "', 'ABCDEFGHJIKLMNOPQRSTUVWXYZ', 'abcdefghjiklmnopqrstuvwxyz'))]", scopeElement, (err, r) => {
                        return callback(err, result.concat(r));
                    });
                }, resultHandler);
            }

            return resultHandler(null, []);
        }
    }
}
