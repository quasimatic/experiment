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

        let scopeTargets = state.getScopeTargets();

        return reduce(scopeTargets, [state.getConfig().rootElement], (scopeElements, targets, scopeTargetHandler) => {
                return Guide.processIntersections({
                    ...data,
                    targets,
                    scopeElements: scopeElements
                }, (err, elements) => scopeTargetHandler(err, elements));
            },
            (err, locatedElements) => {
                data.elements = locatedElements;
                if (config.development) {
                    return resultHandler(err, data);
                }
                else {
                    return resultHandler(err, locatedElements);
                }

            }
        )
    }

    static filterElements(locatedElements, data, filterResultHandler) {
        let {state} = data;
        state.labelProcessed({...data, elements: locatedElements});
        return Filter.process(locatedElements, data, (err, filteredElements) => {
            return filterResultHandler(err, filteredElements)
        });
    }

    static processIntersections(data, resultHandler) {
        let {targets, state, scopeElements} = data;

        return reduce(targets, [], (intersectElements, target, intersectionHandler) => {
            return reduce(scopeElements, [], (scopeElementsResult, containerElement, scopeHandler) => {
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
                    return Guide.filterElements(locatedElementInfo, {
                        ...data,
                        target
                    }, (err, locatedAndFilteredElements) => {
                        if (intersectElements.length > 0) {
                            return locateIntersections(locatedAndFilteredElements, intersectElements, intersectionHandler);
                        }

                        return intersectionHandler(err, locatedAndFilteredElements);
                    });
                });
        }, (err, elements) => {
            state.afterScope({...data, elements: elements});

            return resultHandler(err, elements)
        })
    }
}