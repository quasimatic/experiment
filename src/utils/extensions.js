export default class Extensions {
    static beforeScopeEvent(data) {
        let {extensions} = data;
        return extensions.filter(e => e.beforeScope).forEach(e => e.beforeScope(data));
    }

    static afterScopeEvent(data){
        let {extensions} = data;
        return extensions.filter(e => e.afterScope).forEach(e => e.afterScope(data));
    }

    static labels(extensions) {
        return extensions
            .filter(e => e.labels)
            .reduce((l, e) => Object.assign(l, e.labels), {});
    }

    static properties(extensions) {
        return extensions
            .filter(e => e.properties)
            .reduce((l, e) => Object.assign(l, e.properties), {});
    }
}