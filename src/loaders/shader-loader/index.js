"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var loader_utils_1 = require("loader-utils");
var includePattern = /[ \t]*#include +<([\w\d./]+)>\;*/gm;
var pp = './';
var table = new Map();
var handleInclude = function (str) {
    return str.replace(includePattern, replace);
};
var replace = function (match, file) {
    var src = path_1.default.resolve(pp, file);
    if (table.has(src)) {
        return table.get(src);
    }
    var str = '';
    if (fs_1.default.existsSync(src)) {
        var content = fs_1.default.readFileSync(src, { encoding: 'utf-8' }).trim();
        var strArr = content.split('\n');
        str = strArr.join('');
        table.set(src, str);
    }
    return handleInclude(str);
};
module.exports = function (source) {
    var options = loader_utils_1.getOptions(this);
    if (typeof options.publicPath === 'string') {
        pp = options.publicPath;
    }
    var str = JSON.stringify(source);
    var replaced = handleInclude(str);
    return "module.exports = " + replaced;
};
