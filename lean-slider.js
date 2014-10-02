/*
 * Lean Slider v1.0.1
 * http://dev7studios.com/lean-slider
 *
 * Copyright 2012, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {

    $.fn.leanSlider = function(options) {

        // Set up plugin vars
        var plugin = this,
            settings = {},
            slider = $(this),
            slides = slider.children(),
            currentSlide = 0,
            timer = 0;

        var init = function() {
            // Set up settings
            settings = $.extend({}, $.fn.leanSlider.defaults, options);

            // Add inital classes
            slider.addClass('lean-slider');
            slides.addClass('lean-slider-slide');

            currentSlide = settings.startSlide;
            if(settings.startSlide < 0 || settings.startSlide >= slides.length) currentSlide = 0;
            $(slides[currentSlide]).addClass('current');

            // Set up directionNav
            if(settings.directionNav && $(settings.directionNav).length){
                var prevNav = $('<a href="#" class="lean-slider-prev">'+ settings.prevText +'</a>'),
                    nextNav = $('<a href="#" class="lean-slider-next">'+ settings.nextText +'</a>');
                if(settings.directionNavPrevBuilder) prevNav = $(settings.directionNavPrevBuilder.call(this, settings.prevText));
                if(settings.directionNavNextBuilder) nextNav = $(settings.directionNavNextBuilder.call(this, settings.nextText));

                prevNav.on('click', function(e){
                    e.preventDefault();
                    plugin.prev();
                });
                nextNav.on('click', function(e){
                    e.preventDefault();
                    plugin.next();
                });

                $(settings.directionNav).append(prevNav);
                $(settings.directionNav).append(nextNav);
            }

            // Set up controlNav
            if(settings.controlNav && $(settings.controlNav).length){
                slides.each(function(i){
                    var controlNav = $('<a href="#" class="lean-slider-control-nav">'+ (i + 1) +'</a>');
                    if(settings.controlNavBuilder) controlNav = $(settings.controlNavBuilder.call(this, i, $(slides[i])));

                    controlNav.on('click', function(e){
                        e.preventDefault();
                        plugin.show(i);
                    });

                    $(settings.controlNav).append(controlNav);
                });
            }

            // Set up pauseOnHover
            if(settings.pauseOnHover && settings.pauseTime && settings.pauseTime > 0){
                slider.hover(
                    function () {
                        clearTimeout(timer);
                    },
                    function () {
                        doTimer();
                    }
                );
            }

            // Initial processing
            updateControlNav();
            doTimer();

            // Trigger the afterLoad callback
            settings.afterLoad.call(this);

            return plugin;
        };

        // Process timer
        var doTimer = function(){
            if(settings.pauseTime && settings.pauseTime > 0){
                clearTimeout(timer);
                timer = setTimeout(function(){ plugin.next(); }, settings.pauseTime);
            }
        };

        // Update controlNav
        var updateControlNav = function(){
            if(settings.controlNav){
                $('.lean-slider-control-nav', settings.controlNav).removeClass('active');
                $($('.lean-slider-control-nav', settings.controlNav).get(currentSlide)).addClass('active');
            }
        };

        // Prev
        plugin.prev = function(){
            // Trigger the beforeChange callback
            settings.beforeChange.call(this, currentSlide);

            currentSlide--;
            if(currentSlide < 0) currentSlide = slides.length - 1;
            slides.removeClass('current');
            $(slides[currentSlide]).addClass('current');
            updateControlNav();
            doTimer();

            // Trigger the afterChange callback
            settings.afterChange.call(this, currentSlide);
        };

        // Next
        plugin.next = function(){
            // Trigger the beforeChange callback
            settings.beforeChange.call(this, currentSlide);

            currentSlide++;
            if(currentSlide >= slides.length) currentSlide = 0;
            slides.removeClass('current');
            $(slides[currentSlide]).addClass('current');
            updateControlNav();
            doTimer();

            // Trigger the afterChange callback
            settings.afterChange.call(this, currentSlide);
        };

        // Show
        plugin.show = function(index){
            // Trigger the beforeChange callback
            settings.beforeChange.call(this, currentSlide);

            currentSlide = index;
            if(currentSlide < 0) currentSlide = slides.length - 1;
            if(currentSlide >= slides.length) currentSlide = 0;
            slides.removeClass('current');
            $(slides[currentSlide]).addClass('current');
            updateControlNav();
            doTimer();

            // Trigger the afterChange callback
            settings.afterChange.call(this, currentSlide);
        };

        // Call constructor
        return init();
    };

    // Defaults
    $.fn.leanSlider.defaults = {
        pauseTime: 4000,
        pauseOnHover: true,
        startSlide: 0,
        directionNav: '',
        directionNavPrevBuilder: '',
        directionNavNextBuilder: '',
        controlNav: '',
        controlNavBuilder: '',
        prevText: 'Prev',
        nextText: 'Next',
        beforeChange: function(){},
        afterChange: function(){},
        afterLoad: function(){}
    };

})(jQuery);
