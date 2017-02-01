import guide from "./guide"
import Parser from "./parser"
import log from "./log"
import DefaultExtensions from './extensions/default'
import DefaultOptions from './default-options'
import browserExecute from './browser-execute'
import state from './state'
import PartialBreak from './partial-break'

function GlanceSelector(options) {
    let _selector = {};
    _selector.defaultExtensions = options.defaultExtensions || DefaultExtensions;
    _selector.extensions = options.extensions ? _selector.defaultExtensions.concat(options.extensions) : _selector.defaultExtensions;
    _selector.options = options.options || {};
    _selector.hooks = options.hooks || {};

    _selector.guideFactory = options.guideFactory;

    let selector = function (reference, ...args) {
        if (!reference) throw new Error("Selector required");

        let resultHandler = (err, result) => result;
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
        config.defaultOptions = DefaultOptions;

        log.setLogLevel(config.logLevel || 'info');

        config.rootElement = config.rootElement || document.body;
        config.glance = config.glance || selector;
        config.glanceSelector = config.glanceSelector || selector;

        if (config.browserExecute)
            browserExecute.configure(config.browserExecute);

        selector.find = function (reference, resultHandler) {
            _selector.extensions.filter(e => e.beforeAll).forEach(e => e.beforeAll({selector: reference}));

            try {
                return _selector.guideFactory().search({reference, config}, function (err, elements) {
                    _selector.extensions.filter(e => e.afterAll).forEach(e => e.afterAll({elements}));

                    let result;

                    if (elements.length === 1)
                        result = elements[0];
                    else
                        result = elements;

                    if (config.development) {
                        state.setElements(result);
                        result = state.getCurrent();
                    }

                    return resultHandler(err, result);
                });
            }
            catch (e) {
                if (!config.development)
                    return resultHandler(e, []);

                if (e instanceof PartialBreak) {
                    return resultHandler(null, state.getCurrent());
                }
            }
        }

        return selector.find(reference, resultHandler);
    };

    selector.addExtension = function (extension) {
        _selector.extensions.push(extension);
    };

    selector.setLogLevel = function (level) {
        log.setLogLevel(level);
    };

    return selector;
}

export {Parser, DefaultExtensions, DefaultOptions};
export default GlanceSelector({guideFactory: () => new guide()});
