export default class Modifiers {
    static labels(extensions) {
        return extensions.filter(e => e.labels).reduce((m, e) => Object.assign({}, m, e.labels), {});
    }

    static properties(extensions) {
        return extensions.filter(e => e.properties).reduce((m, e) => Object.assign({}, m, e.properties), {});
    }
}