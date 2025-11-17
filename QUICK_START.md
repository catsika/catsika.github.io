# Quick Start Guide - Portfolio Content Management

## 🎯 Update Your Content in 3 Easy Steps

### Step 1: Open the Content File
Navigate to: `src/data/content.json`

### Step 2: Edit Your Information
Update any of the following sections:

#### Change Your Name & Title
```json
"personal": {
  "name": "Your Name Here",
  "title": "Your Title Here",
  "email": "your@email.com"
}
```

#### Add a New Project
```json
"projects": {
  "items": [
    {
      "featured": true,
      "title": "Your Project",
      "subtitle": "Project Type",
      "description": "What it does...",
      "tags": ["Tech1", "Tech2"],
      "link": {
        "url": "https://yourproject.com",
        "text": "View Project"
      }
    }
  ]
}
```

#### Update Skills
```json
"skills": [
  {
    "number": "01",
    "title": "Your Skill",
    "description": "Skill details..."
  }
]
```

### Step 3: Save & View
1. Save the `content.json` file
2. Refresh your browser
3. Done! ✨

## ⚠️ Important Notes

1. **JSON Syntax**: Be careful with commas and quotes
2. **Validate**: Use [JSONLint.com](https://jsonlint.com) to check for errors
3. **Local Server**: You may need to run a local server for the fetch API to work

## 🚀 Running a Local Server

### Option 1: Python (Easiest)
```bash
cd src
python -m http.server 8000
```
Then visit: http://localhost:8000

### Option 2: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 3: Node.js
```bash
npx http-server src
```

## ✅ What You Can Update

- ✅ Personal information (name, email, GitHub)
- ✅ Hero section text and metadata
- ✅ About section paragraphs and quote
- ✅ All 6 skills with descriptions
- ✅ Projects (add/remove/edit)
- ✅ Project tags and links
- ✅ Contact information
- ✅ Footer links and copyright

## 📝 Example: Adding a New Project

```json
{
  "featured": false,
  "title": "My Awesome Project",
  "subtitle": "Web Application",
  "description": "A revolutionary app that solves problem X with feature Y.",
  "tags": ["React", "Node.js", "MongoDB"],
  "link": {
    "url": "https://github.com/username/project",
    "text": "View on GitHub"
  }
}
```

## 🔍 Troubleshooting

### Content Not Showing?
1. Check browser console (F12) for errors
2. Validate JSON syntax
3. Make sure you're running a local server
4. Clear browser cache

### JSON Syntax Error?
- Missing comma between items
- Extra comma at end of array/object
- Unmatched quotes or brackets
- Use JSONLint.com to find the error

## 📚 Full Documentation

See `CONTENT_GUIDE.md` for complete documentation.

---

**Need Help?** Check the console (F12) for error messages!
