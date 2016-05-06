import defaultGuide from "./guides/search-lineage"
import defaultLocator from "./locators/default"
import Parser from "./parser";
import log from "./logger";
import mergeObject from "./utils/merge-objects"

function GlanceSelector(options) {
    let _selector = {};
    _selector.extensions = [];
    _selector.modifiers = options.modifiers || {};
    _selector.hooks = options.hooks || {};

    _selector.guideFactory = options.guideFactory;

    let selector = function(reference, config) {
        if(!reference) throw new Error("Selector required");

        _selector.extensions.filter(e => e.beforeAll).forEach(e => e.beforeAll(reference));

        let data = Parser.parse(reference);

        let elements = _selector.guideFactory(mergeObject({
            extensions: _selector.extensions,
            locator: defaultLocator,
            glance: selector
        }, config)).search(data, document, 0);

        _selector.extensions.filter(e => e.afterAll).forEach(e => e.afterAll());

        if (elements.length === 1)
            return elements[0];
        else
            return elements;
    };

    selector.addExtension = function(extension) {
        _selector.extensions.push(extension);
    };

    selector.setLogLevel = function(level) {
        log.setLogLevel(level)
    };

    return selector;
}

export {Parser};
export default GlanceSelector({guideFactory: (config) => new defaultGuide(config)});