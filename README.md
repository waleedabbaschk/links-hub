# Links Hub

500+ useful websites ek jagah. Cream UI, search, categories, favorites aur dark mode.

## Chalane ka tareeqa
1. VS Code mein folder kholo
2. `index.html` par right-click, phir Open with Live Server (ya seedha double-click)

## Naya link kaise add karein
`data/links.js` kholo aur array mein yeh line add karo:

    { name: "Site Name", url: "https://example.com", category: "Utilities", tags: ["free"], desc: "Chhoti si description." },

Nayi category chahiye? Bas `category` mein naya naam likh do, chip khud ban jayegi.

## Files
- `index.html` : main page
- `css/themes.css` : colors (light/dark)
- `css/style.css` : layout aur cards
- `js/app.js` : rendering aur events
- `js/search.js` : search aur filter
- `js/favorites.js` : bookmarks (localStorage)
- `js/theme.js` : theme switch
- `data/links.js` : saare links