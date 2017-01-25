import Labels from './guides/labels';
import Parser from "./parser";
import log from "./log";

export default class Guide {
    search({reference, config = {}}, callback = (err, result) => result) {
        let scopes = Parser.parse(reference);

        scopes = scopes.map((scope,i) => {
            return {...scope, scopeIndex: i}
        });

        log.debug("Selector:", reference);

        let data = {
            glance: config.glance,
            glanceSelector: config.glanceSelector,
            scopeElement: config.rootElement,
            scopes,
            config,
            extensions: config.extensions
        }

        let {scopeElement} = data;

        config.extensions = config.extensions || [];

        data = {
            ...data,
            extensions: config.extensions
        };

        return Labels.traverse({
            ...data,
            elements: [scopeElement],
            target: scopes[0],
            scopeElements: []
        }, callback);
    }
}