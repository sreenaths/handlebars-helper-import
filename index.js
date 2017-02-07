'use strict';

const DIR_KEY = "__dir__";

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

  return function (filePath) {
    var context = Object.create(this);

    if (typeof filePath !== 'string') {
      throw new Error("handlebars-helper-import: Path must be a string. But its " + filePath);
    }

    if(!path.isAbsolute(filePath)) {
      filePath = path.join(this[DIR_KEY] || process.cwd(), filePath);
    }
    filePath = normalizeFilePath(filePath);

    context[DIR_KEY] = path.dirname(filePath);

    return getTemplate(handlebars, filePath)(context);
  };
};