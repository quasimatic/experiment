import Extensions from "../utils/extensions";
import Locator from "./locator";
import Filter from "./filter";
import {reduce} from "../utils/array-utils";
import locateIntersections from "./locate-intersections";
import emptyOnError from '../empty-on-error';
import state from '../state';

export default class Labels {
    static traverse(data, resultHandler) {
        let scopes = state.getCurrent().scopes;

        data = {...data, scopes};

        let {
            elements,
            target,
            intersectElements
        } = data;

        state.processLabel(data);

        return reduce(elements, [], (result, scopeElement, levelHandler) => Labels.processLevel(result, scopeElement, intersectElements, data, levelHandler), emptyOnError((err, locatedTargets) => {
            state.labelProcessed({...data, elements: locatedTargets});

            return Filter.process(locatedTargets, data, (err, filteredElements) => {
                Extensions.afterScopeEvent({...data, elements: filteredElements});

                switch (target.type) {
                    case "target":
                        state.targetProcessed({...data, elements: filteredElements});
                        return resultHandler(err, filteredElements);

                    case "intersect":
                        return Labels.traverseIntersect(filteredElements, data, resultHandler);

                    case "scope":
                        state.scopeProcessed({...data, elements:filteredElements});
                        return Labels.traverse({
                            ...data,
                            intersectElements: null,
                            scopeElements: filteredElements,
                            elements: filteredElements,
                            target: scopes[target.scopeIndex + 1]
                        }, resultHandler);
                }
            })
        }));
    }

    static traverseIntersect(filteredElements, data, resultHandler) {
        let {scopes, target} = data;

        return Labels.traverse({
            ...data,
            intersectElements: filteredElements,
            elements: filteredElements,
            target: scopes[target.scopeIndex + 1]
        }, resultHandler);
    }

    static processLevel(result, scopeElement, intersectElements, data, resultHandler) {
        Extensions.beforeScopeEvent({...data, scopeElement});

        return Locator.locate({...data, scopeElement}, emptyOnError((err, located) => {
            if (intersectElements) {
                return locateIntersections(data, located, intersectElements, result, emptyOnError((err, located) => {
                    result.push({scopeElement, elements: located});
                    return resultHandler(err, result);
                }));
            }

            result.push({scopeElement, elements: located});
            return resultHandler(err, result)
        }))
    }
}