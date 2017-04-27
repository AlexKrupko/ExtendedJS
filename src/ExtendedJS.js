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
     * Adds outerHeight, fullOuterHeight, outerWidth and fullOuterWidth properties to Element
     */
    Object.defineProperties(Element.prototype, {

        /**
         *  Returns element's height including padding and border sizes
         */
        outerHeight: {
            get: function()
            {
                return this.getBoundingClientRect().height;
            }
        },

        /**
         *  Returns element's height including padding, border and margin sizes
         */
        fullOuterHeight: {
            get: function()
            {
                var cs = getComputedStyle(this);
                return this.getBoundingClientRect().height + parseFloat(cs.getPropertyValue('margin-top')) + parseFloat(cs.getPropertyValue('margin-bottom'));
            }
        },

        /**
         *  Returns element's width including padding and border sizes
         */
        outerWidth: {
            get: function()
            {
                return this.getBoundingClientRect().width;
            }
        },

        /**
         *  Returns element's width including padding, border and margin sizes
         */
        fullOuterWidth: {
            get: function()
            {
                var cs = getComputedStyle(this);
                return this.getBoundingClientRect().width + parseFloat(cs.getPropertyValue('margin-left')) + parseFloat(cs.getPropertyValue('margin-right'));
            }
        }
    });

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


    var ajaxDefaults = {
        method      : 'GET',         // request method
        data        : {},            // object with request data or FormData
        headers     : {},            // object with headers
        async       : true,          // if true executes request asynchronously
        cache       : false,         // true for enable caching of request response. Doesn't work jsonp request
        cacheMaxAge : 300,           // expires time of response cache in seconds. Default 5 minutes
        jsonp       : false,         // true for jsonp request
        uri         : '',            // request uri
        contentType : '',            // type of data sending in request. Supports json or text
        dataType    : 'text',        // type of response data from request. Supports text, html or json
        beforeSend  : function() {}, // handler which will be called before request send
        success     : function() {}, // handler which will be called if request will execute successful
        error       : function() {}, // handler which will be called if request will end with error or get invalid response data
        complete    : function() {}, // handler which will be called after end of request independent of request results
        progress    : function() {}, // handler which will be called on each change of upload progress
        timeout     : 0,             // timeout limit for request
        timeoutError: function() {}, // handler which will be called if request will end by timeout limit
        abort       : function() {}, // handler which will be called if request will end by calling abort method
        username    : '',            // username for HTTP autorization
        password    : ''             // password for HTTP autorization
    };

    var ajaxCache = {};

    function ajaxParseParams(obj, keyPrefix)
    {
        var queryStr = [];
        for (var k in obj) {
            var key = encodeURIComponent(k);
            keyPrefix && (key = keyPrefix + '[' + key + ']');

            if (obj[k] instanceof Array) {
                for (var i = 0; i < obj[k].length; queryStr.push(key + '[' + i + ']=' + encodeURIComponent(obj[k][i++])) );
            } else if (obj[k] instanceof Object) {
                queryStr = queryStr.concat(ajaxParseParams(obj[k], key));
            } else {
                queryStr.push(key + '=' + encodeURIComponent(obj[k]));
            }
        }

        return queryStr;
    }

    window.ExtendedJS = window.ExJS = window.exjs = {
        /**
         *  Object for work with cookies
         */
        cookies: {
            /**
             *  Returns value of requested cookie or null if such cookie doesn't exist
             *
             *  @param  {String} key Cookie's key
             *  @return {String|null} Cookie's value or mull if such cookie doesn't exist
             */
            get: function(key)
            {
                var matches = document.cookie.match(new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[^\w%]/g, '\\$&') + '\\s*=\\s*([^;]*)(?:$|;)'));
                return matches ? decodeURIComponent(matches[1]) : null;
            },

            /**
             *  Sets cookie
             *
             *  @param {String}      key
             *  @param {*}           value
             *  @param {Date|Number} [expires] Date object with the expires date or Number with the time of cookie life
             *                                 in seconds. Can be Infinity what equals 31 Dec 9999 23:59:59 GMT
             *  @param {String}      [path]
             *  @param {String}      [domain]
             *  @param {Boolean}     [secure=false]
             */
            set: function(key, value, expires, path, domain, secure)
            {
                var parts = [encodeURIComponent(key) + '=' + encodeURIComponent(value)];

                if (expires) {
                    if (expires.constructor === Date) {
                        parts.push('expires=' + expires.toUTCString());
                    } else if (expires.constructor === Number) {
                        parts.push(expires === Infinity ? 'expires=Fri, 31 Dec 9999 23:59:59 GMT' : 'max-age=' + expires);
                    }
                }

                domain && parts.push('domain=' + domain);
                path && parts.push('path=' + path);
                secure && parts.push('secure');

                document.cookie = parts.join('; ');
            },

            /**
             *  Deletes cookie
             *
             *  @param {String} key
             *  @param {String} [path]
             *  @param {String} [domain]
             */
            delete: function(key, path, domain)
            {
                var parts = [encodeURIComponent(key) + '=', 'expires=Thu, 01 Jan 1970 00:00:00 GMT'];

                domain && parts.push('domain=' + domain);
                path && parts.push('path=' + path);

                document.cookie = parts.join('; ');
            },

            /**
             *  Returns true if cookie exists, else returns false
             *
             *  @param  {String}  key
             *  @return {Boolean}
             */
            exists: function(key)
            {
                return new RegExp('(?:^|;\\s*)' + encodeURIComponent(key).replace(/[^\w%]/g, '\\$&') + '=').test(document.cookie);
            }
        },

        /**
         *  Scrolls page to passed position by Y axis with animation duration
         *
         *  @param {Number}   scroll       Scroll position by Y axis
         *  @param {Number}   [duration=0] Animation duration
         *  @param {Function} [callback]   Callback function which will be called after scroll ending
         */
        scroll: function(scroll, duration, callback)
        {
            scroll = Math.round(scroll);
            duration = duration || 0;

            var steps       = duration > 0 ? Math.ceil(duration / 1000 * 30) : 1,
                stepScroll  = (scroll - window.scrollY) / steps,
                currentStep = 0;

            function step()
            {
                window.scrollTo(0, ++currentStep >= steps ? scroll : window.scrollY + stepScroll);
                currentStep < steps ? setTimeout(step, duration / steps) : (typeof callback === 'function' && callback());
            }
            step();
        },

        /**
         *  Executes AJAX request to uri with options
         *
         *  @param {String} [uri]     Host URI for request
         *  @param {Object} [options] Object with options and data of request
         *  @return {XMLHttpRequest|Boolean}
         */
        ajax: function(uri, options)
        {
            typeof options !== 'object' && (options = {});
            typeof uri === 'object' ? (options = uri) : (options.uri = uri);

            // parses options and sets properties
            var P = {};
            for (var i in ajaxDefaults) {
                P[i] = typeof options[i] === typeof ajaxDefaults[i] ? options[i] : ajaxDefaults[i];
            }

            // check uri
            if (typeof P.uri !== 'string' || !P.uri) {
                console.error('ExtendedJS: Invalid uri for AJAX');
                return false;
            }

            // JSONP request
            if (P.jsonp) {
                var callbackName = 'jsonp_callback_' + Math.round(1e6 * Math.random()),
                    script       = document.createElement('script');

                window[callbackName] = function(data)
                {
                    delete window[callbackName];
                    document.body.removeChild(script);
                    P.success(data);
                    P.complete(data);
                };

                script.src = P.uri.replace(/([?&])callback=[^&]*(&|$)/i, function(m, before, after)
                {
                    return after ? before : '';
                });
                script.src += (script.src.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
                document.body.appendChild(script);
                return true;
            }

            P.method = P.method.toUpperCase() || 'GET';

            // preparation data
            if (P.contentType.toLowerCase() === 'json') {
                P.data = JSON.stringify(P.data);
            } else {
                if (typeof P.data === 'string') {
                    var tmp = {};
                    P.data.replace(/([^&=]+)(?:=([^&=]*))?(?:&|$)/g, function(m, key, value)
                    {
                        tmp[key] = typeof value !== 'undefined' ? value : '';
                    });
                    P.data = tmp;
                }

                if (!(P.data instanceof FormData)) {
                    P.data = typeof P.data === 'object' ? ajaxParseParams(P.data).join('&') : '';
                    P.data && P.method !== 'POST' && (P.uri += (P.uri.indexOf('?') < 0 ? '?' : '&') + P.data);
                }
            }

            var xhr    = new XMLHttpRequest(),
                status = 'pending';

            xhr.triggerError = function()
            {
                if (status === 'cache') {
                    delete ajaxCache[P.cache];
                } else {
                    P.cache = false;
                }

                P.error(xhr, status);
            };

            // cache
            if (P.cache) {
                P.cache = 0;
                var key = P.uri + P.data + P.method;
                for (var i = 0; i < key.length; P.cache = (P.cache << 5) - P.cache + key.charCodeAt(i++));

                if (typeof ajaxCache[P.cache] === 'object' && ajaxCache[P.cache].expires > new Date()) {
                    status = 'cache';
                    var response = ajaxCache[P.cache].response;
                    response instanceof Element && (response = response.cloneNode(true).children);
                    P.beforeSend.call(xhr);
                    P.success.call(xhr, response, status);
                    P.complete.call(xhr, status);
                    return true;
                }
            }

            xhr.open(P.method, P.uri, P.async, P.username, P.password);
            xhr.onreadystatechange = function()
            {
                if (xhr.readyState === 4) {
                    var response = xhr.responseText;
                    status = 'error';

                    if (xhr.status >= 200 && xhr.status < 300) {
                        status = 'success';

                        if (P.dataType.toLowerCase() === 'json') {
                            try {
                                response = JSON.parse(response);
                            } catch (e) {
                                status = 'parseError';
                            }
                        } else if (P.dataType.toLowerCase() === 'html') {
                            var el = document.createElement('div');
                            el.innerHTML = response;
                            response = el.children;
                            var cacheResponse = el.cloneNode(true);
                        }
                    }

                    status === 'success' ? P.success.call(xhr, response, status) : P.error.call(xhr, status);
                    status === 'success' && P.cache && (ajaxCache[P.cache] = {
                        response: cacheResponse || response,
                        expires : Date.now() + P.cacheMaxAge * 1e3
                    });
                    P.complete.call(xhr, status);
                }
            };

            // timeout
            xhr.timeout = P.timeout;
            xhr.ontimeout = function()
            {
                P.timeoutError.call(xhr);
                P.complete.call(xhr, 'timeout');
            };

            // abort
            xhr.onabort = function()
            {
                P.abort.call(xhr);
                P.complete.call(xhr, 'abort');
            };

            // progress
            xhr.upload.addEventListener('progress', function(e)
            {
                P.progress.call(xhr, e.loaded / e.total * 100, e);
            });

            // headers
            P.headers['X-Requested-With'] = 'XMLHttpRequest';
            if (P.contentType.toLowerCase() === 'json') {
                P.headers['Content-Type'] = 'application/json';
            } else if (P.method === 'POST' && !(P.data instanceof FormData)) {
                P.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
            for (var h in P.headers) {
                xhr.setRequestHeader(h, P.headers[h]);
            }

            // send
            P.beforeSend(xhr);
            xhr.send(P.method === 'POST' ? P.data : null);

            return xhr;
        },

        /**
         *  Sets default value for ajax options
         *
         *  @param {Object} properties
         */
        ajaxDefaults: function(properties)
        {
            if (typeof properties === 'object') {
                for (var i in properties) {
                    typeof properties[i] === typeof ajaxDefaults[i] && (ajaxDefaults[i] = properties[i]);
                }
            }
        }
    };
}();