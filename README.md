Accelosketch 0.1
================

Draw with your accelerometer! Open index.html in Chrome, click anywhere to create brushes, and move your device around to draw. And don't drop it! :-)

Requirements
------------

**Laptops**

- Google Chrome 7 or higher
- A machine with an accelerometer, [Sudden Motion Sensor](http://en.wikipedia.org/wiki/Sudden_Motion_Sensor "Sudden Motion Sensor - Wikipedia, the free encyclopedia"), or any other Chrome-supported device orientation sensor

**Other devices**

I've only personally tested this on a MacBook Pro. It may also work on iOS 4.2 (iPhone 4 and iPad 2) and certain tablet devices.

To-do
-----

- Add support for different colors (black on off-white is depressing)
- Control brush sizes
- Reposition walls on browser resize
- Rework mechanism for shape trails

Credits
-------

- Uses [Box2DJS](http://box2d-js.sourceforge.net/ "Box2DJS - Physics Engine for JavaScript"), a port of the [Box2D C++ physics engine](http://www.box2d.org/ "Box2D - Home")
- Object drawing and physics implementation adapted from a [Box2DJS tutorial by Tony Lukasavage](http://savagelook.com/blog/code/box2d-js-physics-in-html5-javascript-guide "SavageLook.com  &raquo; Box2D JS &#8211; Physics in HTML5 &amp; Javascript Guide")
- Accelerometer support adapted from [mrdoob's awesome Ball Pool experiment](http://mrdoob.com/projects/chromeexperiments/ball_pool/ "Ball Pool")