'use strict';

const DIR_KEY = "__dir__";
const FN_KEY = "__fn__";

var fs = require('fs'),
    path = require('path');

function normalizeFilePath(filePath) {
  var ext = path.extname(filePath);

  if(ext) {
    if(ext === ".hbs" || ext === ".handlebars") {
      if(fs.existsSync(filePath)) {
        return filePath;
      }
    }
    else {
      throw new Error("handlebars-helper-import: Invalid extension : " + filePath);
    }
  }
  else {
    let normalizedPath = filePath + ".hbs";
    if(fs.existsSync(normalizedPath)) {
      return normalizedPath;
    }
    normalizedPath = filePath + ".handlebars";
    if(fs.existsSync(normalizedPath)) {
      return normalizedPath;
    }

    normalizedPath = path.join(filePath, "index.hbs");
    if(fs.existsSync(normalizedPath)) {
      return normalizedPath;
    }
    normalizedPath = path.join(filePath, "index.handlebars");
    if(fs.existsSync(normalizedPath)) {
      return normalizedPath;
    }
  }

  throw new Error("handlebars-helper-import: File not found : " + filePath);
}

function getTemplate(handlebars, filePath) {
  var source = fs.readFileSync(filePath, 'utf-8');
  return handlebars.compile(source);
}

module.exports = function (handlebars) {
  if(!handlebars) {
    throw new Error("Handlebars not passed!");
  }

  return function (filePath, options) {
    var context = Object.create(this),
        directory = process.cwd();

    if(typeof filePath === 'object' && context[FN_KEY]) {
      return new handlebars.SafeString(context[FN_KEY](context));
    }
    else if (typeof filePath !== 'string') {
      throw new Error("handlebars-helper-import: Path must be a string. But its " + filePath);
    }

    if(!path.isAbsolute(filePath) && this[DIR_KEY]) {
      directory = this[DIR_KEY];
    }

    filePath = normalizeFilePath(path.join(directory, filePath));

    context[DIR_KEY] = path.dirname(filePath);

    if(options.fn) {
      context[FN_KEY] = options.fn;
    }

    return new handlebars.SafeString(getTemplate(handlebars, filePath)(context));
  };
};