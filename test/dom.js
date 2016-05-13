import ReactDOM from 'react-dom';

export default {
    get(...ids) {
        var result = ids.map(function(id) {
            return document.getElementById(id)
        });

        return result.length == 1? result[0] : result;
    },

    render(jsx) {
        return ReactDOM.render(jsx, document.body);
    }
}