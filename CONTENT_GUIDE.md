# Content Management Guide

## Overview

Your portfolio content is now managed through a JSON file (`data/content.json`), making it easy to update without touching HTML or JavaScript code.

## File Structure

```
src/
├── data/
│   └── content.json          # All portfolio content
├── js/
│   ├── content-loader.js     # Loads and renders content
│   └── main.js               # Interactive features
├── css/
│   └── styles.css
└── index.html                # HTML structure (no hardcoded content)
```

## How to Update Content

### 1. Personal Information

```json
"personal": {
  "name": "Your Name",
  "title": "Your Title",
  "tagline": "Your Tagline",
  "email": "your@email.com",
  "github": "yourusername",
  "githubUrl": "https://github.com/yourusername",
  "resumePath": "assets/resume.pdf"
}
```

### 2. Hero Section

```json
"hero": {
  "byline": {
    "label": "PROFILE",
    "date": "2025"
  },
  "meta": [
    {
      "label": "Role",
      "value": "Your Role"
    }
  ],
  "lede": "Your introduction text (HTML allowed)"
}
```

### 3. About Section

```json
"about": {
  "eyebrow": "Background",
  "title": "About",
  "intro": "First paragraph...",
  "paragraphs": [
    "Second paragraph...",
    "Third paragraph..."
  ],
  "quote": "Your inspiring quote",
  "skills": [
    {
      "number": "01",
      "title": "Skill Name",
      "description": "Skill description..."
    }
  ]
}
```

### 4. Projects

```json
"projects": {
  "items": [
    {
      "featured": true,
      "title": "Project Name",
      "subtitle": "Project Tagline",
      "description": "Project description...",
      "tags": ["Tag1", "Tag2", "Tag3"],
      "link": {
        "url": "https://example.com",
        "text": "Visit Project"
      }
    }
  ]
}
```

**Note:** Set `"link": null` if project has no external link.

### 5. Contact Section

```json
"contact": {
  "methods": [
    {
      "number": "01",
      "title": "Email",
      "value": "your@email.com",
      "link": "mailto:your@email.com"
    }
  ]
}
```

### 6. Footer

```json
"footer": {
  "copyright": "2025 Your Name. All rights reserved.",
  "links": [
    {
      "text": "GitHub",
      "url": "https://github.com/yourusername"
    }
  ]
}
```

## Features

### ✅ **Benefits**

- **Easy Updates**: Change content without touching code
- **Version Control**: Track content changes separately from code
- **Consistency**: All content in one place
- **Scalability**: Easy to add translations or A/B testing
- **Backup**: Simple to backup and restore content

### 🔄 **Dynamic Loading**

- Content loads automatically on page load
- Graceful fallback if JSON fails to load
- Updates apply instantly without rebuilding

### 🎨 **HTML Support**

- Use `<strong>`, `<em>`, and other HTML tags in text fields
- Automatic rendering with proper escaping

## Quick Updates

### Add a New Project

1. Open `data/content.json`
2. Add to `projects.items` array:

```json
{
  "featured": false,
  "title": "New Project",
  "subtitle": "Project Type",
  "description": "Description...",
  "tags": ["Tech1", "Tech2"],
  "link": {
    "url": "https://example.com",
    "text": "View Project"
  }
}
```

3. Save and refresh - that's it!

### Update Skills

1. Open `data/content.json`
2. Edit `about.skills` array
3. Add/remove/modify skills
4. Save and refresh

### Change Contact Info

1. Open `data/content.json`
2. Update `personal` object
3. Update `contact.methods` array
4. Save and refresh

## Testing

After making changes:

1. **Validate JSON**: Use [JSONLint](https://jsonlint.com/) to check for syntax errors
2. **Local Test**: Open `index.html` in browser (may need local server for fetch to work)
3. **Check Console**: Open DevTools to see any loading errors

## Troubleshooting

### Content Not Loading?

- **Check JSON syntax**: One missing comma breaks everything
- **Check file path**: Ensure `data/content.json` exists
- **Check console**: Look for errors in browser DevTools
- **Use local server**: Some browsers block local file fetch

### Run Local Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (if you have http-server installed)
npx http-server

# Then visit: http://localhost:8000
```

## Best Practices

1. **Validate before committing**: Always check JSON syntax
2. **Keep backups**: Save copies before major changes
3. **Test locally**: Preview changes before deploying
4. **Use semantic HTML**: `<strong>`, `<em>`, etc. in text
5. **Consistent formatting**: Keep JSON properly indented

## Future Enhancements

Potential additions:

- Multi-language support (add `content-es.json`, etc.)
- CMS integration
- Admin panel for editing
- Form submission handler
- Blog posts from JSON
- Testimonials section
- Analytics integration

## Example: Full Update Workflow

1. Edit `data/content.json`:
   ```json
   "projects": {
     "items": [
       {
         "title": "My New Project",
         ...
       }
     ]
   }
   ```

2. Validate JSON at [JSONLint](https://jsonlint.com/)

3. Save file

4. Refresh browser (or deploy)

5. Done! ✨

---

**Pro Tip**: Keep the original `content.json` as a template for adding new content.
