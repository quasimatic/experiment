export default class Extensions {
    static beforeScopeEvent(extensions, data) {
        return extensions.filter(e => e.beforeScope).forEach(e => e.beforeScope(data));
    }

    static afterScopeEvent(extensions, data){
        return extensions.filter(e => e.afterScope).forEach(e => e.afterScope(data));
    }
}