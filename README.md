# handlebars-helper-import [![npm version](https://badge.fury.io/js/handlebars-helper-import.svg)](https://badge.fury.io/js/handlebars-helper-import)

> A helper for nodejs/Handlebars projects to import template files directly form inside another template. Its like partials that need not be registered.

## Use case
I was trying to re-build my portfolio website - [sreenaths.com](http://www.sreenaths.com). Nothing complex, just a set of static pages. Intention was to build the HTMLs out of a set of handlebars template files, and host the static file somewhere.

Was looking into partials, and other build tools for the same. But then I started wondering why not have a simple helper to directly import a template inside another. That would remove the registration bit and keep stuffs simple by not using any build tools. I could get my complete page build from a simple js file!

... hence this helper.


## Install with [npm](npmjs.org)

```bash
npm i handlebars-helper-import --save
```

## Require & Register

```js
// Pass a reference to the handlebars used by you and get the helper function
var handlebars = require('handlebars');
var importHelper = require('handlebars-helper-import')(handlebars);

// Register the helper with Handlebars. You can use 'import' or any other name that you are comfortable with.
handlebars.registerHelper('import', importHelper);
```

## Usage

You can register and use **handlebars-helper-import** from node.js just like other handlebars helpers.

```hbs
// Assuming CWD to be /tmp
{{import 'templates_dir/file'}} // Will import /tmp/templates_dir/file.(hbs OR handlebars)
{{import 'templates_dir/directory_path'}} // Will import /tmp/templates_dir/directory_path/index.(hbs OR handlebars)

// Now inside /tmp/templates_dir/file.hbs you can do the following
    {{import 'sibling_file'}} // To import /tmp/templates_dir/sibling_file.(hbs OR handlebars)
    {{import 'sibling_dir/relative_file'}} // To import /tmp/templates_dir/sibling_dir/relative_file.(hbs OR handlebars)
    {{import 'directory_path'}} // To import /tmp/templates_dir/directory_path/index.(hbs OR handlebars)
```

- You can nest imports:
  - i.e. you can **import** templates from inside templates that were imported using **import**!
  - Take care to not create cyclic imports.
  - Thus your template files can form an acyclic graph or a tree relation, with each file as a node.
- File Paths:
  - For the first (the top most / non-nested) imports the paths must be relative to CWD (Current Working Directory).
  - In nested imports you can use paths relative to its parent template.
  - If you give a directory name as path, the helper would expect an index template file in it.
  - You can always use absolute paths (/ starts from CWD).
- Template file could be of **.hbs** or **.handlebars** extension and the helper would automatically detect it without specifying.
- Helper would throw Errors in the following conditions:
  - If path passed is not of type string.
  - If file is not found.
  - If file extension is passed in path and it's not .hsb or .handlebars.
- Please refer the test code for more insight.

#### Block support
You can use import (Or the name you have registered the helper with) as a block helper.
```hbs
{{#import 'templates_dir/block'}}DEF{{/import}}
```
Now in templates_dir/block.hbs use **{{import}}** without any argument to get the value that's inside the block. In this case 'DEF'. So if templates_dir/block.hbs is as follows. The above above templates will give **ABCDEFGHI** as output.
```hbs
ABC{{import}}GHI
```
**{{import}}** would work in templates nested (to any level) inside templates_dir/block.


#### Simple JavaScript code to convert a foo.hbs with all its nested imports into HTML:
```js
// Assuming your script is in /tmp/index.js and foo.hbs in /tmp/templates_dir/ - (CWD = /tmp).
var template = handlebars.compile('{{import "templates_dir/foo"}}'); // Will imports /tmp/templates_dir/foo.(hbs OR handlebars) file
var context = {
  // Key-Values to be used in foo.hbs or inner/nested templates
};
template(context) // Returns you the HTML made from your template foo
```

## Running tests
Install dependencies.

```bash
npm test
```

## Contributing
Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/sreenaths/handlebars-helper-import/issues).

## License
Copyright (c) 2017 Sreenath Somarajapuram

Released under the MIT license