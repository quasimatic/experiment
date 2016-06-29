import defaultGuide from "./guides/search-lineage"
import defaultLocator from "./locators/default"
import Parser from "./parser";
import log from "./logger";

function GlanceSelector(options) {
    let _selector = {};
    _selector.extensions = [];
    _selector.properties = options.properties || {};
    _selector.hooks = options.hooks || {};

    _selector.guideFactory = options.guideFactory;

    let selector = function (reference, config, callback) {
        if (!reference) throw new Error("Selector required");

        config = config || {};
        config.rootElement = config.rootElement || document;

        callback = callback || function (result) {
                return result;
            };

        var globalScope = global || window;
        globalScope.customExecute = config.execute || function (func, ...args) {
                let callback = typeof(args[args.length - 1]) == "function" ? args[args.length - 1] : function (value) {
                    return value;
                };
                return callback(func.apply(func, args));
            };

        _selector.extensions.filter(e => e.beforeAll).forEach(e => e.beforeAll(reference));

        let data = Parser.parse(reference);

        return _selector.guideFactory(Object.assign({}, {
            extensions: _selector.extensions,
            locator: defaultLocator,
            glance: selector
        }, config)).search(data, config.rootElement, function (elements) {
            _selector.extensions.filter(e => e.afterAll).forEach(e => e.afterAll({elements}));

            if (elements.length === 1)
                return callback(elements[0]);
            else
                return callback(elements);
        });
    };

    selector.addExtension = function (extension) {
        _selector.extensions.push(extension);
    };

    selector.setLogLevel = function (level) {
        log.setLogLevel(level);
    };

    return selector;
}

export {Parser};
export default GlanceSelector({guideFactory: (config) => new defaultGuide(config)});
