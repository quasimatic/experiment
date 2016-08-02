import ReactDOM from 'react-dom';
import escapeCSS from '@walkerrandolphsmith/escape-css-selector'

window.browserExecute = function (func, ...args) {
    return func(...args);
};

export default {
    get(...ids) {
        var result = ids.map(function (id) {
            return document.querySelector(`#${escapeCSS(id)}`);
        });

        return result.length == 1 ? result[0] : result;
    },

    render(jsx) {
        var div = document.createElement("div");
        document.body.appendChild(div);
        return ReactDOM.render(jsx, div);
    }
}