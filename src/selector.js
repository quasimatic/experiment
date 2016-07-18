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

    let selector = function (reference, ...args) {
        if (!reference) throw new Error("Selector required");

        let resultHandler = (err, result)=> result;
        let config = {};

        if (args.length > 0) {
            if (typeof(args[0]) == 'object') {
                config = args[0];

                if (args[1]) {
                    resultHandler = args[1];
                }
            }
            else if (typeof(args[0]) == 'function') {
                resultHandler = args[0];
            }
        }

        if (config.logLevel) {
            log.setLogLevel(config.logLevel);
        }
        config.rootElement = config.rootElement || document;

        var globalScope = global || window;

        globalScope.customExecute = config.execute || function (func, ...args) {
                return func(...args);
            };

        _selector.extensions.filter(e => e.beforeAll).forEach(e => e.beforeAll(reference));

        let data = Parser.parse(reference);

        log.trace("Selector:", reference)

        return _selector.guideFactory(Object.assign({}, {
            extensions: _selector.extensions,
            locator: defaultLocator,
            glance: selector
        }, config)).search(data, config.rootElement, function (err, elements) {
            _selector.extensions.filter(e => e.afterAll).forEach(e => e.afterAll({elements}));

            if (elements.length === 1)
                return resultHandler(err, elements[0]);
            else
                return resultHandler(err, elements);
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
