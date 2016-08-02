import defaultGuide from "./guides/search-lineage"
import Parser from "./parser";
import log from "./logger";
import DefaultExtensions from './extensions/default';
import DefaultProperties from './default-properties';

function GlanceSelector(options) {
    let _selector = {};
    _selector.defaultExtensions = options.defaultExtensions || DefaultExtensions;
    _selector.extensions = options.extensions ? _selector.defaultExtensions.concat(options.extensions) : _selector.defaultExtensions;
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

        config.defaultExtensions = config.defaultExtensions || DefaultExtensions;
        config.extensions = config.extensions ? config.defaultExtensions.concat(config.extensions) : config.defaultExtensions;
        config.defaultProperties = DefaultProperties;

        log.setLogLevel(config.logLevel || 'info');

        config.rootElement = config.rootElement || document.body;

        var globalScope = global || window;

        globalScope.browserExecute = config.browserExecute || function (func, ...args) {
                return func(...args);
            };

        _selector.extensions.filter(e => e.beforeAll).forEach(e => e.beforeAll({selector: reference}));

        let targets = Parser.parse(reference);

        config.glance = config.glance || selector;

        log.debug("Selector:", reference);

        return _selector.guideFactory().search({
            glance: config.glance,
            scopeElement: config.rootElement,
            targets,
            config,
            extensions: config.extensions,
            log: log
        }, function (err, elements) {
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

export {Parser, DefaultExtensions, DefaultProperties};
export default GlanceSelector({guideFactory: () => new defaultGuide()});
