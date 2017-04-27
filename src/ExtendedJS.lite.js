!function()
{
    'use strict';

    /**
     *  Returns element's index in elements collection or -1 if element does'n find
     *
     *  @param  {Element} element Element node for searching in NodeList
     *  @return {Number}
     */
    NodeList.prototype.indexOf = HTMLCollection.prototype.indexOf = function(element)
    {
        return element instanceof Element ? Array.prototype.indexOf.call(this, element) : -1;
    };

    /**
     *  Polyfill for Element.matches
     *  Returns true if element matches to selector else returns false
     *
     *  @param  {String}  selector The CSS selector with matches element
     *  @return {Boolean}
     */
    !Element.prototype.matches && function(e)
    {
        e.matches = e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || function(selector)
            {
                return document.querySelectorAll(selector).indexOf(this) >= 0;
            };
    } (Element.prototype);

    // events for IE
    var EventTarget = typeof EventTarget === 'undefined' ? Node : EventTarget;

    /**
     *  Attaches one or more space-separated event handlers for element
     *
     *  @param {String}   [selector]      The CSS selector of elements on which will attach event handler
     *  @param {String}   events          Single event or space-separated list of events on which will attach handler
     *  @param {Function} handler         Event handler
     *  @param {Boolean}  [capture=false] If sets to true, the event handler is executed in the capturing phase.
     *                                    By default event handler is executed in the bubbling phase
     */
    EventTarget.prototype.addEvent = Window.prototype.addEvent = function()
    {
        if (arguments.length < 2) {
            return console.error('ExtendedJS: Invalid amount of arguments. Method addEvent needs minimum 2 arguments.');
        }

        var args = Array.prototype.slice.call(arguments, 0, 4);
        typeof args[1] === 'function' && args.unshift(null);
        typeof args[3] === 'undefined' && (args[3] = false);
        args[1] = args[1].split(/\s+/);

        if (typeof args[2] !== 'function') {
            return console.error('ExtendedJS: Invalid callback function.');
        }

        for (var i = args[1].length; i--; ) {
            this.addEventListener(args[1][i], function(e)
            {
                if (args[0]) {
                    for (var element = e.target; element && element !== this && !element.matches(args[0]); element = element.parentNode);
                    element && element !== this && args[2].call(element, e);
                } else {
                    args[2].call(this, e);
                }
            }, args[3]);
        }
    };

    /**
     *  Attaches one or more space-separated event handlers for element which will be executed only one time
     *
     *  @param {String}   [selector]      The CSS selector of elements on which will attach event handler
     *  @param {String}   events          Single event or space-separated list of events on which will attach handler
     *  @param {Function} handler         Event handler
     *  @param {Boolean}  [capture=false] If sets to true, the event handler is executed in the capturing phase.
     *                                    By default event handler is executed in the bubbling phase
     */
    EventTarget.prototype.addEventOne = Window.prototype.addEventOne = function()
    {
        if (arguments.length < 2) {
            return console.error('ExtendedJS: Invalid amount of arguments. Method addEventOne needs minimum 2 arguments.');
        }

        var args = Array.prototype.slice.call(arguments, 0, 4);
        typeof args[1] === 'function' && args.unshift(null);
        typeof args[3] === 'undefined' && (args[3] = false);
        args[1] = args[1].split(/\s+/);

        if (typeof args[2] !== 'function') {
            return console.error('ExtendedJS: Invalid callback function.');
        }

        for (var i = args[1].length; i--; ) {
            !function(self, event)
            {
                var activatedElements = [];
                self.addEventListener(event, function(e)
                {
                    var element = this;
                    if (args[0]) {
                        for (element = e.target; element && element !== this && !element.matches(args[0]); element = element.parentNode);
                        if (!element || element === this) {
                            return;
                        }
                    }

                    activatedElements.indexOf(element) < 0 && activatedElements.push(element) && args[2].call(element, e);
                }, args[3]);
            } (this, args[1][i]);
        }
    };

    /**
     *  Triggers event on element
     *
     *  @param {String}  event             Is a string defining the type of event
     *  @param {Boolean} [bubbles=true]    Is a boolean defining the ability of event to bubble up
     *  @param {Boolean} [cancelable=true] Is a boolean defining the ability of event to be canceled
     */
    EventTarget.prototype.triggerEvent = function(event, bubbles, cancelable)
    {
        typeof bubbles === 'undefined' && (bubbles = true);
        typeof cancelable === 'undefined' && (cancelable = true);
        var e = document.createEvent('Event');
        e.initEvent(event, bubbles, cancelable);
        this.dispatchEvent(e)
    };

    /**
     *  Attaches one or more space-separated event handlers for each element of the node list
     *
     *  @param {String}    [selector]     The CSS selector of elements on which will attach event handler
     *  @param {String}    events         Single event or space-separated list of events on which will attach handler
     *  @param {Function}  handler        Event handler
     *  @param {Boolean}  [capture=false] If sets to true, the event handler is executed in the capturing phase.
     *                                    By default event handler is executed in the bubbling phase
     */
    NodeList.prototype.addEvent = HTMLCollection.prototype.addEvent = function()
    {
        var args = arguments;
        this.each(function()
        {
            EventTarget.prototype.addEvent.apply(this, args);
        });
    };

    /**
     *  Attaches one or more space-separated event handlers which will be executed only one time for each element of the node list
     *
     *  @param {String}   [selector]      The CSS selector of elements on which will attach event handler
     *  @param {String}   events          Single event or space-separated list of events on which will attach handler
     *  @param {Function} handler         Event handler
     *  @param {Boolean}  [capture=false] If sets to true, the event handler is executed in the capturing phase.
     *                                    By default event handler is executed in the bubbling phase
     */
    NodeList.prototype.addEventOne = HTMLCollection.prototype.addEventOne = function()
    {
        var args = arguments;
        this.each(function()
        {
            EventTarget.prototype.addEventOne.apply(this, args);
        });
    };

    /**
     *  Triggers event for each element of the node list
     *
     *  @param {String}  event             Is a string defining the type of event
     *  @param {Boolean} [bubbles=true]    Is a boolean defining the ability of event to bubble up
     *  @param {Boolean} [cancelable=true] Is a boolean defining the ability of  event to be canceled
     */
    NodeList.prototype.triggerEvent = HTMLCollection.prototype.triggerEvent = function(event, bubbles, cancelable)
    {
        this.each(function()
        {
            EventTarget.prototype.triggerEvent.call(this, event, bubbles, cancelable);
        });
    };

    /**
     *  Returns node list of elements selected by selector
     *  Alias of querySelectorAll
     *
     *  @param {String}    selector The CSS selector
     *  @return {NodeList} List of elements
     */
    Element.prototype.getElements = Document.prototype.getElements = function(selector)
    {
        return this.querySelectorAll(selector);
    };

    /**
     *  Executes callback function one time for each element of list
     *  Variable "this" in callback function contains itself element
     *  Element index passes in callback function as first parameter
     *
     *  @param {Function} callback Function which will call for each element of list
     *  @retrun {NodeList|HTMLCollection}
     */
    NodeList.prototype.each = HTMLCollection.prototype.each = function(callback)
    {
        if (typeof callback !== 'function') {
            return console.error('ExtendedJS: Invalid callback function.');
        }

        for (var i = 0; i < this.length; callback.call(this[i], i++));

        return this;
    };

    /**
     *  Returns true if element contains all of passed class names, else returns false
     *
     *  @param  {...String} className
     *  @return {Boolean}
     */
    DOMTokenList.prototype.contains = function(className)
    {
        var classes = Array.prototype.slice.call(this);
        for (var i = arguments.length; i--; ) {
            if (classes.indexOf(arguments[i]) < 0) {
                return false;
            }
        }

        return true;
    };

    /**
     *  Returns true if element contains at least one of passed class names, else returns false
     *
     *  @param  {...String} className
     *  @return {Boolean}
     */
    DOMTokenList.prototype.containsOne = function(className)
    {
        var classes = Array.prototype.slice.call(this);
        for (var i = arguments.length; i--; ) {
            if (classes.indexOf(arguments[i]) >= 0) {
                return true;
            }
        }

        return false;
    };

    /**
     *  Removes class from element and returns false. If class doesn't exist it's added and the returns true
     *  If passed second parameter "condition" class will add if condition is true or will remove if condition is false
     *
     *  @param  {String}  className
     *  @param  {Boolean} [condition]
     *  @return {Boolean} True if class was added or false if wasn't
     */
    DOMTokenList.prototype.toggle = function(className, condition)
    {
        condition === undefined && (condition = !this.contains(className));
        this[condition ? 'add' : 'remove'](className);

        return condition;
    };

    /**
     *  Adds support multiple parameters for classList.add and classList.remove methods in IE
     */
    var element = document.createElement('div');
    element.classList.add('a', 'b');
    if (!element.classList.contains('b')) {
        var originalAdd    = DOMTokenList.prototype.add,
            originalRemove = DOMTokenList.prototype.remove;

        DOMTokenList.prototype.add = function(a)
        {
            Array.prototype.forEach.call(arguments, originalAdd.bind(this));
        };

        DOMTokenList.prototype.remove = function(a)
        {
            Array.prototype.forEach.call(arguments, originalRemove.bind(this));
        };
    }

    /**
     *  Adds classList object with add, remove and toggle methods into NodeList
     */
    function ClassListForNodeList(nodeList)
    {
        return {
            add: function(className)
            {
                for (var elIndex = nodeList.length; elIndex--; ) {
                    for (var i = arguments.length; i--; nodeList[elIndex].classList.add(arguments[i]));
                }
            },
            remove: function(className)
            {
                for (var elIndex = nodeList.length; elIndex--; ) {
                    for (var i = arguments.length; i--; nodeList[elIndex].classList.remove(arguments[i]));
                }
            },
            toggle: function(className, condition)
            {
                for (var elIndex = nodeList.length; elIndex--; nodeList[elIndex].classList.toggle(className, condition));
            }
        }
    }
    var classListObj = {
        get: function()
        {
            return this.classList = new ClassListForNodeList(this);
        },
        set: function() {}
    };
    Object.defineProperty(NodeList.prototype, 'classList', classListObj);
    Object.defineProperty(HTMLCollection.prototype, 'classList', classListObj);

    /**
     *  Removes current element
     */
    Element.prototype.remove = function()
    {
        this.parentNode && this.parentNode.removeChild(this);
    };

    /**
     *  Removes all elements from NodeList
     */
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function()
    {
        this.each(Element.prototype.remove);
    };

    /**
     * Finds elements by data-exjs-element attribute and returns this collection
     *
     * @return {NodeList}
     */
    function getExjsElements()
    {
        return this.querySelectorAll('[data-exjs-element]').each(function()
        {
            this.removeAttribute('data-exjs-element');
        });
    }

    /**
     *  Returns parent element or null if it doesn't exist
     *  If passed selector then returns first parent element which matches to selector or null if such element doesn't exist
     *
     *  @param  {String} [selector]
     *  @return {Element|null}
     */
    Element.prototype.parent = function(selector)
    {
        var element = this.parentElement;
        if (selector) {
            for ( ; element && !element.matches(selector); element = element.parentElement);
        }

        return element;
    };

    /**
     *  Returns list of all parent elements
     *  If passed selector then returns only parent elements which match to selector
     *
     *  @param  {String} [selector]
     *  @return {NodeList}
     */
    Element.prototype.parents = function(selector)
    {
        for (var el = this; el = el.parentElement; (!selector || el.matches(selector)) && (el.setAttribute('data-exjs-element', '1')));

        return getExjsElements.call(document);
    };

    /**
     *  Returns next element or null if next element doesn't exist
     *  If passed selector then returns first next element which matches to selector or null if such element doesn't exist
     *
     *  @param  {String} [selector]
     *  @return {Element|null}
     */
    Element.prototype.next = function(selector)
    {
        var element = this.nextElementSibling;
        if (selector) {
            for ( ; element && !element.matches(selector); element = element.nextElementSibling);
        }

        return element;
    };

    /**
     *  Returns list of all next elements
     *  If passed selector then returns only next elements which match to selector
     *
     *  @param  {String} [selector]
     *  @return {NodeList}
     */
    Element.prototype.nextAll = function(selector)
    {
        for (var el = this; el = el.nextElementSibling; (!selector || el.matches(selector)) && (el.setAttribute('data-exjs-element', '1')));

        return getExjsElements.call(this.parentNode || document);
    };

    /**
     *  Returns previous element or null if previous element doesn't exist
     *  If passed selector then returns first previous element which matches to selector or null if such element doesn't exist
     *
     *  @param  {String} [selector]
     *  @return {Element|null}
     */
    Element.prototype.prev = function(selector)
    {
        var element = this.previousElementSibling;
        if (selector) {
            for ( ; element && !element.matches(selector); element = element.previousElementSibling);
        }

        return element;
    };

    /**
     *  Returns list of all previous elements
     *  If passed selector then returns only previous elements which match to selector
     *
     *  @param  {String} [selector]
     *  @return {NodeList}
     */
    Element.prototype.prevAll = function(selector)
    {
        for (var el = this; el = el.previousElementSibling; (!selector || el.matches(selector)) && (el.setAttribute('data-exjs-element', '1')));

        return getExjsElements.call(this.parentNode || document);
    };

    /**
     *  Returns list of all element's children
     *  If passed selector then returns only children which match to selector
     *
     *  @param  {String} [selector]
     *  @return {NodeList}
     */
    Element.prototype.childs = function(selector)
    {
        this.children.each(function()
        {
            (!selector || this.matches(selector)) && (this.setAttribute('data-exjs-element', '1'));
        });

        return getExjsElements.call(this);
    };

    /**
     *  Filters NodeList and returns only elements which match selector
     *
     *  @param  {String} selector
     *  @return {NodeList}
     */
    NodeList.prototype.filter = HTMLCollection.prototype.filter = function(selector)
    {
        this.each(function()
        {
            this.matches(selector) && (this.setAttribute('data-exjs-element', '1'));
        });

        return getExjsElements.call(document); // TODO: not worked for not inserted into DOM elements (issue #26)
    };

    /**
     *  Inserts the specified node after the reference node as a child of the current node
     *
     *  @param {Node} newElement
     *  @param {Node} referenceElement
     */
    Node.prototype.insertAfter = function(newElement, referenceElement)
    {
        referenceElement = referenceElement.next();
        referenceElement ? this.insertBefore(newElement, referenceElement) : this.appendChild(newElement);
    };

    /**
     *  Inserts the specified node as first child node of the current node
     *
     *  @param {Node} element
     */
    Node.prototype.prependChild = function(element)
    {
        this.firstChild ? this.insertBefore(element, this.firstChild) : this.appendChild(element);
    };

    /**
     *  Inserts the specified node before current node
     *
     *  @param {Node} element
     */
    Node.prototype.insertBeforeCurrent = function(element)
    {
        this.parentNode.insertBefore(element, this);
    };

    /**
     *  Inserts the specified node after current node
     *
     *  @param {Node} element
     */
    Node.prototype.insertAfterCurrent = function(element)
    {
        this.parentNode.insertAfter(element, this);
    };

    /**
     *  Removes element from array
     *  Returns true if item was found and removed
     *
     *  @param {*} item
     *  @return {Boolean}
     */
    Array.prototype.remove = function(item)
    {
        var index = this.indexOf(item);
        index >= 0 && this.splice(index, 1);

        return index >= 0;
    };

    /**
     * Escapes special characters in passed string
     *
     * @param {String} string
     * @return {String}
     */
    RegExp.escape = function(string)
    {
        return string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };
}();