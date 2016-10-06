'use strict';
/**
 *  Context Menu plugin for Foundation 6
 *  Author: Marius Olbertz - Github: /Owlbertz
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

!function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals (root is window)
    root.returnExports = factory(root.jQuery);
  }
}(this, function ($) {
  /**
   * ContextMenu module.
   * @module foundation.ContextMenu
   * @requires foundation.util.keyboard
   * @requires foundation.DropdownMenu
   */

  var ContextMenu = function () {

    /**
     * Creates a new instance of ContextMenu.
     * @class
     * @param {jQuery} element - jQuery object (<ul>) to be used as the structure.
     * @param {Object} options - object to extend the default configuration.
     */

    function ContextMenu(element, options) {
      _classCallCheck(this, ContextMenu);

      this.$element = element;
      this.type = this.$element.attr('data-context-menu') || '';
      this.options = $.extend({}, ContextMenu.defaults, options, this._getConfig());
      this._init();

      if (this.type && this.type.indexOf('#') === -1) {
        // Currently only for menus defined via JSON
        this._registerKeys();
      }

      this._bindEvents();
      Foundation.registerPlugin(this, 'ContextMenu');
    }

    _createClass(ContextMenu, [{
      key: '_init',


      /**
       * Initializes the context menu by rendering required markup
       * @private
       */
      value: function _init() {
        this.keys = {};
        this.$menu = this.type.indexOf('#') === 0 ? $(this.type).clone().appendTo('body') : this._getMenu();
        this._render();

        if (this.options.position) {
          // Show directly if context menu has been created via pure JS
          this.show(this.options.position);
        }
      }
    }, {
      key: '_render',


      /**
       * Initializes instance of dropdown menu.
       * @private
       */
      value: function _render() {
        this.$menu.hide().appendTo($('body'));
        new Foundation.DropdownMenu(this.$menu);
      }
    }, {
      key: '_getConfig',


      /**
       * Returns the config for this instance.
       * @private
       * @return {Object} config
       */
      value: function _getConfig() {
        return ContextMenu.config[this.type];
      }
    }, {
      key: 'addConfig',


      /**
       * Adds a config for this instance.
       * @param {String} type   Key of the config.
       * @param {String} config Value of the config.
       */
      value: function addConfig(type, config) {
        ContextMenu.config[type] = config;
      }
    }, {
      key: '_getMenu',


      /**
       * Renders the markup for the items. 
       * Is used recursively.
       * @private
       * @param {Object} config Config to be rendered with.
       */
      value: function _getMenu(config) {
        var config = config || this.options.structure;
        var $ul = $('<ul class="context menu dropdown vertical"></ul>');
        for (var it in config) {
          var $li = $('<li />'),
              $a = $('<a href="#" />');
          if (config[it].cssClass) {
            $li.addClass(config[it].cssClass);
          }
          if (config[it].icon) {
            $a.append('<span class="icon ' + config[it].icon + '"></span>');
          }
          if (config[it].text) {
            $a.append(config[it].text);
          }
          if (config[it].help) {
            $a.append('<small>' + config[it].help + '</small>');
          }

          var _this = this;

          (function (index) {
            $a.on('click.zf.contextmenu', function (e) {
              e.preventDefault();
              e.stopPropagation();
              if (config[index].click && typeof config[index].click === 'function') {
                // For defined functions, execute them
                config[index].click(_this.$element);
              }

              // Emit event about selected item
              _this.$element.trigger('contextselect.zf.contextmenu', {
                element: _this.$element,
                option: $(this)
              });

              if (_this.options.closeOnClick) {
                // Hide context menu
                _this.hide();
              }
            });
          })(it);

          if (config[it].href) {
            $a.attr('href', config[it].href);
          }
          $li.append($a);
          if (config[it].children) {
            var $subMenu = this._getMenu(config[it].children);
            $subMenu.addClass('menu').appendTo($li);
          }

          if (this.options.accessible && (config[it].children || config[it].href || config[it].click)) {
            $li.attr({
              'tabindex': 0
            });
          }
          $ul.append($li);
        }
        return $ul;
      }
    }, {
      key: '_bindEvents',


      /**
       * Binds the events to the HTML elements.
       * @private
       */
      value: function _bindEvents() {
        var _this = this,
            touchTimeout;

        this.$element.on('contextmenu.zf.contextmenu touchstart.zf.contextmenu', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (e.type === 'touchstart') {
            touchTimeout = setTimeout(function () {
              _this.show(e);
            }, _this.options.touchdelay);
          } else {
            // normal click
            _this.show(e);
          }
        }).on('touchend.zf.contextmenu', function (e) {
          if (touchTimeout) {
            clearTimeout(touchTimeout);
          }
        });

        // SR support, open context menu on trigger click
        this.$element.find('[data-context-menu-trigger]').on('click.zf.contextmenu', function (e) {
          e.stopPropagation();
          _this.show();
          _this.$menu.attr({
            'tabindex': '-1'
          }).focus();
        });

        // For HTML based context menus, handle clicks on context menu items
        if (this.type.indexOf('#') !== -1) {
          this.$menu.find('a').on('click.zf.contextmenu', function (e) {
            e.stopPropagation();
            if ($(this).attr('href') === '') {
              // For non-navigating links, emit custom event with additional data
              e.preventDefault();
              _this.$element.trigger('contextselect.zf.contextmenu', {
                element: _this.$element,
                option: $(this)
              });
            }
            if (_this.options.closeOnClick) {
              // Hide context menu
              _this.hide();
            }
          });
        }

        // Handle closing the context menu on outside click
        $('body').on('click.zf.contextmenu touchstart.zf.contextmenu', function (e) {
          if (_this.open && !$(e.target).is(_this.$menu.add($(_this.$menu.find('*')))) && (!($(e.target).is(_this.$element) && e.button === 3) || e.type === 'touchstart')) {
            _this.hide();
          }
        }).on('keydown.zf.contextmenu', function (e) {
          // If keyboard shortcuts are defined, handle them
          if (_this.open) {
            var fn = _this.keys[Foundation.Keyboard.parseKey(e)];
            if (fn && typeof fn === 'function') {
              fn(_this.$element);
            }
          }
        });
      }
    }, {
      key: '_registerKeys',


      /**
       * Registers keys for the ContextMenu elements.
       * @param  {Object} config Config of this instance.
       */
      value: function _registerKeys(config) {
        var config = config || this.options.structure;
        for (var c = 0; c < config.length; c++) {
          if (config[c].key) {
            this.keys[config[c].key] = config[c].click;
          }
        }
      }
    }, {
      key: 'show',


      /**
       * Shows the ContextMenu.
       * @param  {Event} e Event that called the function.
       * @fires ContextMenu#show
       */
      value: function show(e) {
        // Close other context menus
        if (this.options.single) {
          $('body').trigger('click.zf.contextmenu');
        }

        var posX, posY;
        if (e && e.type === 'contextmenu') {
          // opened with a click event
          var e = e || window.event;
          posX = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          posY = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        } else {
          // opened via JS (most likly due to keyboard or touch)
          posX = this.$element.offset().left + this.$element.outerWidth();
          posY = this.$element.offset().top;
        }
        this.$menu.css('visibility', 'hidden').show();

        // position element on right side of viewport if it would overlap otherwise
        if (posX + this.$menu.outerWidth() > $(window).outerWidth()) {
          posX = $(window).outerWidth() - this.$menu.outerWidth() - this.options.screenOffset;
          this.$menu.addClass('align-right');
        }

        this.$menu.css({
          top: posY,
          left: posX
        });

        this.$menu.css('visibility', '');
        this.open = true;

        /**
         * Fires when the menu is shown..
         * @event ContextMenu#show
         */
        this.$element.trigger('show.zf.contextmenu');
      }
    }, {
      key: 'hide',


      /**
       * Hides the ContextMenu.
       * @param  {Event} e Event that called the function.
       * @fires ContextMenu#show
       */
      value: function hide(e) {
        this.$menu.hide().removeClass('align-right');
        this.open = false;
        /**
         * Fires when the menu is hidden.
         * @event ContextMenu#hide
         */
        this.$element.trigger('hide.zf.contextmenu');
      }
    }, {
      key: 'destroy',


      /**
       * Destroys an instance of a ContextMenu.
       * @fires ContextMenu#destroyed
       */
      value: function destroy() {
        this.$menu.hide().remove();

        /**
         * Fires when the plugin has been destroyed.
         * @event ContextMenu#destroyed
         */
        this.$element.trigger('destroyed.zf.contextmenu');

        Foundation.unregisterPlugin(this);
      }
    }]);

    return ContextMenu;
  }();

  ContextMenu.defaults = {
    /**
     * If only one menu should be open at a time.
     * @option
     * @example true
     */
    single: true,
    /**
     * If ARIA attributes should be added.
     * @option
     * @example true
     */
    accessible: true,
    /**
     * Delay for touch event before the menu opens.
     * @option
     * @example 400
     */
    touchdelay: 400,
    /**
     * Minimum offset to the screen.
     * @option
     * @example 10
     */
    screenOffset: 10,
    /**
     * If the menu should be closed after clicking an option.
     * @option
     * @example true
     */
    closeOnClick: true,
    /**
     * Event to display the context menu directly when using pure JS
     * @option
     * @example Contextmenu DOM Event
     */
    position: null
  };

  ContextMenu.config = {};

  // Window exports
  Foundation.plugin(ContextMenu, 'ContextMenu');

  return ContextMenu;
});