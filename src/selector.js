import DefaultContainerStrategy from "./container-strategies/discover-parent"
import defaultFindStrategies from "./find-strategies/default"
import parser from "./parser";
import log from "./logger";

var defaultContainerStrategy = new DefaultContainerStrategy(defaultFindStrategies);

export class GlanceSelector {
    constructor(options) {
        this.containerStrategy = options.containerStrategy;
        this.findStrategy = options.findStrategy;
        this.customLabels = options.customLabels;
    }

    find(selector, customLabels) {
        var data = parser.parse(selector);
        this.containerStrategy.customLabels = customLabels;
        var elements = this.containerStrategy.search(data.containers, document);

        if (elements.length === 1)
            return elements[0];
        else
            return elements;
    }
}

var selector = function(selector, customLabels) {
    return new GlanceSelector({
        containerStrategy: defaultContainerStrategy,
        findStrategy: defaultFindStrategies
    }).find(selector, customLabels);
};

selector.setLogLevel = function(level) {
    log.setLogLevel(level)
}

export default selector;