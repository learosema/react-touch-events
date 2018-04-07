Experimenting with React, SVG and touch events.

http://terabaud.github.io/react-touch-events/

## Experiencing some issues in Chrome:

1. I'm unable to preventDefault in my onTouchMove event handler, so that dragging the point down causes a page reload on mobile. React warns about this with the message: `Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080` [browse issue](https://bugs.chromium.org/p/chromium/issues/detail?id=639227)

2. In the touch event handlers, `e.changedTouches` is null. I have to use `e.nativeEvent.changedTouches` instead.

3. I wanted to convert changedTouches which is a `TouchList` into an `Array` via [spread operator](https://ponyfoo.com/articles/es6-spread-and-butter-in-depth), but it returns `[►TouchList] `instead of `[►Touch, ►Touch, ...]`. So, I'm using the old way via `Array.prototype.slice.call` for now.


## Side note: 

To keep things simple, there is no module build system, It just includes React via script tag and uses [babel-standalone](https://github.com/babel/babel-standalone) for es2015/jsx transpilation

### Note to myself

Have a look at https://github.com/jquery/PEP and the [React Pointable component](https://www.npmjs.com/package/react-pointable)
