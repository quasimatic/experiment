import Targets from './guides/targets'
import log from "./log"
import state from './state'
import defaultHandler from './utils/default-result-handler';

export default class Guide {
    search(reference, config = {}, resultHandler = defaultHandler) {
        log.debug("Reference:", reference);

        config.extensions = config.extensions || [];

        state.reset(reference, config);

        let data = {
            glance: config.glance,
            glanceSelector: config.glanceSelector,
            scopeElement: config.rootElement,
            elements: [config.rootElement],
            target: state.getFirstScope(),
            scopeElements: []
        };

        return Targets.traverse(data, resultHandler);
    }
}