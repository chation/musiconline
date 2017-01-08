/**
 * jquery.cxassette.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

(function (window, $, undefined) {

    var aux = {

        getSupportedType: function () {

            var audio = document.createElement('audio');

            if (audio.canPlayType('audio/mpeg;')) {

                return 'mp3';

            }
            else if (audio.canPlayType('audio/ogg;')) {

                return 'ogg';

            }
            else {

                return 'wav';

            }

        }

    };

    // Cassette obj
    $.Cassette = function (options, element) {

        this.$el = $(element);
        this._init(options);

    };

    $.Cassette.defaults = {
        // song names. Assumes the path of each song is songs/name.filetype
        songs: ['五月天-如果我们不曾相遇', '五月天-兄弟', '五月天-任意门', '五月天-后来的我们', '五月天-成名在望', '五月天-好好', '五月天-派对动物', '五月天-终于结束的起点'],
        fallbackMessage: 'HTML5 audio not supported',
        // initial sound volume
        initialVolume: 0.7
    };

    $.Cassette.prototype = {

        _init: function (options) {

            var _self = this;

            // the options
            this.options = $.extend(true, {}, $.Cassette.defaults, options);

            // current side of the tape
            this.currentSide = 1;
            // current time of playing side
            this.cntTime = 0;
            // current sum of the duration of played songs
            this.timeIterator = 0;
            // used for rewind / forward
            this.elapsed = 0.0;
            // action performed
            this.lastaction = '';
            // if play / forward / rewind active..
            this.isMoving = false;

            this.$loader = this.$el.find('div.vc-loader').show();

            // create cassette sides
            $.when(this._createSides()).done(function () {

                _self.$loader.hide();

                // create player
                _self._createPlayer();
                _self.sound = new $.Sound();
                // load events
                _self._loadEvents();

            });

        },
        _getSide: function () {

            return ( this.currentSide === 1 ) ? {
                current: this.side1,
                reverse: this.side2
            } : {
                current: this.side2,
                reverse: this.side1
            };

        },
        // songs are distributed equally on both sides
        _createSides: function () {

            var playlistSide1 = [],
                playlistSide2 = [],
                _self = this,
                cnt = 0;

            return $.Deferred(
                function (dfd) {

                    for (var i = 0, len = _self.options.songs.length; i < len; ++i) {

                        var song = new $.Song(_self.options.songs[i], i);

                        $.when(song.loadMetadata()).done(function (song) {

                            ( song.id < len / 2 ) ? playlistSide1.push(song) : playlistSide2.push(song);

                            ++cnt;

                            if (cnt === len) {

                                // two sides, each side with multiple songs
                                _self.side1 = new $.Side('side1', playlistSide1, 'start'),
                                    _self.side2 = new $.Side('side2', playlistSide2, 'end');

                                dfd.resolve();

                            }

                        });

                    }

                }
            ).promise();

        },
        _createPlayer: function () {

            // create HTML5 audio element
            this.$audioEl = $('<audio id="audioElem"><span>' + this.options.fallbackMessage + '</span></audio>');
            this.$el.prepend(this.$audioEl);

            this.audio = this.$audioEl.get(0);

            // create custom controls
            this._createControls();

            this.$theTape = this.$el.find('div.vc-tape');
            this.$wheelLeft = this.$theTape.find('div.vc-tape-wheel-left');
            this.$wheelRight = this.$theTape.find('div.vc-tape-wheel-right');
            this.$tapeSideA = this.$theTape.find('div.vc-tape-side-a').show();
            this.$tapeSideB = this.$theTape.find('div.vc-tape-side-b');

        },
        _createControls: function () {

            var _self = this;

            this.$controls = $('<ul class="vc-controls" style="display:none;"/>');

            this.$cPlay = $('<li class="vc-control-play">播放<span></span></li>');
            this.$cRewind = $('<li class="vc-control-rewind">快退<span></span></li>');
            this.$cForward = $('<li class="vc-control-fforward">快进<span></span></li>');
            this.$cStop = $('<li class="vc-control-stop">停止<span></span></li>');
            this.$cSwitch = $('<li class="vc-control-switch">翻面<span></span></li>');

            this.$controls.append(this.$cPlay)
                .append(this.$cRewind)
                .append(this.$cForward)
                .append(this.$cStop)
                .append(this.$cSwitch)
                .appendTo(this.$el);

            this.$volume = $('<div style="display:none;" class="vc-volume-wrap"><div class="vc-volume-control"><div class="vc-volume-knob"></div></div></div> ').appendTo(this.$el);

            if (document.createElement('audio').canPlayType) {

                if (!document.createElement('audio').canPlayType('audio/mpeg') && !document.createElement('audio').canPlayType('audio/ogg')) {

                    // TODO: flash fallback!

                }
                else {

                    this.$controls.show();
                    this.$volume.show();
                    this.$volume.find('div.vc-volume-knob').knobKnob({
                        snap: 10,
                        value: 359 * this.options.initialVolume,
                        turn: function (ratio) {

                            _self._changeVolume(ratio);

                        }
                    });

                    this.audio.volume = this.options.initialVolume;
                }

            }

        },
        _loadEvents: function () {

            var _self = this;

            this.$cSwitch.on('mousedown', function (event) {

                _self._setButtonActive($(this));
                _self._switchSides();

            });

            this.$cPlay.on('mousedown', function (event) {

                _self._setButtonActive($(this));
                _self._play();

            });

            this.$cStop.on('mousedown', function (event) {

                _self._setButtonActive($(this));
                _self._stop();

            });

            this.$cForward.on('mousedown', function (event) {

                _self._setButtonActive($(this));
                _self._forward();

            });

            this.$cRewind.on('mousedown', function (event) {

                _self._setButtonActive($(this));
                _self._rewind();

            });

            this.$audioEl.on('timeupdate', function (event) {

                _self.cntTime = _self.timeIterator + _self.audio.currentTime;
                var wheelVal = _self._getWheelValues(_self.cntTime);
                _self._updateWheelValue(wheelVal);

            });

            this.$audioEl.on('loadedmetadata', function (event) {

            });

            this.$audioEl.on('ended', function (event) {

                _self.timeIterator += _self.audio.duration;
                _self._play();

            });

        },
        _setButtonActive: function ($button) {

            // TODO. Solve! For now:
            $button.addClass('vc-control-pressed');

            setTimeout(function () {

                $button.removeClass('vc-control-pressed');

            }, 100);

        },
        _updateAction: function (action) {

            this.lastaction = action;

        },
        _prepare: function (song) {

            this._clear();
            this.$audioEl.attr('src', song.getSource(aux.getSupportedType()));

        },
        _switchSides: function () {

            if (this.isMoving) {

                alert('按不下去..请先停止播放再按一次?');
                return false;

            }

            this.sound.play('switch');

            var _self = this;

            this.lastaction = '';

            if (this.currentSide === 1) {

                this.currentSide = 2;

                this.$theTape.css({
                    '-webkit-transform': 'rotate3d(0, 1, 0, 180deg)',
                    '-moz-transform': 'rotate3d(0, 1, 0, 180deg)',
                    '-o-transform': 'rotate3d(0, 1, 0, 180deg)',
                    '-ms-transform': 'rotate3d(0, 1, 0, 180deg)',
                    'transform': 'rotate3d(0, 1, 0, 180deg)'
                });

                setTimeout(function () {

                    _self.$tapeSideA.hide();
                    _self.$tapeSideB.show();

                    // update wheels
                    _self.cntTime = _self._getPosTime();

                }, 200);

            }
            else {

                this.currentSide = 1;

                this.$theTape.css({
                    '-webkit-transform': 'rotate3d(0, 1, 0, 0deg)',
                    '-moz-transform': 'rotate3d(0, 1, 0, 0deg)',
                    '-o-transform': 'rotate3d(0, 1, 0, 0deg)',
                    '-ms-transform': 'rotate3d(0, 1, 0, 0deg)',
                    'transform': 'rotate3d(0, 1, 0, 0deg)'
                });

                setTimeout(function () {

                    _self.$tapeSideB.hide();
                    _self.$tapeSideA.show();

                    // update wheels
                    _self.cntTime = _self._getPosTime();

                }, 200);

            }

        },
        _updateButtons: function (button) {

            var pressedClass = 'vc-control-active';

            this.$cPlay.removeClass(pressedClass);
            this.$cStop.removeClass(pressedClass);
            this.$cRewind.removeClass(pressedClass);
            this.$cForward.removeClass(pressedClass);

            switch (button) {

                case 'play'        :
                    this.$cPlay.addClass(pressedClass);
                    break;
                case 'rewind'    :
                    this.$cRewind.addClass(pressedClass);
                    break;
                case 'forward'    :
                    this.$cForward.addClass(pressedClass);
                    break;

            }

        },
        _changeVolume: function (ratio) {

            this.audio.volume = ratio;

        },
        _play: function () {

            var _self = this;

            this._updateButtons('play');

            $.when(this.sound.play('click')).done(function () {

                var data = _self._updateStatus();

                if (data) {

                    _self._prepare(_self._getSide().current.getSong(data.songIdx));

                    _self.$audioEl.on('canplay', function (event) {

                        $(this).off('canplay');

                        _self.audio.currentTime = data.timeInSong;
                        _self.audio.play();
                        _self.isMoving = true;

                        _self._setWheelAnimation('2s', 'play');

                    });

                }

            });

        },
        _updateStatus: function (buttons) {

            var posTime = this.cntTime;

            // first stop
            this._stop(true);

            this._setSidesPosStatus('middle');

            // the current time to play is this.cntTime +/- [this.elapsed]
            if (this.lastaction === 'forward') {

                posTime += this.elapsed;

            }
            else if (this.lastaction === 'rewind') {

                posTime -= this.elapsed;

            }

            // check if we have more songs to play on the current side..
            if (posTime >= this._getSide().current.getDuration()) {

                this._stop(buttons);
                this._setSidesPosStatus('end');
                return false;

            }

            this._resetElapsed();

            // given this, we need to know which song is playing at this point in time,
            // and from which point in time within the song we will play
            var data = this._getSongInfoByTime(posTime);

            // update cntTime
            this.cntTime = posTime;
            // update timeIterator
            this.timeIterator = data.iterator;

            return data;

        },
        _rewind: function () {

            var _self = this,
                action = 'rewind';

            if (this._getSide().current.getPositionStatus() === 'start') {

                return false;

            }

            this._updateButtons(action);

            $.when(this.sound.play('click')).done(function () {

                _self._updateStatus(true);
                _self.isMoving = true;

                _self._updateAction(action);
                _self.sound.play('rewind', true);
                _self._setWheelAnimation('0.5s', action);
                _self._timer();

            });

        },
        _forward: function () {

            var _self = this,
                action = 'forward';

            if (this._getSide().current.getPositionStatus() === 'end') {

                return false;

            }

            this._updateButtons(action);

            $.when(this.sound.play('click')).done(function () {

                _self._updateStatus(true);
                _self.isMoving = true;

                _self._updateAction(action);
                _self.sound.play('fforward', true);
                _self._setWheelAnimation('0.5s', action);
                _self._timer();

            });

        },
        _stop: function (buttons) {

            if (!buttons) {

                this._updateButtons('stop');
                this.sound.play('click');

            }
            this.isMoving = false;
            this._stopWheels();
            this.audio.pause();
            this._stopTimer();

        },
        _clear: function () {

            this.$audioEl.children('source').remove();

        },
        _setSidesPosStatus: function (position) {

            this._getSide().current.setPositionStatus(position);

            switch (position) {

                case 'middle'    :
                    this._getSide().reverse.setPositionStatus(position);
                    break;
                case 'start'    :
                    this._getSide().reverse.setPositionStatus('end');
                    break;
                case 'end'        :
                    this._getSide().reverse.setPositionStatus('start');
                    break;

            }

        },
        // given a point in time for the current side, returns the respective song of that side and the respective time within the song
        _getSongInfoByTime: function (time) {

            var data = {songIdx: 0, timeInSong: 0},
                side = this._getSide().current,
                playlist = side.getPlaylist(),
                len = side.getPlaylistCount(),
                cntTime = 0;

            for (var i = 0; i < len; ++i) {

                var song = playlist[i],
                    duration = song.getDuration();

                cntTime += duration;

                if (cntTime > time) {

                    data.songIdx = i;
                    data.timeInSong = time - ( cntTime - duration );
                    data.iterator = cntTime - duration;

                    return data;

                }

            }

            return data;

        },
        _getWheelValues: function (x) {

            var T = this._getSide().current.getDuration(),
                val = {
                    left: ( this.currentSide === 1 ) ? ( -70 / T ) * x + 70 : ( 70 / T ) * x,
                    right: ( this.currentSide === 1 ) ? ( 70 / T ) * x : ( -70 / T ) * x + 70
                };
            return val;

        },
        _getPosTime: function () {

            var wleft = this.$wheelLeft.data('wheel'),
                wright = this.$wheelRight.data('wheel');

            if (wleft === undefined) {

                wleft = 70;

            }
            if (wright === undefined) {

                wright = 0;

            }

            var T = this._getSide().current.getDuration(),
                posTime = this.currentSide === 2 ? ( T * wleft ) / 70 : ( T * wright ) / 70;

            return posTime;

        },
        _updateWheelValue: function (wheelVal) {

            this.$wheelLeft.data('wheel', wheelVal.left).css({'box-shadow': '0 0 0 ' + wheelVal.left + 'px black'});
            this.$wheelRight.data('wheel', wheelVal.right).css({'box-shadow': '0 0 0 ' + wheelVal.right + 'px black'});

        },
        _setWheelAnimation: function (speed, mode) {

            var _self = this, anim = '';

            switch (this.currentSide) {

                case 1 :
                    if (mode === 'play' || mode === 'forward') {
                        anim = 'rotateLeft';
                    }
                    else if (mode === 'rewind') {
                        anim = 'rotateRight';
                    }
                    break;
                case 2 :
                    if (mode === 'play' || mode === 'forward') {
                        anim = 'rotateRight';
                    }
                    else if (mode === 'rewind') {
                        anim = 'rotateLeft';
                    }
                    break;

            }

            var animStyle = {
                '-webkit-animation': anim + ' ' + speed + ' linear infinite forwards',
                '-moz-animation': anim + ' ' + speed + ' linear infinite forwards',
                '-o-animation': anim + ' ' + speed + ' linear infinite forwards',
                '-ms-animation': anim + ' ' + speed + ' linear infinite forwards',
                'animation': anim + ' ' + speed + ' linear infinite forwards'
            };

            setTimeout(function () {

                _self.$wheelLeft.css(animStyle);
                _self.$wheelRight.css(animStyle);

            }, 0);

        },
        _stopWheels: function () {

            var wheelStyle = {
                '-webkit-animation': 'none',
                '-moz-animation': 'none',
                '-o-animation': 'none',
                '-ms-animation': 'none',
                'animation': 'none'
            }

            this.$wheelLeft.css(wheelStyle);
            this.$wheelRight.css(wheelStyle);

        },
        // credits: http://www.sitepoint.com/creating-accurate-timers-in-javascript/
        _timer: function () {

            var _self = this,
                start = new Date().getTime(),
                time = 0;

            this._resetElapsed();

            this.isSeeking = true;

            this._setSidesPosStatus('middle');

            if (this.isSeeking) {

                clearTimeout(this.timertimeout);
                this.timertimeout = setTimeout(function () {

                    _self._timerinstance(start, time);

                }, 100);

            }

        },
        _timerinstance: function (start, time) {

            var _self = this;

            time += 100;

            this.elapsed = Math.floor(time / 20) / 10;

            if (Math.round(this.elapsed) == this.elapsed) {

                this.elapsed += 0.0;

            }

            // stop if it reaches the end of the cassette / side
            // or if it reaches the beginning
            var posTime = this.cntTime;

            if (this.lastaction === 'forward') {

                posTime += this.elapsed;

            }
            else if (this.lastaction === 'rewind') {

                posTime -= this.elapsed;

            }

            var wheelVal = this._getWheelValues(posTime);
            this._updateWheelValue(wheelVal);

            if (posTime >= this._getSide().current.getDuration() || posTime <= 0) {

                this._stop();
                ( posTime <= 0) ? this.cntTime = 0 : this.cntTime = posTime;
                this._resetElapsed();
                ( posTime <= 0) ? this._setSidesPosStatus('start') : this._setSidesPosStatus('end');
                return false;

            }

            var diff = (new Date().getTime() - start) - time;

            if (this.isSeeking) {

                clearTimeout(this.timertimeout);
                this.timertimeout = setTimeout(function () {

                    _self._timerinstance(start, time);

                }, ( 100 - diff ));

            }

        },
        _stopTimer: function () {

            clearTimeout(this.timertimeout);
            this.isSeeking = false;

        },
        _resetElapsed: function () {

            this.elapsed = 0.0;

        }

    };

    // Cassette side obj
    $.Side = function (id, playlist, status) {

        // side's name / id
        this.id = id;
        // status is "start", "middle" or "end"
        this.status = status;
        // array of songs sorted by song id
        this.playlist = playlist.sort(function (a, b) {

            var aid = a.id,
                bid = b.id;

            return ( ( aid < bid ) ? -1 : ( ( aid > bid ) ? 1 : 0 ) );

        });
        // set playlist duration
        this._setDuration();
        // total number of songs
        this.playlistCount = playlist.length;

    };

    $.Side.prototype = {

        getSong: function (num) {

            return this.playlist[num];

        },
        getPlaylist: function () {

            return this.playlist;

        },
        _setDuration: function () {

            this.duration = 0;

            for (var i = 0, len = this.playlist.length; i < len; ++i) {

                this.duration += this.playlist[i].duration;

            }

        },
        getDuration: function () {

            return this.duration;

        },
        getPlaylistCount: function () {

            return this.playlistCount;

        },
        setPositionStatus: function (status) {

            this.status = status;

        },
        getPositionStatus: function () {

            return this.status;

        }

    };

    // Song obj
    $.Song = function (name, id) {

        this.id = id;
        this.name = name;
        this._init();

    };

    $.Song.prototype = {

        _init: function () {

            this.sources = {
                mp3: '../../music/' + this.name + '.mp3',
                ogg: '../../music/' + this.name + '.ogg'
            };

        },
        getSource: function (type) {

            return this.sources[type];

        },
        // load metadata to get the duration of the song
        loadMetadata: function () {

            var _self = this;

            return $.Deferred(
                function (dfd) {

                    var $tmpAudio = $('<audio/>'),
                        songsrc = _self.getSource(aux.getSupportedType());

                    $tmpAudio.attr('preload', 'auto');
                    $tmpAudio.attr('src', songsrc);

                    $tmpAudio.on('loadedmetadata', function (event) {

                        _self.duration = $tmpAudio.get(0).duration;
                        dfd.resolve(_self);

                    });

                }
            ).promise();

        },
        getDuration: function () {

            return this.duration;

        }

    };

    // Sound obj
    $.Sound = function () {

        this._init();

    };

    $.Sound.prototype = {

        _init: function () {

            this.$audio = $('<audio/>').attr('preload', 'auto');

        },
        getSource: function (type) {

            return 'sounds/' + this.action + '.' + type;

        },
        play: function (action, loop) {

            var _self = this;
            return $.Deferred(function (dfd) {

                _self.action = action;

                var soundsrc = _self.getSource(aux.getSupportedType());

                _self.$audio.attr('src', soundsrc);
                if (loop) {

                    _self.$audio.attr('loop', loop);

                }
                else {

                    _self.$audio.removeAttr('loop');

                }

                _self.$audio.on('canplay', function (event) {

                    // TODO: change timeout to ended event . ended event does not trigger for safari ?
                    setTimeout(function () {

                        dfd.resolve();

                    }, 500);
                    $(this).get(0).play();

                });

            });

        }

    };

    var logError = function (message) {

        if (window.console) {

            window.console.error(message);

        }

    };

    $.fn.cassette = function (options) {

        if (typeof options === 'string') {

            var args = Array.prototype.slice.call(arguments, 1);

            this.each(function () {

                var instance = $.data(this, 'cassette');

                if (!instance) {

                    logError("cannot call methods on cassette prior to initialization; " +
                        "attempted to call method '" + options + "'");
                    return;

                }

                if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {

                    logError("no such method '" + options + "' for cassette instance");
                    return;

                }

                instance[options].apply(instance, args);

            });

        }
        else {

            this.each(function () {

                var instance = $.data(this, 'cassette');
                if (!instance) {
                    $.data(this, 'cassette', new $.Cassette(options, this));
                }
            });

        }

        return this;

    };

})(window, jQuery);