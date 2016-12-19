import Sections from './guides/sections';
import Parser from "./parser";
import log from "./log";

export default class Guide {
    search({reference, config = {}}, callback = (err, result) => result) {
        let scopes = Parser.parse(reference);

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

        return Sections.traverse({
            ...data,
            elements: [scopeElement],
            target: scopes[0],
            scopeElements: []
        }, callback);
    }
}