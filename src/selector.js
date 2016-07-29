import defaultGuide from "./guides/search-lineage"
import Parser from "./parser";
import log from "./logger";
import defaultExtensions from './extensions/default';
import defaultProperties from './default-properties';

function GlanceSelector(options) {
    let _selector = {};
    _selector.extensions = defaultExtensions;
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

        log.setLogLevel(config.logLevel || 'info');

        config.rootElement = config.rootElement || document.body;

        var globalScope = global || window;

        globalScope.browserExecute = config.browserExecute || function (func, ...args) {
                return func(...args);
            };

        _selector.extensions.filter(e => e.beforeAll).forEach(e => e.beforeAll({selector:reference}));

        let data = Parser.parse(reference);

        log.debug("Selector:", reference);

        return _selector.guideFactory(Object.assign({}, {
            defaultProperties: defaultProperties,
            extensions: _selector.extensions,
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
