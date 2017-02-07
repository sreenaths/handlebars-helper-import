'use strict';

var assert = require('chai').assert,
    handlebars = require('handlebars'),
    importHelper = require('../')(handlebars);

describe('import helper', function () {
  beforeEach(function () {
    handlebars.registerHelper('import', importHelper);
  });

  it('Test import', function () {
    var ctx = {
          txt: "foo"
        },
        /**
          We have 3 levels of files - top, mid & bottom. And the imports are as follows.
          index
           ├── mid 1
           │    └── bottom 1
           │
           └── mid2
                ├── bottom 2
                └── bottom 3
         */
        template = handlebars.compile('{{import "test/templates"}}');

    assert.equal(template(ctx), "[Bar 1 in Foo 1] and [Bar 2 and Bar 3 in Foo 2] in Index");
  });
});