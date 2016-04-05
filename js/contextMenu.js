/**
 *  Context Menu Moule for Foundation 6
 *  Author: Marius Olbertz - Github: /Owlbertz
 *  @module foundation.context-menu
 *  @requires foundation.dropdown-menu
 */
!(function($, Foundation) {
  'use strict';

  function ContextMenu($element) {
    this.$element = $element;
    this.type = this.$element.attr('data-context-menu') || undefined;
    this.options = $.extend({}, ContextMenu.prototype.config, this._getConfig());
    this._init();
    if (this.type.indexOf('#') === -1) { // currently only for menus defined via JSON
      this._registerKeys();
    }
    this._bindEvents();
    Foundation.registerPlugin(this);
  };
  ContextMenu.prototype.config  = {
    single: true, // only one menu open at a time?
    accessible: true, // add ARIA attributes?
    touchdelay: 400, // how long shall a touch take before menu opens?
    screenOffset: 10 // min offset to the screen
  };
  ContextMenu.prototype._init = function() {
    this.keys = {};
    this.$menu = this.type.indexOf('#') === 0 ? $(this.type) : this._getMenu();
    this._render();
  };
  ContextMenu.prototype._render = function() {
    this.$menu.hide().appendTo($('body'));
    new Foundation.DropdownMenu(this.$menu);
  };
  ContextMenu.prototype._getConfig = function() {
    return this.config[this.type];
  };
  ContextMenu.prototype.addConfig = function(type, config) {
    ContextMenu.prototype.config[type] = config;
  };
  ContextMenu.prototype._getMenu = function(config) {
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
  ContextMenu.prototype._bindEvents = function() {
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
  ContextMenu.prototype._registerKeys = function(config) {
    var config = config || this.options.structure;
    for (var c = 0; c < config.length; c++) {
      if (config[c].key) {
        this.keys[config[c].key] = config[c].click;
      }
    }
  };

  ContextMenu.prototype.show = function(e) {
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


  };

  ContextMenu.prototype.hide = function(e) {
    this.$menu.hide().removeClass('align-right');
    this.open = false;
  };

  ContextMenu.prototype.destroy = function() {
    this.$menu.hide().remove();

    /**
     * Fires when the plugin has been destroyed.
     * @event Joyride#destroyed
     */
    this.$element.trigger('destroyed.zf.contextMenu');

    Foundation.unregisterPlugin(this);
  };

  Foundation.plugin(ContextMenu);
})(jQuery, window.Foundation);