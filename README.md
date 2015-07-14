# XSLTForms Source Management

## About

XForms to XHTML+Javascript (AJAX) conversion based on a unique XSL
transformation. Suitable server-side (PHP) or client-side (Internet Explorer,
Mozilla FireFox, Opera, Safari) browser treatment where an XSLT 1.0 engine is
available.


## Source files

XSLTForms is composed of the following files :

- `xsltforms.xsl`
- `xsltforms.js`
- `xsltforms.css`

Those files are relatively big and complex. They are generated from numerous
components.


## Components

Components are elementary source elements. Each is stored as an XML document
with metadata, unit tests and the source itself.

Components can be composed of other components.

The main components for XSLTForms are :

- `xsltforms.xsl.xml`
- `xsltforms.js.xml`
- `xsltforms.css.xml`


## tXs

tXs is an XML script engine written in PHP 5. It is composed of an unique file
named `txs.php` while scripts usually have a `.txs` extension.

First, install Apache+PHP5 locally, and activate the Rewrite Module.

Get all the XSLTForms files from SVN server into a subfolder (named
`XSLTFormsRoot` for example) of the DocumentRoot folder (a `.htaccess` file
should be present in the `XSLTFormsRoot` folder).

To check that tXs is correctly installed, get
`http://localhost/XSLTFormsRoot/txs/txs.php` with a browser : the default
script, named `echo.txs` should run and the response should be an XHTML page
with `tXs Echo Script` as title.

To check that URL rewriting is correctly installed, get
`http:/localhost/XSLTFormsRoot/txs/echo.txs` with a browser : the response
should be an XHTML page with `tXs Echo Script` as title.


## Dynamic build of XSLTForms files

Because of URL rewriting, `.js`, `.xsl` and `.css` files are not directly delivered.
Instead, the `cm.txs` script is run : it collects every source within the
corresponding component and sub-components. For the browser, it's exactly as
if it was a real file.

So, main files are obtains with URLs like those :
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.xsl`
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.js`
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.css`


## Static build of XSLTForms files

To build a component, just add `?build` at the end of the
component URI. The resulting file is written in the `build` folder at the
same level as the `src` folder.

So, main files are built with URLs like those :
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.xsl?build`
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.js?build`
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.css?build`


## Unit tests

Unit tests are based on [JsUnitTest](http://jsunittest.com/).

To run associated unit tests for a component, just add `?ut` at the end of the
component URI.

Examples :
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.js?ut`
- `http://localhost/XSLTFormsRoot/trunk/src/xsltforms.xsl?ut`
- `http://localhost/XSLTFormsRoot/trunk/src/js/types/TypeDefs.js?ut`


## Test Suites

Test Suites are stored separately from components in the `testsuite` folder.

To run tests with trunk or branches components, the `testsuite` path has to be
added after the `src` path to main components (`xsltforms.*.xml`).
tXs scripts are there to adapt each test to XSLTForms requirements (add the
processing instruction for the XSLT transformation, change the submission
links, ...).

Examples :

- `http://localhost/XSLTFormsRoot/trunk/src/testsuite/Xforms1.1/Edition1/driverPages/html/`
- `http://localhost/XSLTFormsRoot/trunk/src/testsuite/Xforms1.1/Edition1/Chapt02/2.4.a.xhtml`


## Feature switching

Feature switching is based on files named `*options.xml` to be placed in the
same folder as main components (`xsltforms.*.xml`). Options are processing
instructions to add in the XML document to permit the XSLT transformation to
interpret them.

Example : `http://localhost/XSLTFormsRoot/trunk/src/nocssoptions.xml`.

Then, `/*options` has to be put just before `/testsuite` in the URL to
activate the corresponding options.

Example : `http://localhost/XSLTFormsRoot/trunk/src/nocssoptions/testsuite/Xforms1.1/Edition1/Chapt02/2.4.a.xhtml`
