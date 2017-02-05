import isDescendant from './utils/is-descendant'

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

