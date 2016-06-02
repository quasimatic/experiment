import visible from "../filters/visible";
import Extensions from "../utils/extensions";
import unique from "../utils/unique";
import Locator from "./locator";
import Filter from "./filter";


export default class SearchLineage {
    constructor(config) {
        this.config = config;
        this.config.extensions = config.extensions || [];
        this.extensions = config.extensions || [];
        this.locator = config.locator;

        this.defaultFilters = [visible];
    }

    search(targets, scope) {
        if(this.config.preload) {
            console.log(this.config.preload.targets)
            let labelIndex = this.config.preload.targets.length - 1;

            if (SearchLineage.isLastLabel(targets, labelIndex)) {
                return this.config.preload.elements;
            }
            else {
                return SearchLineage.traverseScopes(this.config.preload.elements, targets, labelIndex, this.config);
            }
        }
        else
        {
            return this.process(targets, scope, 0)
        }
    }

    process(targets, scope, labelIndex) {
        let target = targets[labelIndex];

        Extensions.beforeScopeEvent(this.extensions, {targets, scope});

        let elements = Locator.locate(target, scope, this.extensions, this.locator, this.config);

        let filteredElements = Filter.filter(target, elements, scope, this.extensions, this.defaultFilters);

        Extensions.afterScopeEvent(this.extensions, {targets, scope});

        if (SearchLineage.isLastLabel(targets, labelIndex)) {
            return filteredElements;
        }
        else {
            return SearchLineage.traverseScopes(filteredElements, targets, labelIndex, this.config);
        }
    }

    static traverseScopes(filteredElements, targets, labelIndex, config) {
        let newTargets = [];

        for (let c = 0; c < filteredElements.length; c++) {
            let childContainer = filteredElements[c];

            let foundItems = new SearchLineage(config).process(targets, childContainer, labelIndex + 1);
            newTargets = newTargets.concat(foundItems);
        }

        return unique(newTargets);
    }

    static isLastLabel(targets, labelIndex) {
        return labelIndex + 1 === targets.length;
    }
}