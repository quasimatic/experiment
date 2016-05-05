import mergeObjects from "../utils/merge-objects";

export default class Extensions {
    static locatorForLabel(extensions, target) {
        return extensions.filter(e => e.labels && e.labels[target.label]).map(e => e.labels[target.label])
    }

    static modifiers(extensions) {
        return extensions.filter(e => e.modifiers).reduce((m, e) => mergeObjects(m, e.modifiers), {})
    }
}