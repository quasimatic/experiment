export default class Extensions {
    static locatorForLabel(extensions, target) {
        return extensions.filter(e => e.labels && e.labels[target.label]).map(e => e.labels[target.label])
    }
}