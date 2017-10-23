# memo

Simple memoization.

## Installation

    npm install mhingston/memo
    
## Usage

```javascript
const memo = require('memo');

function myFunc(a, b)
{
    return a + b;
}

const memoizedFunc = memo(myFunc);
memoizedFunc(1, 2); // 3 (uncached)
memoizedFunc(1, 2); // 3 (cached)
```
## Function: memo

### memo(fn, options)

* `fn` {Function} Function to memoize.
* `options` {Object} Configuration object with the following properties:
  * `cacheSize` {Number} How many function calls to cache. Default = `100`.
  * `cacheDuration` {Number} How long until a cached value expires (milliseconds). Default = `300000` (5 minutes).

## Gotchas

When wrapping a function which uses `this` remember to bind `this` on your memoized function.

```javascript
function myFunc(a, b)
{
    return this.getTime() + a + b;
}

const memoizedFunc = memo(myFunc).bind(new Date());
memoizedFunc(1, 2); // (uncached)
memoizedFunc(1, 2); // (cached)