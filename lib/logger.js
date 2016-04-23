'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var LogLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4
};

exports.default = {
    level: LogLevels['error'],

    setLogLevel: function setLogLevel(level) {
        this.level = LogLevels[level];
    },
    error: function error() {
        for (var _len = arguments.length, messages = Array(_len), _key = 0; _key < _len; _key++) {
            messages[_key] = arguments[_key];
        }

        this._log('error', messages);
    },
    warn: function warn() {
        for (var _len2 = arguments.length, messages = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            messages[_key2] = arguments[_key2];
        }

        this._log('warn', messages);
    },
    info: function info() {
        for (var _len3 = arguments.length, messages = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            messages[_key3] = arguments[_key3];
        }

        this._log('info', messages);
    },
    debug: function debug() {
        for (var _len4 = arguments.length, messages = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            messages[_key4] = arguments[_key4];
        }

        this._log('debug', messages);
    },
    trace: function trace() {
        for (var _len5 = arguments.length, messages = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            messages[_key5] = arguments[_key5];
        }

        this._log('trace', messages);
    },
    _log: function _log(level, messages) {
        var l = LogLevels[level];

        if (l <= this.level) {
            console.log(messages.join(" "));
        }
    }
};