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
    Foundation.FeatherNest(this.$element, 'context');
    this.type = this.$element.attr('data-context-menu') || undefined;
    this.options = $.extend({}, ContextMenu.prototype.config, this._getConfig());
    this._init();
    this._bindEvents();
    Foundation.registerPlugin(this);
  };
  ContextMenu.prototype.config  = {
    single: true,
    accessible: true,
    touchdelay: 500
  };
  ContextMenu.prototype._init = function() {
    console.log('_init', this);
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
      var $li = $('<li></li>');
      if (config[it].class) {
        $li.addClass(config[it].class);
      }
      if (config[it].icon) {
        $li.append('<span class="icon '+config[it].icon+'"></span>');
        if (config[it].help) {
          $li.append('<small>' + config[it].help + '</small>');
        }
      }
      if (config[it].text) {
        $li.append('<span class="text">' + config[it].text + '</span>');
        if (config[it].help) {
          $li.append('<small>' + config[it].help + '</small>');
        }
      }
      if (config[it].href) {
        $li.click(function() {
          location.href = config[it].href;
        });
      }
      if (config[it].click) {
        $li.click(config[it].click);
      }
      if (config[it].href) {
        $li.attr({
          'data-href': config[it].href
        });        
      }

      if (config[it].children) {
        $li.addClass('has-submenu');
        var $subMenu = this._getMenu(config[it].children);
        $subMenu.addClass('submenu').appendTo($li);
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
    this.$element.on('contextmenu touchstart', function(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log(e);
      if (e.type === 'touchstart') {
        touchTimeout = setTimeout(function() {
          _this.show(e);  
        }, _this.options.touchdelay);
      } else { // normal click
        _this.show(e);
      }
    }).on('touchend', function(e) {
      if (touchTimeout) {
        clearTimeout(touchTimeout);
      }  
    });
    $('body').on('click', function(e) {
      console.log('Close', e);
      if (
        _this.open 
        && !$(e.target).is(_this.$menu.add($(_this.$menu.children()))) 
        && (
          !($(e.target).is(_this.$element) && e.button === 3)
          || e.type === 'touchstart'
        )
      ) {
        _this.hide();
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
  ContextMenu.prototype.show = function(e) {
    var posX, posY;
    if (e && e.type === 'contextmenu') { // opened with a click event
      var e = e || window.event;
      posX = e.pageX || e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posY = e.pageY || e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    } else { // opened via JS (most likly due to keyboard)
      posX = this.$element.offset().left + this.$element.outerWidth();
      posY = this.$element.offset().top;
    }
    this.$menu.css({
      top: posY,
      left: posX
    });

    if (this.options.single) {
      $('body').trigger('click');
    }
    this.$menu.show();
    this.open = true;
  };

  ContextMenu.prototype.hide = function(e) {
    this.$menu.hide();
    this.open = false;
  };

  Foundation.plugin(ContextMenu);
})(jQuery, window.Foundation);