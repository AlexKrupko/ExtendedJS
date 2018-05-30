# ExtendedJS
Small useful library for extending basic functionality of JavaScript. It contains a lot of extend features based on prototypes, different polyfills and helper functions.

Browsers support: Chrome 45+, FireFox 40+, Safari 8+, IE10+, iOS Safari 8+, Android Browser 4.4+.

Since 1.0.8 version the library exists lite version also without some functionality. This version was done specially for using with JavaScript frameworks such as AngularJS.  

### How to install
You need to include library javascript file from `dist` directory on your page
```html
<link rel="stylesheet" href="dist/css/DatePickerX.min.css">
<script src="dist/js/DatePickerX.min.js"></script>
``` 

### Library methods and properties
* `NodeList.prototype.indexOf( Element element )`, `HTMLCollection.prototype.indexOf( Element element )` - Returns element's index in elements collection or `-1` if element does'n find
* `Element.prototype.matches( String selector )` - Polyfill for `Element.matches` method. Returns `true` if element matches to selector else returns `false`
* `EventTarget.prototype.addEvent( [String selector], String events, Function handler, [Boolean capture=false] )`, `Window.prototype.addEvent( [String selector], String events, Function handler, [Boolean capture=false] )` - Attaches one or more space-separated event handlers for element
* `EventTarget.prototype.addEventOne( [String selector], String events, Function handler, [Boolean capture=false] )`, `Window.prototype.addEventOne( [String selector], String events, Function handler, [Boolean capture=false] )` - Attaches one or more space-separated event handlers for element which will be executed only one time    
* `EventTarget.prototype.triggerEvent( String event, [Boolean bubbles=true], [Boolean cancelable=true] )` - Triggers event on element
* `NodeList.prototype.addEvent( [String selector], String events, Function handler, [Boolean capture=false] )`, `HTMLCollection.prototype.addEvent( [String selector], String events, Function handler, [Boolean capture=false] )` - Attaches one or more space-separated event handlers for each element of the node list
* `NodeList.prototype.addEventOne( [String selector], String events, Function handler, [Boolean capture=false] )`, `HTMLCollection.prototype.addEventOne( [String selector], String events, Function handler, [Boolean capture=false] )` - Attaches one or more space-separated event handlers which will be executed only one time for each element of the node list   
* `NodeList.prototype.triggerEvent( String event, [Boolean bubbles=true], [Boolean cancelable=true] )`, `HTMLCollection.prototype.triggerEvent( String event, [Boolean bubbles=true], [Boolean cancelable=true] )` - Triggers event for each element of the node list
* `Element.prototype.getElements( Srting selector )` - Returns node list of elements selected by selector. Alias of `querySelectorAll`
* `NodeList.prototype.each( Function callback )`, `HTMLCollection.prototype.each( Function callback )` - Executes callback function one time for each element of list
* `Element.prototype.outerHeight` - Returns element's height including padding and border sizes
* `Element.prototype.fullOuterHeight` - Returns element's height including padding, border and margin sizes
* `Element.prototype.outerWidth` - Returns element's width including padding and border sizes
* `Element.prototype.fullOuterWidth` - Returns element's width including padding, border and margin sizes
* `DOMTokenList.prototype.contains( String ...className )` - Returns `true` if element contains all of passed class names, else returns `false`
* `DOMTokenList.prototype.containsOne( String ...className )` - Returns `true` if element contains at least one of passed class names, else returns `false`
* `DOMTokenList.prototype.toggle( String className, [Boolean condition] )` - Removes class from element and returns `false`. If class doesn't exist it's added and the returns true. If passed second parameter `condition` class will add if condition is `true` or will remove if condition is `false`
* `DOMTokenList.prototype.add( String ...className )` - Adds support multiple parameters for `classList.add` method in IE
* `DOMTokenList.prototype.remove( String ...className )` - Adds support multiple parameters for `classList.remove` method in IE
* `NodeList.prototype.classList.add( String ...className )` - Adds `classList.add` method into NodeList
* `NodeList.prototype.classList.remove( String ...className )` - Adds `classList.remove` method into NodeList
* `NodeList.prototype.classList.toggle( String className, [Boolean condition] )` - Adds `classList.toggle` method into NodeList
* `Element.prototype.remove()` - Removes current element  
* `NodeList.prototype.remove()`, `HTMLCollection.prototype.remove()` - Removes all elements in collection
* `Element.prototype.parent( [String selector] )` - Returns parent element or `null` if it doesn't exist. If passed selector then returns first parent element which matches to selector or `null` if such element doesn't exist
* `Element.prototype.parents( [String selector] )` - Returns list of all parent elements. If passed selector then returns only parent elements which match to selector
* `Element.prototype.next( [String selector] )` - Returns next element or `null` if next element doesn't exist. If passed selector then returns first next element which matches to selector or `null` if such element doesn't exist
* `Element.prototype.nextAll( [String selector] )` - Returns list of all next elements. If passed selector then returns only next elements which match to selector
* `Element.prototype.prev( [String selector] )` - Returns previous element or `null` if previous element doesn't exist. If passed selector then returns first previous element which matches to selector or `null` if such element doesn't exist
* `Element.prototype.prevAll( [String selector] )` - Returns list of all previous elements. If passed selector then returns only previous elements which match to selector
* `Element.prototype.childs( [String selector] )` - Returns list of all element's children. If passed selector then returns only children which match to selector
* `NodeList.prototype.filter( String selector )`, `HTMLCollection.prototype.filter( String selector )` - Filters NodeList and returns only elements which match selector
* `Node.prototype.insertAfter( Node newElement, Node referenceElement)` - Inserts the specified node after the reference node as a child of the current node
* `Node.prototype.prependChild( Node element )` -  Inserts the specified node as first child node of the current node
* `Node.prototype.insertBeforeCurrent( Node element )` - Inserts the specified node before current node
* `Node.prototype.insertAfterCurrent( Node element )` - Inserts the specified node after current node
* `Array.prototype.remove( item )` - Removes element from array. Returns `true` if item was found and removed
* `RegExp.escape( String string )` - Escapes special characters in passed string
* `window.ExtendedJS.cookies.get( String key )` - Returns value of requested cookie or null if such cookie doesn't exist
* `window.ExtendedJS.cookies.set( String key, value, [Date|Number expires], [String path], [String domain], [Boolean secure=false] )` - Sets cookie
* `window.ExtendedJS.cookies.delete( String key, [String path], [String domain] )` - Deletes cookie
* `window.ExtendedJS.cookies.exists( String key )` - Returns `true` if cookie exists, else returns `false`
* `window.ExtendedJS.scroll( Number scroll, [Number duration=0], [Function callback] )` - Scrolls page to passed position by Y axis with animation duration
* `window.ExtendedJS.ajax( [String uri], [Object options] )` - Executes AJAX request to uri with options
* `window.ExtendedJS.ajaxDefaults( Object options )` - Sets default value for ajax options


Objects `window.ExJS` and `window.exjs` are aliases for `window.ExtendedJS` object.

Lite version of ExtendedJS doesn't contain following: 
* objects `window.ExtendedJS`, `window.ExJS` and `window.exjs`
* methods `window.ExtendedJS.cookies.get`, `window.ExtendedJS.cookies.set`, `window.ExtendedJS.cookies.delete`, `window.ExtendedJS.cookies.exists`, `window.ExtendedJS.scroll`, `window.ExtendedJS.ajax` and `window.ExtendedJS.ajaxDefaults`
* properties `Element.prototype.outerHeight`, `Element.prototype.fullOuterHeight`, `Element.prototype.outerWidth` and `Element.prototype.fullOuterWidth`