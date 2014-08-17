var MEDIA = MEDIA || {};

MEDIA.Player = function () {
};

MEDIA.Player.prototype.modelGetFile = function (filetype, url) {
    var prev = this.currentSongIndex, files = this.files, rand;

    function random() {
        rand = Math.round(Math.random() * (files.length - 1));

        if (rand == prev) random();

        return rand;
    }

    this.currentSongIndex = random();

    return files[rand];
};

MEDIA.Player.prototype.modelVolumeUpdate = function (position) {
    if (typeof once == 'undefined') once = false;

    var volume, max = this.volumeControl.cache.el.width - this.volumeControl.cache.drag.width,
        position = position - (Number(this.volumeControl.el.css('padding-left').split('px')[0]) + Number(this.volumeControl.el.css('padding-right').split('px')[0])) / 2;

    volume = Math.ceil(position / max * 100);

    switch (volume) {
        case 0:
            this.flash.pause();
            break;
        default:
        {
            this.flash.setVolume(volume);
            if (this.flash.getState() == 4) this.flash.play();
        }
    }

    this.volumeDefault = volume;
    this.viewVolumeUpdate(volume);

    return volume;
};

MEDIA.Player.prototype.modelVolumeSaveByCookie = function () {
    var self = this;
    $.cookie('MEDIA.Player.volume', self.volumeDefault);
}


MEDIA.Player.prototype.modelSetFile = function (file, autoplay) {
    if (typeof autoplay == 'undefined') autoplay = false;

    if (file == 'random') file = this.modelGetFile();

    this.viewObserve('fileload');
    this.flash.setClip({'url': file.source, 'autoPlay': autoplay});
    this.currentSong = file;

    if (autoplay) this.flash.play();
}

MEDIA.Player.prototype.modelObserve = function () {
    var self = this;

    self.flash.onError(function (errorCode, errorMessage) {
        throw new Error(errorCode + ': ' + errorMessage);
    });

    self.flash.onBegin(function () {
        self.viewObserve('fileloaded');
    });

    self.flash.onStart(function () {
        self.viewObserve('filestart');
    });

    self.flash.onFinish(function () {
        self.viewObserve('fileend');
    });
}


MEDIA.Player.prototype.viewUpdateFileInfo = function () {
}

MEDIA.Player.prototype.viewLocale = {
    'ru': {'pause': 'Пауза', 'loading': 'Загрузка...', 'success': 'Успешно! Ю-ху!'},
    'en': {'pause': 'Pause', 'loading': 'Loading...', 'success': 'Success! Woo Hoo!'}
}

MEDIA.Player.prototype.viewVolumeUpdate = function (volume) {
    var status = (volume == 0) ? this.viewLocale[this.lang].pause : volume + '%';
    this.viewSetStatus(status);
};

MEDIA.Player.prototype.viewToggleStatus = function (action) {
    if (typeof action == 'undefined') action = 'show';

    this.label[(action == 'show') ? 'addClass' : 'removeClass'](this.labelActiveClass);
}

MEDIA.Player.prototype.viewSetStatus = function (status) {
    this.labelStatus.text(status);
}

MEDIA.Player.prototype.viewUIBlock = function (status) {
    if (typeof status == 'undefined') status = 'block';

    if (status == 'block')
        this.el.addClass(this.blockUIClass);
    else
        this.el.removeClass(this.blockUIClass);
}

MEDIA.Player.prototype.viewObserve = function (event, value) {
    if (typeof value == 'undefined') value = false;

    var self = this;

    switch (event) {
        case 'fileload':
            self.viewSetStatus(self.viewLocale[self.lang].loading);
            self.viewUIBlock();
            self.viewToggleStatus('show');
            break;
        case 'fileloaded':
            self.viewSetStatus(self.viewLocale[self.lang].success);
            self.viewUpdateFileInfo();
            self.viewUIBlock('unblock');
            break;
        case 'filestart':
            self.viewToggleStatus('hide');
            break;
        case 'fileend':
            self.modelSetFile('random', true);
            break;
    }
}


MEDIA.Audio = function (options) {
    var self = this, song, el = $(options.elXPath).eq(0), options = $.extend(
        {
            'startFile': false,
            'flashPlayerXPath': '.js-handler-mediaplayer-flash',
            'flowplayer': {'core': 'apps/media/flowplayer-3.2.7.swf', 'audio': 'apps/media/flowplayer.audio-3.2.2.swf'},
            'labelXPath': '.b-mediaplayer__label',
            'labelActiveClass': 'b-mediaplayer__label_state_show-status',
            'labelNameXPath': '.b-mediaplayer-label__name',
            'labelStatusXPath': '.b-mediaplayer-label__status',
            'blockUIClass': 'b-mediaplayer_ui-block',
            'volume': true,
            'volumeValue': 25,
            'volumeXPath': '.js-handler-dragbar',
            'lang': CONFIG.lang,
            'autoplay': false
        }, options);

    if (!options.elXPath || !el.length) throw new Error('MEDIA.Audio: не задан элемент представления options.elXPath');

    this.el = el;
    this.flash = flowplayer(self.el.find(options.flashPlayerXPath)[0], options.flowplayer.core, {'plugins': {'audio': {'url': options.flowplayer.audio}}});
    this.volumeDefault = $.cookie('MEDIA.Player.volume') || options.volumeValue;
    this.volumeControl = new UI.Dragbar({'elXPath': el.find(options.volumeXPath), 'position': self.volumeDefault, 'hasParentReaction': true});
    this.label = self.el.find(options.labelXPath);
    this.labelStatus = self.label.find(options.labelStatusXPath);
    this.labelName = self.label.find(options.labelNameXPath);
    this.labelActiveClass = options.labelActiveClass;
    this.blockUIClass = options.blockUIClass;
    this.files = options.files || false;
    this.currentSong = false;
    this.currentSongIndex = -1;
    this.lang = options.lang;


    self.volumeControl.drag.bind('dragstart drag dragstop',function (e, ui) {
        switch (e.type) {
            case 'dragstart':
                self.label.addClass(self.labelActiveClass);
                break;

            case 'drag':
                self.modelVolumeUpdate(ui.position.left);
                break;

            case 'dragstop':
                self.label.removeClass(self.labelActiveClass);
                self.modelVolumeSaveByCookie();
                break;
        }
    }).click(function () {
        return false;
    });

    self.viewSetStatus(self.viewLocale[self.lang].loading);

    self.flash.load(function () {
        self.modelObserve();
        self.flash.setVolume(self.volumeDefault);

        if (self.files.length) self.modelSetFile(self.modelGetFile(), options.autoplay);
    });

}

SYSTEM.Extend(MEDIA.Audio, MEDIA.Player);

MEDIA.Audio.prototype.viewUpdateFileInfo = function () {
    this.labelName.html(this.currentSong.artist + ' &ndash; ' + this.currentSong.title);
    this.viewAnimateLabelFileInfo(3000);
}

MEDIA.Audio.prototype.viewAnimateLabelFileInfo = function (speed) {
    var self = this, wrapperWidth = self.label.width(), innerWidth = self.labelName.width(), diff;

    if (innerWidth <= wrapperWidth) return false;

    diff = innerWidth - (wrapperWidth - 15);

    function animate() {
        self.labelName.animate({'margin-left': -diff}, speed, 'linear', function () {
            self.labelName.animate({'margin-left': 15}, speed, 'linear', animate);
        });
    }

    animate();
}