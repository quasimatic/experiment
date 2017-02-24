import log from "../log"
import State from '../state'
import {reduce} from "../utils/array-utils";
import defaultHandler from '../utils/default-result-handler';
import locateIntersections from "./locate-intersections";
import Locator from "./locator";
import Filter from "./filter";

export default class Guide {
    search(reference, config = {}, resultHandler = defaultHandler) {
        log.debug("Reference:", reference);

        config.extensions = config.extensions || [];

        let state = new State(reference, config);

        let data = {
            glance: config.glance,
            glanceSelector: config.glanceSelector,
            scopeElements: [],
            state: state
        };

        return Guide.processTargets(data, resultHandler)
    }

    static processTargets(data, resultHandler) {
        let {state} = data;
        let config = state.getConfig();

        return reduce(
            state.getScopeTargets(),
            [config.rootElement],
            (scopeElements, targets, scopeTargetHandler) => Guide.processIntersections({...data, targets, scopeElements}, (err, elements) => scopeTargetHandler(err, elements)),
            (err, locatedElements) => config.development ? resultHandler(err, {...data, elements: locatedElements}) : resultHandler(err, locatedElements));
    }

    static filterElements(locatedElements, data, resultHandler) {
        let {state} = data;
        state.labelProcessed({...data, elements: locatedElements});
        return Filter.process(locatedElements, data, resultHandler);
    }

    static processIntersections(data, resultHandler) {
        let {targets, state, scopeElements} = data;

        return reduce(
            targets,
            [],
            (intersectElements, target, intersectionHandler) => this.processScopeElements(scopeElements, data, target, intersectElements, intersectionHandler),
            (err, elements) => {
                state.afterScope({...data, elements: elements});
                return resultHandler(err, elements)
            });
    }

    static processScopeElements(scopeElements, data, target, intersectElements, resultHandler) {
        let {state} = data;
        return reduce(
            scopeElements,
            [],
            (scopeElementsResult, containerElement, scopeHandler) => {
                state.beforeScope({...data, containerElement});
                return Locator.locate({
                    ...data,
                    containerElement,
                    target
                }, (err, locatedElements) => {
                    scopeElementsResult.push({elements: locatedElements, containerElement});
                    return scopeHandler(err, scopeElementsResult)
                });
            },
            (err, locatedElementInfo) => {
                return Guide.filterElements(locatedElementInfo,
                    {...data, target},
                    (err, locatedAndFilteredElements) => intersectElements.length > 0 ? locateIntersections(locatedAndFilteredElements, intersectElements, resultHandler) : resultHandler(err, locatedAndFilteredElements));
            });
    }
}