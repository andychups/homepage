var CONFIG = CONFIG || {};
CONFIG.lang = 'ru';
CONFIG.domain = document.domain.replace(/www\./, '');


var SYSTEM = SYSTEM || {};

SYSTEM.Extend = function (Child, Parent) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}

SYSTEM.History = window.History;

SYSTEM.Navigate = function (options) {
    if (typeof options == 'undefined') options = {};

    var self = this;

    options = $.extend({'content': '#js-nav__content', 'menuItems': '#js-menu .b-menu-item__link', 'menuItemCurrentClass': 'b-menu-item__link_current'}, options);

    this.body = $('body');
    this.content = $(options.content);
    this.menuItems = $(options.menuItems);
    this.menuItemCurrentClass = options.menuItemCurrentClass;
    this.stateClassWaiting = 'i-cursor-waiting';
    this.loadbar = new UI.Loadbar({'elXPath': '#js-loadbar', 'classTemplate': 'b-logo__name_animate_', 'speed': 750});
    this.requestProgress = false;


    function update(data, callback) {
        self.content.html(data).animate({'opacity': 1}, 1500, function () {
            callback();
            self.body.removeClass(self.stateClassWaiting);
            self.requestProgress = false;
        });
    }

    SYSTEM.History.Adapter.bind(window, 'statechange', function () {
        var state = SYSTEM.History.getState(), request;

        // SYSTEM.History.log('statechange:', state.data, state.title, state.url);

        self.requestProgress = true;
        self.body.addClass(self.stateClassWaiting);
        self.loadbar.play();
        self.content.animate({'opacity': 0}, 1000, function () {
            request = $.ajax({'type': 'POST', 'url': state.url, 'data': {'ajax': true}});

            request.done(function (data) {
                update(data, function () {
                    self.loadbar.stop();
                });
            });

            request.error(function (status) {
                update('<h1>Ошибка!</h1><p class="b-status b-status_warning"><span class="b-status__error">' + status.status + '</span> ' + status.statusText, function () {
                    self.loadbar.stop();
                });
            });

        });


        return false;
    });


    self.body.on('click.ajax', 'a', function () {
        return (self.requestProgress) ? false : self.update.call(this, self);
    });
}


SYSTEM.Navigate.prototype.update = function (self) {
    var el = $(this), title = el.attr('title'), url = el.attr('href'), domain = CONFIG.domain, exclude = /(http|https|mailto|skype)/gi.test(url), matches, request;

    matches = url.match(/^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/);

    if ((!exclude || (exclude && matches[6].indexOf(domain) > -1)) && url.indexOf('#') == -1) {
        SYSTEM.History.pushState({state: url, rand: Math.random()}, title, url);

        //self.menuItems.removeClass(self.menuItemCurrentClass);

        //if (el.hasClass('b-menu-item__link')) el.addClass(self.menuItemCurrentClass);

        return false;
    }
}