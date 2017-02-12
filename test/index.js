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
          f1: "Foo 1",
          f2: "Foo 2",

          b1: "Bar 1",
          b2: "Bar 2",
          b3: "Bar 3",
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

    // Relative path
    template = handlebars.compile('{{#import "test/templates/block"}}[{{import "./"}}]{{/import}}');
    assert.equal(template(ctx), "[Block1[[Bar 1 in Foo 1] and [Bar 2 and Bar 3 in Foo 2] in Index]][Block2[[Bar 1 in Foo 1] and [Bar 2 and Bar 3 in Foo 2] in Index]]");

    // Absolute path
    template = handlebars.compile('{{#import "test/templates/block"}}[{{import "/test/templates"}}]{{/import}}');
    assert.equal(template(ctx), "[Block1[[Bar 1 in Foo 1] and [Bar 2 and Bar 3 in Foo 2] in Index]][Block2[[Bar 1 in Foo 1] and [Bar 2 and Bar 3 in Foo 2] in Index]]");

    // Plain Text
    template = handlebars.compile('{{#import "test/templates/block"}}[foo.bar]{{/import}}');
    assert.equal(template(ctx), "[Block1[foo.bar]][Block2[foo.bar]]");

    // Nested block import
    template = handlebars.compile('{{#import "test/templates/block_nested"}}[foo.bar]{{/import}}');
    assert.equal(template(ctx), "[Block1[foo.bar]][Block2[foo.bar]]");

  });

  it('Test error conditions', function () {
    var ctx = {},
        template;

    // File not found
    template = handlebars.compile('{{import "test/no-template"}}');
    assert.throws(function () {
      template(ctx)
    });

    // Invalid extension
    template = handlebars.compile('{{import "test/invalid.ext"}}');
    assert.throws(function () {
      template(ctx)
    });

    // Path must be a string
    template = handlebars.compile('{{import 1}}');
    assert.throws(function () {
      template(ctx)
    });
  });

});