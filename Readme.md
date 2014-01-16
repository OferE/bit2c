# bit2c
A node.js module for accessing bit2c (the israeli bitcoin echange) API.

## Installing

clone the lib, cd to its root path and then:

<pre><code>
npm install
</code></pre>


## running the tests

If you want to run the tests that require access to the private API you should define 2 environment variables:
1. BIT2C_KEY - your bit2c key
2. BIT2C_SECRET - your bit2c key

These keys can be taken from your bit2c account. Just login -> API tab -> generate new.

Warning! - these keys grant access to your bit2c account! keep them safe!

For running the tests just use:
<pre><code>
npm test
</code></pre>

