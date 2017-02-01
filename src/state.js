import isDescendant from './utils/is-descendant'
import PartialBreak from './partial-break'
import Parser from './parser'

export default {
    reset(config) {
        this.state = {
            config: config,
            containerElements: [],
            scopeElements: [],
            elements:[],
            processed: [],
        };
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

    scopeProcessed({elements, target}) {
        this.state.scopeElements = elements;
        this.state.processed.push(target);
    },

    getCurrent() {
        return this.state;
    },

    processLabel(data) {
    }
};

