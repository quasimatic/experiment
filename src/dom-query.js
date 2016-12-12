import SearchLineage from './guides/search-lineage';

export default class DomQuery {
    search(data, callback = (err, result) => result) {
        let {scopes, scopeElement, config = {}} = data;
        config.extensions = config.extensions || [];

        data = {
            ...data,
            extensions: config.extensions
        };

        return SearchLineage.traverseScopes({
            ...data,
            elements: [scopeElement],
            target: scopes[0],
            scopeElements: []
        }, callback);
    }
}