fullnode (alpha)
================

fullnode is a javascript implementation of bitcoin intended to satisfy certain
goals:

1. Support ease-of-use by being internally consistent. It should not be
necessary to read the source code of a class or function to know how to use it.

2. Have 100% test coverage, or nearly so, so that the library is known to be
reliable. This should include running standard test vectors from bitcoin core.

3. Library objects have an interface suitable for use with a command-line
interface and API, in particular having toString, fromString, toJSON, fromJSON,
methods. Other common methods are toBuffer, fromBuffer relevant for binary
formats such as transactions and blocks.

4. All standard features of the bitcoin protocol are implemented and saved in
lib/. All BIPs are correctly implemented and, where appropriate, saved as
bipxx.js in lib/ (since that is their standard name). Any non-standard features
(such as colored coins or stealth addresses) are placed in the lib/expmt/
folder and are accessible at fullnode.expmt. Once they are standardized and
given a BIP, they are renamed and placed in lib/.

5. Expose everything, including dependencies. This makes it possible to develop
apps that require fine-grained control over the basics, such as big numbers and
points. However, it also means that you can hurt yourself if you misuse these
primitives.

6. It is always possible to create a new object without using "new".

7. Compatible with browserify (i.e., using require('fullnode/lib/message')
should work both in node, and be automatically work in the browser with used in
conjunction with browserify).

8. Minimize the use of dependencies so that all code can be easily audited.

9. All instance methods modify the state of the object and return the object,
unless there is a good reason to do something different.  To access the result
of an instance method, you must access the object property(s) that it modifies.

## Alpha Caveat ##

fullnode is still alpha, and has an unstable API. Once the code has been
audited, the API will be settled, and version 1.0 will be released. It is
recommended not to use fullnode for production software until that time.

## Notable Features ##

* 90%+ test coverage
* Browserifiable
* Stealth keys, addresses, message
* Bitcoin-style message signing and verification
* Exposed big number and point classes
* Deterministic k (deterministic signatures; RFC 6979)
* Script interpreter, validated against bitcoind tests

## Documentation ##

```
npm install -g groc
groc
```

## Browser bundle ##

```
npm install -g browserify
npm install -g uglifyify
npm run build
```
## Testing and Coverage ##

To run tests for both node and the browser (requires both Firefox and Chrome):
```
npm install -g mocha
npm install -g istanbul
npm test
```

Tests for node only:
```
npm run test-node
```

You can see the coverage report at coverage/lcov-report/index.html.

Tests for the browser only:
```
npm run test-browser
```

Or, run tests in your browser of choice without using karma, first build:
```
npm run build
```

Then open test/index.html in your browser.
