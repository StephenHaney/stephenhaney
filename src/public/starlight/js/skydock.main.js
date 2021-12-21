(function () { // :)
    'use strict';

    var SkydockView = Backbone.View.extend({
        el: '#skydock',

        cameraPosition: { x: 0, y: 0 },

        views: [],

        viewTemplates: [],

        models: [],

        modelTemplates: [],

        planetCollection: null,

        planetViews: [],

        model: null,

        $crosshair: null,

        discoveredPlanetCount: 0,

        sounds: [],

        talkingCounter: 1,

        initialize: function() {
            // wait for DOM then create the unique views
            $(function () {
                skydock.$crosshair = $('#crosshair');
                skydock.views.galaxy = new skydock.viewTemplates.GalaxyView();
                skydock.views.ship = new skydock.viewTemplates.ShipView();
                skydock.views.hud = new skydock.viewTemplates.HUD();
                skydock.views.startMenu = new skydock.viewTemplates.StartMenu();
                skydock.views.goldStar = new skydock.viewTemplates.GoldStarView();
                skydock.views.credits = new skydock.viewTemplates.CreditsView();

                // init sounds!
                skydock.initSounds();

                // get started
                skydock.centerOnPlayer();
                skydock.views.startMenu.cycleStartBtn();

                window.on_resize(skydock.centerOnPlayer);

                $(document).keyup(function(event) {
                    if (typeof skydock.views.ship.dockedPlanet !== typeof void 0 
                        && skydock.views.ship.dockedPlanet !== null
                        && event.keyCode === 32) {
                        skydock.views.ship.dockedPlanet.nextMessage();
                    }
                });

                // generate our planets!
                skydock.planetCollection.each(function (planetModel) {
                    if (planetModel.get('personality') === 'jason') {
                        skydock.planetViews.jason = new skydock.viewTemplates.JasonView({ model: planetModel });
                    }
                    else if (planetModel.get('personality') === 'stephanie') {
                        skydock.planetViews.stephanie = new skydock.viewTemplates.StephanieView({ model: planetModel });
                    }
                    else {
                        skydock.planetViews.push(new skydock.viewTemplates.PlanetView({ model: planetModel }));
                    }
                });
            });
        },

        initSounds: function() {
            skydock.sounds.main = new Howl({
                urls: ['sound/main.mp3'],
                loop: true,
                volume: 0.425
            });

            if (localStorage.getItem('music-mute') !== 'on') {
                skydock.sounds.main.play();
            }
            else {
                skydock.views.startMenu.$el.find('.mute-btn-music').addClass('muted');
            }

            if (localStorage.getItem('sfx-mute') === 'on') {
                skydock.views.startMenu.$el.find('.mute-btn-sfx').addClass('muted');
                Howler.mute();
            }

            skydock.sounds.crosshair = new Howl({
                urls: ['sound/crosshair.mp3'],
                volume: 0.175
            });

            skydock.sounds.powerup = new Howl({
                urls: ['sound/powerup.mp3'],
                volume: 0.3
            });

            skydock.sounds.coin = new Howl({
                urls: ['sound/coin.mp3'],
                volume: 0.4
            });

            skydock.sounds.talking1 = new Howl({
                urls: ['sound/talking-1.mp3'],
                volume: 0.15
            });

            skydock.sounds.talking2 = new Howl({
                urls: ['sound/talking-2.mp3'],
                volume: 0.15
            });

            skydock.sounds.talking3 = new Howl({
                urls: ['sound/talking-3.mp3'],
                volume: 0.15
            });

            skydock.sounds.talking4 = new Howl({
                urls: ['sound/talking-4.mp3'],
                volume: 0.15
            });

            skydock.sounds.talking5 = new Howl({
                urls: ['sound/talking-5.mp3'],
                volume: 0.15
            });
        },

        placeCrosshair: function(fixedPos) {
            tween.set(skydock.$crosshair, {
                left: fixedPos.x,
                top: fixedPos.y,
                autoAlpha: 1
            });

           // tween.to(skydock.$crosshair, 0.9, { autoAlpha: 0 });
        },

        hideCrosshair: function() {
            tween.set(skydock.$crosshair, {
                autoAlpha: 0
            });
        },

        moveTo: function(newPos, travelTime, callback) {
            var viewportWidthCenter = $(window).width() / 2;
            var viewportHeightCenter = $(window).height() / 2;

            var cameraPos = {};
            cameraPos.x = newPos.x * -1 + viewportWidthCenter;
            cameraPos.y = newPos.y * -1 + viewportHeightCenter;

            tween.to(skydock.views.ship.position, travelTime, {
                x: newPos.x,
                y: newPos.y,
                ease: Quad.easeOut,
                onUpdate: function() {
                    tween.set(skydock.$el, {
                        x: skydock.views.ship.position.x * -1 + viewportWidthCenter,
                        y: skydock.views.ship.position.y * -1 + viewportHeightCenter
                    });
                },
                onComplete: function() {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });

            if (travelTime > 0) {
                skydock.sounds.crosshair.play();
            }
        },

        centerOnPlayer: function() {
            skydock.moveTo(skydock.views.ship.position, 0);
            skydock.hideCrosshair();
        }

    });

    window.skydock = new SkydockView();

})(); // :D