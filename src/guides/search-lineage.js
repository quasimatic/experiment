import visible from "../filters/visible";
import unique from "../utils/unique"
import Locator from "./locator";
import Filter from "./filter";

export default class SearchLineage {
    constructor(config) {
        this.config = config;
        this.extensions = config.extensions || [];
        this.locator = config.locator;
        this.modifiers = config.modifiers || {};

        this.defaultFilters = [visible];
    }

    search(targets, scope, labelIndex, customLabels) {
        labelIndex = labelIndex || 0;
        let target = targets[labelIndex];

        let elements = Locator.locate(target, scope, this.extensions, customLabels, this);

        let filteredElements = Filter.filter(target, elements, scope, this.extensions, this);

        if (SearchLineage.isLastLabel(targets, labelIndex)) {
            return filteredElements;
        }
        else {
            return SearchLineage.traverseScopes(filteredElements, targets, labelIndex, customLabels, this.config);
        }
    }

    static traverseScopes(filteredElements, targets, labelIndex, customLabels, config) {
        let newTargets = [];

        for (let c = 0; c < filteredElements.length; c++) {
            let childContainer = filteredElements[c];

            let foundItems = new SearchLineage(config).search(targets, childContainer, labelIndex + 1, customLabels);
            newTargets = newTargets.concat(foundItems);
        }

        return unique(newTargets);
    }

    static isLastLabel(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}