// Provide structure for first menu item
Foundation.ContextMenu.prototype.addConfig('listitem', {
  accessible: true,
  single: true,
  structure: [{
    text: 'Move to',
    help: 'Alt + M',
    key: 'ALT_M',  
    click: function($item) {
      alert('Moving item: ' + $item.index());
    }
  }, {
    icon: 'fa fa-paper-plane',
    text: 'Send via mail',  
    click: function($item) {
      alert('Sending a mail!');
    }
  }, {
    cssClass: 'divider'
  }, {
    text: 'More...',
    children: [{
      text: 'Delete'
    }, {
      text: 'Download...',
      children: [{
        text: 'Save as PDF'
      }, {
        text: 'Save as PNG'
      }]
    }]
  }]
});


$(function() {
  // Use the contextselect event to handle selections inside the context menu
  $('#html-example-list [data-context-menu]').on('contextselect.zf.contextmenu', function(e, data) {
    var element = data.element.attr('data-element'),
        option = data.option.attr('data-option');
    alert('Performing action: ' + option + ' on item ' + element);
  });

  // Generate context menus with pure JS
  $('#javascript-example-list li').on('contextmenu', function(event) {
    event.preventDefault();

    var jsContextMenu = new Foundation.ContextMenu($(this), {
      position: event,
      structure: [{
        text: 'Move to',
        click: function($item) {
          alert('Moving item: ' + $item.index());
        }
      }, {
        icon: 'fa fa-paper-plane',
        text: 'Send via mail',  
        click: function($item) {
          alert('Sending a mail!');
        }
      }]
    });
    // Destroy context menu once it's closed
    $(this).one('hide.zf.contextmenu', function() {
      jsContextMenu.destroy();
    });
  });
});

// initialize Foundation
$(document).foundation();