import isDescendant from './utils/is-descendant'
import Parser from "./parser"

export default {
    reset(reference, config) {
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

    processLabel(data) {
    }
};

