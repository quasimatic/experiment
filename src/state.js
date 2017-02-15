import isDescendant from './utils/is-descendant'
import Parser from "./parser"
import Extensions from "./utils/extensions";

export default class State {
    constructor(reference, config = {extensions: []}) {
        let references = Parser.parse(reference);

        let scopeTargets = references.map((target, i) => ({...target, scopeIndex: i}));

        this.state = {
            scopeTargets: scopeTargets,
            config: config,
            containerElements: [],
            scopeElements: [],
            subjectElements: [],
            processed: [],
        };
    }

    reset(reference, config = {extensions: []}) {
        let references = Parser.parse(reference);

        let scopeTargets = references.map((target, i) => ({...target, scopeIndex: i}));

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

    getFirstScope() {
        return this.state.scopeTargets[0];
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
        return this.state.scopeTargets[target.scopeIndex + 1]
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

