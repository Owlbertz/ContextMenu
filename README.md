# ContextMenu
Context Menu plugin for Foundation 6.

## Usage
To embed Context Menu into your page, you just need to include the CSS and the JS files right after the Foundation includes.
```html
  <script src="js/contextMenu.js"></script>
  <link rel="stylesheet" type="text/css" href="css/contextMenu.css" />
```

To configure your menus, either render them in HTML following the Foundation menu structure, or use JavaScript to register different types of context menus.
```js
  Foundation.ContextMenu.prototype.addConfig('listitem', {
    accessible: true,
    single: true,
    structure: [{
      text: 'Move to',
      help: 'Alt + M',
      href: '#'
    }, {
      icon: 'fa fa-paper-plane',
      text: 'Send via mail',  
      click: function() {
        alert('Sending a mail!');
      }
    }, {
      class: 'divider',
    }, {
      text: 'More...',
      children: [{
        text: 'Delete',
        href: '#'
      }, {
        text: 'Download...',
        href: '#',
        children: [{
          text: 'Save as PDF',
          href: '#'
        }, {
          text: 'Save as PNG',
          href: '#'
        }]
      }]
    }]
  });
```
To add a context menu to one of your elements, e.g. elements within lists, simply add the `data-context-menu` attribute, having either a defined menu type or the reference to your rendered HTML list as a value.
```html
  <!-- This li uses the JSON from the config for "listitem" and renders it as the context menu -->
  <li data-context-menu="listitem">
    First item here
  </li>
  <!-- This li uses the JSON from the config for "listitem" and renders it as the context menu -->
  <li data-context-menu="#menu">
    Second item here
  </li>
```
## Accessibility
This plugin is partly accessible. To allow keyboard users to open the context menus, simply add the following buttons into your trigger elements.
```html
  <li data-context-menu="#menu">
    Second item here <button data-context-menu-trigger class="button tiny show-on-focus pull-right">Open menu</button>
  </li>
```

## Demo
Test the Context Menu on your own at the demo page.

http://owlbertz.github.io/ContextMenu/

## Acknowledgments
As this project is a plugin for Foundation by ZURB, a big thanks for their stunning framework.

## License
Context Menu is available under the [MIT License](http://opensource.org/licenses/MIT).