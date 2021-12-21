(function () { // :)
    'use strict';

    /* START MENU */
    skydock.viewTemplates.StartMenu = Backbone.View.extend({
        el: '#start-menu-wrapper',

        events: {
            'click .start-game': 'startGame',
            'click .show-credits': 'showCredits',
            'click .mute-btn-music': 'toggleMusicMute',
            'click .mute-btn-sfx': 'toggleSFXMute',
        },

        visible: true,

        firstStart: true,

        initialize: function() {},

        cycleStartBtn: function() {
            if (skydock.views.startMenu.visible) {
                tween.to(skydock.views.startMenu.$el.find('.start-game'), 0.9, {
                    autoAlpha: 1,
                    ease: Quad.EaseInOut,
                    onComplete: function() {
                        tween.to(skydock.views.startMenu.$el.find('.start-game'), 1.2, {
                            autoAlpha: 0.65,
                            ease: Quad.EaseInOut,
                            onComplete: function() {
                                skydock.views.startMenu.cycleStartBtn();
                            }
                        });
                    }
                });
            }
        },

        startGame: function() {
            skydock.views.startMenu.visible = false;

            tween.to(this.$el, 1, {
                autoAlpha: 0,
                onComplete: function() {
                    var $startGameBtn = skydock.views.startMenu.$el.find('.start-game');
                    $startGameBtn.text('Resume Game');
                    tween.set($startGameBtn, { autoAlpha: 1 });
                }
            });

            skydock.sounds.powerup.play();

            if (this.firstStart) {
                skydock.planetViews.jason.showGreeting();
                skydock.planetViews.stephanie.showGreeting();
                this.firstStart = false;
            }
        },

        openMenu: function() {
            tween.to(this.$el, 0.8, { autoAlpha: 1 });

            skydock.sounds.powerup.play();
        },

        toggleMusicMute: function(event) {
            var $muteBtn = $(event.currentTarget);
            if ($muteBtn.hasClass('muted')) {
                $muteBtn.removeClass('muted');
                skydock.sounds.main.play();
                skydock.sounds.powerup.play();
                localStorage.setItem('music-mute', 'off');
            }  
            else {
                $muteBtn.addClass('muted');
                skydock.sounds.main.pause();
                localStorage.setItem('music-mute', 'on');
            }
        },

        toggleSFXMute: function(event) {
            var $muteBtn = $(event.currentTarget);
            if ($muteBtn.hasClass('muted')) {
                $muteBtn.removeClass('muted');
                Howler.unmute();
                skydock.sounds.powerup.play();
                localStorage.setItem('sfx-mute', 'off');
            }  
            else {
                $muteBtn.addClass('muted');
                Howler.mute();
                localStorage.setItem('sfx-mute', 'on');
            }
        },

        showCredits: function() {
            skydock.sounds.powerup.play();
            skydock.views.credits.render();
        }
    });


    /* GALAXY */
    skydock.viewTemplates.GalaxyView = Backbone.View.extend({
        el: '#galaxy',

        events: { 'click': 'onClick' },

        onClick: function(event) {
            var viewportWidthCenter = $(window).width() / 2;
            var viewportHeightCenter = $(window).height() / 2;
            var deltaX = event.clientX - viewportWidthCenter;
            var deltaY = event.clientY - viewportHeightCenter;
            var newPos = {
                x: skydock.views.ship.position.x + deltaX,
                y: skydock.views.ship.position.y + deltaY
            };

            skydock.views.ship.flyTo(newPos);
            skydock.placeCrosshair(newPos);
        }
    });


    /* HUD */
    skydock.viewTemplates.HUD = Backbone.View.extend({
        el: '#hud',

        events: {
            'click .options-btn': 'optionsClick'
        },

        initialize: function() {
            this.updateCounter();
        },

        updateCounter: function() {
            var $counter = this.$el.find('.planet-counter');
            $counter.text('Discovered ' + skydock.discoveredPlanetCount + ' of ' + skydock.planetCollection.length + ' planets');
        },

        optionsClick: function() {
            skydock.views.startMenu.openMenu();
        }
    });


    /* SHIP */
    skydock.viewTemplates.ShipView = Backbone.View.extend({
        el: '#ship',

        size: { width: 0, height: 0 },

        centerOrigin: { x: 0, y: 0},

        position: { x: 4000, y: 4000 },

        speed: 100,

        events: {
            
        },

        initialize: function() {
            this.size.width = this.$el.outerWidth();
            this.size.height = this.$el.outerHeight();
            this.centerOrigin.x = this.size.width / 2;
            this.centerOrigin.y = this.size.height / 2;
        },

        flyTo: function(newPos, callback) {
            // rotate the ship on the new vector
            var vector = {
                x: newPos.x - skydock.views.ship.position.x,
                y: newPos.y - skydock.views.ship.position.y
            };
            var radianAngle = (Math.atan2(-1 * vector.x, vector.y));
            tween.to(skydock.views.ship.$el, 0.3, { rotationZ: radianAngle + 'rad_short' });

            var deltaX = newPos.x - skydock.views.ship.position.x;
            var deltaY = newPos.y - skydock.views.ship.position.y;

            // travel time is total distance change divided by ship speed!
            var travelTime = (Math.abs(deltaX) + Math.abs(deltaY)) / skydock.views.ship.speed;

            skydock.moveTo(newPos, travelTime, callback);

            if (typeof this.dockedPlanet !== typeof void 0) {
                // we're docked at a planet before this movement, hide the message
                this.dockedPlanet.hideGreeting();
                this.dockedPlanet = void 0;

                tween.to(skydock.views.ship.$el, 0.5, { scale: 1, autoAlpha: 1 });
            }
        }
    });


    /* PLANET */
    skydock.viewTemplates.PlanetView = Backbone.View.extend({
        className: 'planet',

        model: null,

        template: _.template($('#skydock-planet-template').html()),

        currentMessageIndex: 0,

        discovered: false,

        events: {
            'click': 'onClick'
        },

        initialize: function() {
            if (this.model !== null) {
                tween.set(this.$el, {
                    left: this.model.get('position').x,
                    top: this.model.get('position').y
                });

                this.$el.html(this.template(this.model.toJSON()));

                this.$el.addClass(this.model.get('size'))
                    .addClass(this.model.get('color'))
                    .addClass(this.model.get('personality'));

                skydock.$el.append(this.$el);
            }
        },

        onClick: function() {
            if (skydock.views.ship.dockedPlanet !== this) {
                skydock.views.ship.flyTo(this.model.get('position'), _.bind(this.landing, this));
                skydock.hideCrosshair();
                this.showGreeting();

                if (this.discovered === false) {
                    skydock.discoveredPlanetCount++;
                    skydock.views.hud.updateCounter();
                    this.discovered = true;
                }
            }
        },

        landing: function() {
            tween.to(skydock.views.ship.$el, 2, { scale: 0.4 });
            skydock.hideCrosshair();
        },

        showGreeting: function() {
            var $greeting = this.$el.find('.planet-greeting');
            var $personality = this.$el.find('.planet-personality');
            var $messages = $greeting.find('.message');

            if ($messages.length > 0) {
                this.talkSound();

                // reset to first message
                if ($messages.length > 1) {
                    $greeting.find('.active').removeClass('active');
                    $messages.first().addClass('active');
                    $greeting.removeClass('hide-instructions');
                }
                else {
                    $greeting.addClass('hide-instructions');
                    $messages.first().addClass('active');
                }

                tween.to($greeting, 0.7, { autoAlpha: 1 });
            }

            tween.to($personality, 0.7, { autoAlpha: 1 });
            skydock.views.ship.dockedPlanet = this;
        },

        hideGreeting: function() {
            var $greeting = this.$el.find('.planet-greeting');
            var $personality = this.$el.find('.planet-personality');
            var $messages = $greeting.find('.message');

            if ($messages.length > 0) {
                tween.to($greeting, 0.7, { autoAlpha: 0 });
            }
            tween.to($personality, 0.7, { autoAlpha: 0.2 });
        },

        nextMessage: function() {
            var $oldMessage = this.$el.find('.message.active');
            var $nextMessage = $oldMessage.next('.message');

            if ($nextMessage.length > 0) {
                this.talkSound();

                $oldMessage.removeClass('active');
                $nextMessage.addClass('active');

                // hide instructions if this is the last message
                if ($nextMessage.next('.message').length === 0) {
                    $nextMessage.parent().addClass('hide-instructions');
                }
            }
        },

        talkSound: function() {
            if (skydock.talkingCounter === 5) {
                skydock.talkingCounter = 1;
            }
            else {
                skydock.talkingCounter++;
            }
            skydock.sounds['talking' + skydock.talkingCounter].play();
        }
    });

    /* Jason Planet */
    skydock.viewTemplates.JasonView = skydock.viewTemplates.PlanetView.extend({
        firstLanding: false,

        showGreeting: function() {
            skydock.viewTemplates.PlanetView.prototype.showGreeting.apply(this);
            if (this.firstLanding === false) {
                skydock.views.ship.dockedPlanet = void 0;
                this.$el.find('.planet-greeting').addClass('hide-instructions');
            }
        },

        landing: function() {
            skydock.viewTemplates.PlanetView.prototype.landing.apply(this);
            if (this.firstLanding === false) {
                skydock.views.ship.dockedPlanet = this;
                this.$el.find('.planet-greeting').removeClass('hide-instructions');
                this.nextMessage();
                this.$el.find('.message').first().remove();
                skydock.views.ship.speed = 500;
                this.firstLanding = true;
            }
        }
    });

    /* Stephanie Planet */
    skydock.viewTemplates.StephanieView = skydock.viewTemplates.PlanetView.extend({
        firstLanding: false,

        showGreeting: function() {
            skydock.viewTemplates.PlanetView.prototype.showGreeting.apply(this);
            if (this.firstLanding === false) {
                skydock.views.ship.dockedPlanet = void 0;
                this.$el.find('.planet-greeting').addClass('hide-instructions');
            }
        },

        landing: function() {
            skydock.viewTemplates.PlanetView.prototype.landing.apply(this);
            if (this.firstLanding === false) {
                skydock.views.ship.dockedPlanet = this;
                this.$el.find('.planet-greeting').removeClass('hide-instructions');
                this.nextMessage();
                this.$el.find('.message').first().remove();
                this.firstLanding = true;
            }
        },

        nextMessage: function() {
            skydock.viewTemplates.PlanetView.prototype.nextMessage.apply(this);

            var $activeMessage = this.$el.find('.message.active');
            if ($activeMessage.length > 0) {
                if ($activeMessage.text().indexOf('how you helped us') !== -1) {
                    // everything's been said, remove all but the last message
                    $activeMessage.siblings().remove();
                }
                else if ($activeMessage.text().indexOf('gold star') !== -1) {
                    skydock.views.goldStar.award();
                }
            }
        }
    });


    /* gold star */
    skydock.viewTemplates.GoldStarView = Backbone.View.extend({
        el: '#gold-star',

        events: {
            'click': 'onClick'
        },

        onClick: function() {
            skydock.sounds.coin.play();
            this.$el.toggleClass('flipped');
        },

        award: function() {
            skydock.views.goldStar.$el.show();
            skydock.sounds.powerup.play();
            tween.to(skydock.views.goldStar.$el, 0.6, {
                autoAlpha: 1,
                onComplete: function() {
                    skydock.sounds.coin.play();

                    tween.to(skydock.views.goldStar.$el, 2, {
                        ease: Quad.EaseInOut,
                        width: 80,
                        height: 80,
                        marginLeft: 0,
                        marginTop: -100,
                        top: '100%',
                        left: 20,
                        autoAlpha: 0.7,
                        delay: 1.5
                    });
                }
            });

            skydock.views.ship.speed = 750;
        }
    });

    /* credits */
    skydock.viewTemplates.CreditsView = Backbone.View.extend({
        el: '#credits',

        events: {
            'click .close': 'unrender'
        },

        render: function() {
            tween.to(this.$el, 0.6, { autoAlpha: 1 });
        },

        unrender: function() {
            tween.to(this.$el, 0.6, { autoAlpha: 0 });
        }
    });

})();