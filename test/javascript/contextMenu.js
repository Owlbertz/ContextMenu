describe('ContextMenu', function() {
  var plugin;
  var $html;
  var templateHtml = '<ul>'
    + '<li data-context-menu="#menu">Item 1</li>'
    + '<li data-context-menu="#menu">Item 2</li>'
    + '<li data-context-menu="#menu">Item 3</li>'
  + '</ul>'
  +'<ul class="context menu dropdown vertical" role="menu" id="menu">'
    + '<li role="menuitem"><a href>Copy</a></li>'
    + '<li role="menuitem"><a href>Move</a></li>'
    + '<li role="menuitem"><a href>Delete</a></li>'
  + '</ul>';

  afterEach(function() {
    plugin.destroy();
    $html.remove();
  });

  describe('constructor()', function() {
    it('stores the element and plugin options', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.ContextMenu($html.find('[data-context-menu]'), {});

      plugin.$element.should.be.an('object');
      plugin.options.should.be.an('object');
    });
  });

  describe('_init()', function() {
    it('hides the context menu list', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.ContextMenu($html.find('[data-context-menu]'), {});

      plugin.$element.should.have.attr('data-context-menu');
      plugin.$menu.should.be.hidden;
    });
  });


  describe('show()', function() {
    it('shows the menu', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.ContextMenu($html.find('[data-context-menu]'), {});

      plugin.show();
      plugin.$menu.should.be.visible;
    });
  });

  describe('hide()', function() {
    it('hides the menu', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.ContextMenu($html.find('[data-context-menu]'), {});

      plugin.show();
      plugin.hide();
      plugin.$menu.should.be.hidden;
    });
  });

  describe('events', function() {
    /*it('shows menu on touchstart', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.ContextMenu($html.find('[data-context-menu]'), {});

      plugin.$element.trigger('touchstart');
      plugin.$menu.should.be.visible;
    });*/

    it('hides menu on body click', function() {
      $html = $(templateHtml).appendTo('body');
      plugin = new Foundation.ContextMenu($html.find('[data-context-menu]'), {});

      plugin.show();

      $('body').trigger('click');
      plugin.$menu.should.be.hidden;
    });
  });
});
