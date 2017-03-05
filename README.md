Experimenting with React, SVG and touch events.

http://terabaud.github.io/react-touch-events/

Experiencing some issues:

1. I'm unable to preventDefault in my onTouchMove event handler, so that dragging the point down causes a page reload on mobile. React warns about this with the message: `Unable to preventDefault inside passive event listener due to target being treated as passive. See https://www.chromestatus.com/features/5093566007214080`

2. In the touch event handlers, `e.changedTouches` is null. I have to use `e.nativeEvent.changedTouches` instead.

3. I wanted to convert changedTouches which is a `TouchList` into an `Array` via [spread operator](https://ponyfoo.com/articles/es6-spread-and-butter-in-depth), but it returns `[►TouchList] `instead of `[►Touch, ►Touch, ...]`. So, I'm using the old way via `Array.prototype.slice.call` for now.