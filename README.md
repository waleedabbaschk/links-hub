# Links Hub

1000+ useful websites in one place, organized by category. Cream UI, search, favorites, dark mode and more.

## How to run
1. Open the folder in VS Code.
2. Right-click `index.html` and choose Open with Live Server (or just double-click it).

## How to add a new link
Open a file in `data/` (for example `links-5.js`) and add a line like this:

    ["Site Name","https://example.com","Utilities","Short description.","free,tool"],

If you need a new category, just write a new category name and add its icon and color in `js/app.js`.

## Files
- `index.html`: main page
- `css/themes.css`: light and dark colors
- `css/style.css`: layout and cards
- `js/app.js`: rendering and events
- `js/search.js`: search and filter
- `js/favorites.js`: bookmarks (localStorage)
- `js/theme.js`: theme switch
- `js/extras.js`: USD/PKR widget, PWA, bottom bar
- `data/`: all the links
- `tools/check-links.ps1`: broken link checker