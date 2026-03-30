# Alt Lab Creations

Personal portfolio site for freelance web design & build work.

## Structure

```
alt-lab/
├── index.html          # Entry point — loads all partials
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # Partial loader, project data, modal & touch logic
└── partials/
    ├── header.html     # Brand mark + Get a quote button
    ├── divider.html    # Section divider
    ├── intro.html      # One-liner intro
    ├── projects.html   # Grid container (populated by main.js)
    ├── footer.html     # Footer
    └── modal.html      # Quote enquiry modal
```

## Adding a new project

Open `js/main.js` and add an entry to the `projects` array:

```js
{
  title: 'Project Name',
  desc: 'Short description of the site and what it does.',
  tags: ['HTML', 'CSS', 'JavaScript'],
  url: 'example.com',
  href: 'https://example.com',
  featured: false   // set true to make it span full width
},
```

## Local development

Open with a local server (partials use fetch so won't load from file://):

```bash
cd alt-lab
python3 -m http.server 8080
# then open http://localhost:8080
```
