import isDescendant from './utils/is-descendant'
import Parser from "./parser"
import Extensions from "./utils/extensions";

export default class State {
    constructor(reference, config = {extensions: []}) {
        let references = Parser.parse(reference);

        let scopeTargets = references.map((intersections, i) => {
            return intersections.map(target => {return {...target, scopeIndex: i}});
        });

        this.state = {
            scopeTargets: scopeTargets,
            config: config,
            containerElements: [],
            scopeElements: [],
            subjectElements: [],
            processed: [],
        };
    }

    getConfig() {
        return this.state.config;
    }

    getExtensions() {
        return this.state.config.extensions;
    }

    setSubjectElements(elements) {
        this.state.subjectElements = elements;
    }

    addContainerElement(element) {
        this.state.containerElements = this.state.containerElements.filter(c => !isDescendant(c, element));
        this.state.containerElements.push(element);
    }

    getContainerElements() {
        return this.state.containerElements;
    }

    targetProcessed({elements, target}) {
        this.state.processed.push(target);
    }

    scopeProcessed({elements, target}) {
        this.state.scopeElements = elements;
        this.state.processed.push(target);
    }

    labelProcessed({elements, target}) {
        this.state.locatedElements = elements;
    }

    getCurrent() {
        return this.state;
    }

    getScopeTargets() {
        return this.state.scopeTargets;
    }

    getNextTarget(target) {
        let index = this.state.scopeTargets.indexOf(target);
        return this.state.scopeTargets[index + 1];
    }

    processTarget() {
    }

    // Events
    beforeScope(data) {
        Extensions.beforeScopeEvent(data, this.state.config.extensions)
    }

    afterScope(data) {
        Extensions.afterScopeEvent(data, this.state.config.extensions);
    }
};

