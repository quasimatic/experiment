export default class Extensions {
    static beforeScopeEvent(data) {
        let {extensions} = data;
        return extensions.filter(e => e.beforeScope).forEach(e => e.beforeScope(data));
    }

    static afterScopeEvent(data){
        let {extensions} = data;
        return extensions.filter(e => e.afterScope).forEach(e => e.afterScope(data));
    }
}