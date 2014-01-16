# bit2c
A node.js module for accessing bit2c (the israeli bitcoin echange) API.

## Installing

<pre><code>
npm install bit2c
</code></pre>


## running the tests

If you want to run the tests that require access to the private API you should define 2 environment variables:
* BIT2C_KEY - your bit2c key
* BIT2C_SECRET - your bit2c key

These keys can be taken from your bit2c account. Just login -> API tab -> generate new.

Warning! - these keys grant access to your bit2c account! keep them safe!

For running the tests just clone the repository and then:
<pre><code>
npm install
npm test
</code></pre>

