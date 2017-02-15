import Targets from './guides/targets'
import log from "./log"
import State from './state'
import defaultHandler from './utils/default-result-handler';

export default class Guide {
    search(reference, config = {}, resultHandler = defaultHandler) {
        log.debug("Reference:", reference);

        config.extensions = config.extensions || [];

        let state = new State(reference, config);

        let data = {
            glance: config.glance,
            glanceSelector: config.glanceSelector,
            scopeElement: config.rootElement,
            elements: [config.rootElement],
            target: state.getFirstScope(),
            scopeElements: [],
            state: state
        };

        return Targets.traverse(data, (err, elements) => {
            data.elements = elements;
            if(config.development) {
                return resultHandler(err, data);
            }
        else {
                return resultHandler(err, elements);
            }
        });
    }
}