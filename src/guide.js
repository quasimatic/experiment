import Labels from './guides/labels'
import log from "./log"
import state from './state'
import defaultHandler from './utils/default-result-handler';

export default class Guide {
    search(reference, config = {}, resultHandler = defaultHandler) {
        log.debug("Selector:", reference);

        config.extensions = config.extensions || [];

        state.reset(reference, config);

        let data = {
            glance: config.glance,
            glanceSelector: config.glanceSelector,
            scopeElement: config.rootElement,
            config,
            extensions: config.extensions,
            elements: [config.rootElement],
            target: state.getFirstScope(),
            scopeElements: []
        };

        return Labels.traverse(data, resultHandler);
    }
}