---
layout: how-to.html.njk
title: Cleaning lint from documents in AkashaCMS projects
rightsidebar:
publicationDate: August 25, 2026
---

In the Unix Version 7 days, the C programming environment included a tool we were admonished to use: _lint(1)_.  The lint program did a good job of catching common errors in C programs.

We'd be asked: _Did you lint your program_?  In other words, did you use the available tool whose purpose was static analysis of the source code to catch common errors.

As website developers using AkashaCMS to produce static HTML websites, we also need to catch likely errors before deploying our site to a production server.  We want our website to become popular for all the right reasons, not because we neglected to catch likely errors and allowed our site to be a vector for spreading harmful whatever nasty stuff to our visitors.

AkashaRender does not bundle any linting functionality.

This is because there are many excellent tools for this purpose.

## Range of delinting tools required for static HTML websites

The areas we need to focus on include:

* Correctly constructed HTML
* Internal links are correct
* External links are correct
* Lack of malware in JavaScript
* Lack of malware in images
* Correctly constructed CSS
* Finding unused dependencies
* Checking dependencies against security alert systems

TODO: Look for best practices

TODO: Look for good tools in this area

TODO: Integrate example tools into package.json scripts

* ESLint
* https://knip.dev/ -- declutter code
* https://www.npmjs.com/package/@biomejs/biome -- Linting for the JS/TS/etc of web pages
* https://www.npmjs.com/package/link-check -- Also there's a builtin for this
* https://www.npmjs.com/package/xss -- sanitize HTML to prevent cross-site-scripting (XSS)
* https://www.npmjs.com/package/validate-html-nesting
* https://www.npmjs.com/package/htmldiff-js
* https://www.npmjs.com/package/ssri - Standard Subresource Integrity library -- parses, serializes, generates, and verifies integrity metadata according to the SRI spec.
* https://www.npmjs.com/package/htmlhint -- Static code analysis for HTML
* https://www.npmjs.com/package/html-validator
* https://www.npmjs.com/package/w3c-html-validator
* https://www.npmjs.com/package/stylelint
* https://www.npmjs.com/package/stylelint-scss
* https://www.npmjs.com/package/markdownlint
* https://www.npmjs.com/package/html-validate
* https://www.npmjs.com/package/yaml-lint
* https://www.npmjs.com/package/jsonlint
* tslint?  prettier?
* https://www.npmjs.com/package/package-json-validator
* https://www.npmjs.com/package/textlint
* https://www.npmjs.com/package/htmlhint
* https://www.npmjs.com/package/svglint
* https://www.npmjs.com/package/pug-lint
* https://www.npmjs.com/package/lint
* https://www.npmjs.com/package/dockerfile-utils
* https://www.npmjs.com/package/hint
* https://www.npmjs.com/package/stylint
* https://www.npmjs.com/package/prettier-check
* https://www.npmjs.com/package/rumdl
* https://www.npmjs.com/package/dockerfilelint
* https://www.npmjs.com/package/npm-pkg-lint
* https://www.npmjs.com/package/dclint
* https://www.npmjs.com/package/dockerlinter
* https://www.npmjs.com/package/dependency-lint
* https://www.npmjs.com/package/@jackchuka/mdschema
* https://www.npmjs.com/package/lintspaces
* https://www.npmjs.com/package/@mastra/lint-docs
* https://www.npmjs.com/package/dotenv-linter
* https://www.npmjs.com/package/i18n-lint
* https://www.npmjs.com/package/slopless
* https://www.npmjs.com/package/jsdoc-scribe
* lesshint
* https://www.npmjs.com/package/yamllint-js
* https://www.npmjs.com/package/hallmark
* https://www.npmjs.com/package/whine
* https://www.npmjs.com/package/rumdl-wasm
* https://www.npmjs.com/package/agentlinter
* https://www.npmjs.com/package/agents-lint
* https://www.npmjs.com/package/tslint-misc-rules
* https://www.npmjs.com/package/plain-english
* https://www.npmjs.com/package/friction-cli
* https://www.npmjs.com/package/yaml-verify
* https://www.npmjs.com/package/lintmax
* https://www.npmjs.com/package/@godlint/cli
* https://www.npmjs.com/package/prettier-resolver
* https://www.npmjs.com/package/tailwint
* https://www.npmjs.com/package/@podlite/mcp
* https://www.npmjs.com/package/wikilint
* https://www.npmjs.com/package/lint-suite
* 