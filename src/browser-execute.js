let execute = function (func, ...args) {
    return func(...args);
};

var browserExecute = function(...args) {
    return execute(...args);
}

browserExecute.configure = function(func) {
    execute = func;
}

export default browserExecute;
