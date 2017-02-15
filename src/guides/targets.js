import Locator from "./locator";
import Filter from "./filter";
import {reduce} from "../utils/array-utils";
import locateIntersections from "./locate-intersections";
import emptyOnError from '../empty-on-error';

export default class Targets {
    static traverse(data, resultHandler) {
        let {
            state,
            elements,
            target,
            intersectElements
        } = data;

        state.processTarget();

        return reduce(elements, [], (result, scopeElement, levelHandler) => Targets.locateTarget(result, scopeElement, intersectElements, data, levelHandler), emptyOnError((err, locatedTargets) => {
            state.labelProcessed({...data, elements: locatedTargets});

            return Filter.process(locatedTargets, data, (err, filteredElements) => {
                state.afterScope({...data, elements: filteredElements});

                switch (target.type) {
                    case "subject":
                        state.targetProcessed({...data, elements: filteredElements});
                        return resultHandler(err, filteredElements);

                    case "intersect":
                        return Targets.traverseIntersect(filteredElements, data, resultHandler);

                    case "scope":
                        state.scopeProcessed({...data, elements:filteredElements});

                        return Targets.traverse({
                            ...data,
                            intersectElements: null,
                            scopeElements: filteredElements,
                            elements: filteredElements,
                            target: state.getNextTarget(target)
                        }, resultHandler);
                }
            })
        }));
    }

    static traverseIntersect(filteredElements, data, resultHandler) {
        let {state,target} = data;

        return Targets.traverse({
            ...data,
            intersectElements: filteredElements,
            elements: filteredElements,
            target: state.getNextTarget(target)
        }, resultHandler);
    }

    static locateTarget(result, scopeElement, intersectElements, data, resultHandler) {
        let {state} = data;
        state.beforeScope({...data, scopeElement});

        return Locator.locate({...data, scopeElement}, emptyOnError((err, located) => {
            if (intersectElements) {
                return locateIntersections(located, intersectElements, result, emptyOnError((err, located) => {
                    result.push({scopeElement, elements: located});
                    return resultHandler(err, result);
                }));
            }

            result.push({scopeElement, elements: located});
            return resultHandler(err, result)
        }))
    }
}