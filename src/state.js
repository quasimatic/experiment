import isDescendant from './utils/is-descendant'
import Parser from "./parser"
import Extensions from "./utils/extensions";

export default {
    reset(reference, config = {extensions: []}) {
        let references = Parser.parse(reference);

        let scopes = references.map((scope, i) => {
            return {...scope, scopeIndex: i}
        });

        this.state = {
            scopes: scopes,
            config: config,
            containerElements: [],
            scopeElements: [],
            elements: [],
            processed: [],
        };
    },

    getConfig() {
        return this.state.config;
    },

    getExtensions() {
        return this.state.config.extensions;
    },

    getFirstScope() {
        return this.state.scopes[0];
    },

    setElements(elements) {
        this.state.elements = elements;
    },

    addContainerElement(element) {
        this.state.containerElements = this.state.containerElements.filter(c => !isDescendant(c, element));
        this.state.containerElements.push(element);
    },

    getContainerElements() {
        return this.state.containerElements;
    },

    targetProcessed({elements, target}) {
        this.state.processed.push(target);
    },

    scopeProcessed({elements, target}) {
        this.state.scopeElements = elements;
        this.state.processed.push(target);
    },

    labelProcessed({elements, target}){
        this.state.locatedElements = elements;
    },

    getCurrent() {
        return this.state;
    },

    getScopes() {
        return this.state.scopes;
    },

    processTarget() {
    },

    // Events
    beforeScope(data) {
        Extensions.beforeScopeEvent(data)
    },

    afterScope(data) {
        Extensions.afterScopeEvent(data);
    }
};

