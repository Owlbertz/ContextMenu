'use strict';
/**
 *  Context Menu plugin for Foundation 6
 *  Author: Marius Olbertz - Github: /Owlbertz
 */
!(function (root, factory) {
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
   * @requires foundation.Tooltip
   * @requires foundation.Reveal
   */
  class ContextMenu {
    /**
     * Creates a new instance of ContextMenu.
     * @class
     * @param {jQuery} element - jQuery object (list) to be used as the structure.
     * @param {Object} options - object to extend the default configuration.
     */
    constructor(element, options) {
      this.$element = element;
      this.type = this.$element.attr('data-context-menu') || undefined;
      this.config = {};
      this.options = $.extend({}, this.config, this._getConfig());
      this._init();
      if (this.type.indexOf('#') === -1) { // currently only for menus defined via JSON
        this._registerKeys();
      }

      this._bindEvents();
      Foundation.registerPlugin(this, 'ContextMenu');
    };

    /**
     * Initializes the context menu by rendering required markup
     * @private
     */
    _init() {
      this.keys = {};
      this.$menu = this.type.indexOf('#') === 0 ? $(this.type) : this._getMenu();
      this._render();
    };

    /**
     * Initializes instance of dropdown menu.
     * @private
     */
    _render() {
      this.$menu.hide().appendTo($('body'));
      new Foundation.DropdownMenu(this.$menu);
    };

    /**
     * Returns the config for this instance.
     * @private
     * @return {Object} config
     */
    _getConfig() {
      return this.config[this.type];
    };

    /**
     * Adds a config for this instance.
     * @param {String} type   Key of the config.
     * @param {String} config Value of the config.
     */
    addConfig(type, config) {
      this.config[type] = config;
    };

    /**
     * Renders the markup for the items. 
     * Is used recursively.
     * @private
     * @param {Object} config Config to be rendered with.
     */
    _getMenu(config) {
      var config = config || this.options.structure;
      var $ul = $('<ul class="context menu dropdown vertical"></ul>');
      for (var it in config) {
        var $li = $('<li />'),
          $a = $('<a href="#" />');
        if (config[it].cssClass) {
          $li.addClass(config[it].cssClass);
        }
        if (config[it].icon) {
          $a.append('<span class="icon '+config[it].icon+'"></span>');
        }
        if (config[it].text) {
          $a.text(config[it].text);
        }
        if (config[it].help) {
          $a.append('<small>' + config[it].help + '</small>');
        }
        if (config[it].click && typeof config[it].click === 'function') {
          var _this = this;
          (function(index) {
            $li.on('click.zf.context', function() {
              config[index].click(_this.$element);
            });
          })(it);
        }
        if (config[it].href) {
          $a.attr('href', config[it].href); 
        }
        $li.append($a);
        if (config[it].children) {
          var $subMenu = this._getMenu(config[it].children);
          $subMenu.addClass('menu').appendTo($li);
        }

        if (this.options.accessible 
            && (config[it].children || config[it].href || config[it].click)) {
          $li.attr({
            'tabindex': 0
          });
        }
        $ul.append($li);
      }
      return $ul;
    };

    /**
     * Binds the events to the HTML elements.
     * @private
     */
    _bindEvents() {
      var _this = this,
          touchTimeout;
      this.$element.on('contextmenu.zf.context touchstart.zf.context', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'touchstart') {
          touchTimeout = setTimeout(function() {
            _this.show(e);  
          }, _this.options.touchdelay);
        } else { // normal click
          _this.show(e);
        }
      }).on('touchend.zf.context', function(e) {
        if (touchTimeout) {
          clearTimeout(touchTimeout);
        }  
      });
      $('body').on('click.zf.context touchstart.zf.context', function(e) {
        if (
          _this.open 
          && !$(e.target).is(_this.$menu.add($(_this.$menu.find('*')))) 
          && (
            !($(e.target).is(_this.$element) && e.button === 3)
            || e.type === 'touchstart'
          )
        ) {
          _this.hide();
        }
      }).on('keydown.zf.context', function(e) {
        if (_this.open) {
          var fn = _this.keys[Foundation.Keyboard.parseKey(e)];
          if (fn && typeof fn === 'function') {
            fn(_this.$element);
          }
        }
      });
      // sr support
      this.$element.find('[data-context-menu-trigger]').click(function(e) {
        e.stopPropagation();
        _this.show();
        _this.$menu.attr({
          'tabindex': '-1'
        }).focus();
      });
    };

    /**
     * Registers keys for the ContextMenu elements.
     * @param  {Object} config Config of this instance.
     */
    _registerKeys(config) {
      var config = config || this.options.structure;
      for (var c = 0; c < config.length; c++) {
        if (config[c].key) {
          this.keys[config[c].key] = config[c].click;
        }
      }
    };

    /**
     * Shows the ContextMenu.
     * @param  {Event} e Event that called the function.
     * @fires ContextMenu#show
     */
    show(e) {
      var posX, posY;
      if (e && e.type === 'contextmenu') { // opened with a click event
        var e = e || window.event;
        posX = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posY = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      } else { // opened via JS (most likly due to keyboard or touch)
        posX = this.$element.offset().left + this.$element.outerWidth();
        posY = this.$element.offset().top;
      }
      this.$menu.css('visibility','hidden').show();

      // position element on right side of viewport if it would overlap otherwise
      if (posX + this.$menu.outerWidth() > $(window).outerWidth()) {
        posX =  $(window).outerWidth() - this.$menu.outerWidth() - this.options.screenOffset;
        this.$menu.addClass('align-right');
      }

      this.$menu.css({
        top: posY,
        left: posX
      });

      if (this.options.single) {
        $('body').trigger('click');
      }
      this.$menu.css('visibility','');
      this.open = true;

      /**
       * Fires when the menu is shown..
       * @event ContextMenu#show
       */
      this.$element.trigger('show.zf.contextMenu');
    };

    /**
     * Hides the ContextMenu.
     * @param  {Event} e Event that called the function.
     * @fires ContextMenu#show
     */
    hide(e) {
      this.$menu.hide().removeClass('align-right');
      this.open = false;

      /**
       * Fires when the menu is hidden.
       * @event ContextMenu#hide
       */
      this.$element.trigger('hide.zf.contextMenu');
    };

    /**
     * Destroys an instance of a ContextMenu.
     * @fires ContextMenu#destroyed
     */
    destroy() {
      this.$menu.hide().remove();

      /**
       * Fires when the plugin has been destroyed.
       * @event ContextMenu#destroyed
       */
      this.$element.trigger('destroyed.zf.contextMenu');

      Foundation.unregisterPlugin(this);
    };
  };



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
    screenOffset: 10
  };

  // Window exports
  Foundation.plugin(ContextMenu, 'ContextMenu');

  return ContextMenu;
}));