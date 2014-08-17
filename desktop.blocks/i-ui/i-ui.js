var UI = UI || {};


UI.Loadbar = function (options) {
    if (typeof options == 'undefined') options = {};

    var self = this, helpers = {}, el = $(options.elXPath).eq(0), options = $.extend({'steps': 5, 'stepStart': 2, 'stepCurrent': 1, 'speed': 500, 'classTemplate': 'b-step_'}, options);

    if (!options.elXPath || !el.length) throw new Error('UI.Loadbar: не задан элемент представления options.elXPath');

    this.el = el;
    this.classTemplate = options.classTemplate;
    this.stepStart = options.stepStart;
    this.stepMax = options.steps;
    this.stepCurrent = options.stepCurrent;
    this.speed = options.speed;
    this.animateInterval = false;
}

UI.Loadbar.prototype.setClass = function () {
    var classRegExp = new RegExp(this.classTemplate + '[0-9]{0,}', 'ig');
    this.el[0].className = this.el[0].className.replace(classRegExp, '');
    this.el.addClass(this.classTemplate + this.stepCurrent);
}

UI.Loadbar.prototype.animate = function () {
    this.stepCurrent += 1;
    if (this.stepCurrent > this.stepMax) this.stepCurrent = this.stepStart;
    this.setClass();
}

UI.Loadbar.prototype.play = function () {
    var self = this;
    this.animateInterval = setInterval(function () {
        self.animate();
    }, self.speed);
}

UI.Loadbar.prototype.stop = function () {
    clearInterval(this.animateInterval);
    this.stepCurrent = 1;
    this.setClass();
}


UI.Dragbar = function (options) {
    if (typeof options == 'undefined') options = {};

    var self = this, helpers = {}, el = $(options.elXPath).eq(0), options = $.extend({'position': 50, 'hasParentReaction': false, 'barActive': true, 'animate': true}, options);

    if (!options.elXPath || !el.length) throw new Error('UI.Dragbar: не задан элемент представления options.elXPath');

    this.el = el;
    this.bar = self.el.find('.js-handler-dragbar__bar');
    this.drag = self.el.find('.js-handler-dragbar-bar__drag').draggable({containment: 'parent', axis: 'x'});
    this.cache = {
        'el': {'width': self.el.width()},
        'drag': {'width': self.drag.width()}
    };

    helpers.init = function () {
        helpers.dragStartPosition();
    }

    // Рассчитывает и устанавливает изначальную позицию драга и его бара
    helpers.dragStartPosition = function () {
        helpers.dragUpdate(self.bar.width() * options.position / 100, true)
    }

    // Обновляем представление драгбара: значение, обновлять драг?, анимировать ли?
    helpers.dragUpdate = function (value, dragMove, animate) {
        if (typeof animate == 'undefined') animate = false;

        if (typeof value == 'undefined') return;

        if (dragMove) {
            self.drag.trigger('dragstart');
            self.drag[(animate) ? 'animate' : 'css']({'left': value},
                {
                    'step': function (now) {
                        self.drag.trigger('drag', {'position': {'left': now}});
                    },
                    'complete': function () {
                        self.drag.trigger('dragstop');
                    }
                });
        }

        if (options.hasParentReaction) self.bar[(animate) ? 'animate' : 'css']({'width': value + (self.drag.width() / 2)});
    }

    // Таскание драга
    self.drag.bind('drag', function (e, ui) {
        helpers.dragUpdate(ui.position.left);
    });

    // Клик по бару
    if (options.barActive) {
        self.el.bind('click.uidragbar', function (e) {
            var val = e.clientX - $(this).offset().left;
            val = (val > self.cache.el.width - self.cache.drag.width) ? self.cache.el.width - self.cache.drag.width : (val < 0) ? 0 : val; // проверяем пределы
            helpers.dragUpdate(val, true, true);
        });
    }

    helpers.init();

    return {
        'el': self.el,
        'bar': self.bar,
        'drag': self.drag,
        'cache': self.cache
    };
}