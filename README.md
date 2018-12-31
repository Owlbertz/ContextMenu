# ContextMenu
Context Menu plugin for Foundation 6.

## Usage
The plugin comes in two ways, one that depends on Foundation 6 and one that works as a standalone version by having the neccessary Foundation ressources packed.

To embed the Foundation dependend version of Context Menu into your page, you just need to include the CSS and the JS files right after the Foundation includes.
```html
  <script src="foundation.contextMenu.js"></script>
  <link rel="stylesheet" type="text/css" href="foundation.contextMenu.css" />
```

When using the standalone version, just use the following snippet.
```html
  <script src="solo.contextMenu.js"></script>
  <link rel="stylesheet" type="text/css" href="solo.contextMenu.css" />
```

To configure your menus, either render them in HTML following the Foundation menu structure, or use JavaScript to register different types of context menus.
```js
  Foundation.ContextMenu.prototype.addConfig('listitem', {
    accessible: true,
    single: true,
    structure: [{
      text: 'Move to',
      help: 'Alt + M',
      key: 'ALT_M',  
      click: function($item) {
        alert('Moving item: ' + $item.attr('data-id'));
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

Make sure to initialize Foundation, whether you use the standalone version or not by calling
```js
$(document).foundation();
```
and check out the [Foundation installation page](http://foundation.zurb.com/sites/docs/javascript.html) for more information on how to get started.



## Accessibility
This plugin is partly accessible. To allow keyboard users to open the context menus, simply add the following buttons into your trigger elements. Elements having the `data-context-menu-trigger` attribute will trigger the context menu of their parent element when clicked.
```html
  <li data-context-menu="#menu">
    Second item here
    <button data-context-menu-trigger class="button tiny show-on-focus pull-right">Open menu</button>
  </li>
```
## Touch support
This plugin is also optimized for mobile and touch devices. You can toggle the context menu with a long-touch event, which duration can be adjusted in the plugin's options.

## Installation
To install this plugin you can either [directly download the files](https://github.com/Owlbertz/ContextMenu/archive/master.zip)

or install it via NPM:

```shell
npm install foundation-contextmenu
```

In that case you can embed the files using:

```html
  <script src="node_modules/foundation-contextmenu/dist/foundation.contextMenu.js" type="text/javascript"></script>
  <link rel="stylesheet" type="text/css" href="node_modules/foundation-contextmenu/dist/foundation.contextMenu.css" />
```

## Demo
Test the Context Menu on your own at the demo page!

https://Owlbertz.github.io/ContextMenu/

## Acknowledgments
As this project is a plugin for Foundation by ZURB, a big thanks for their stunning framework.

## License
Context Menu is available under the [MIT License](http://opensource.org/licenses/MIT).
