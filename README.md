# Portfolio Website

A modern, clean, and minimal portfolio/CV website with a professional developer aesthetic.

## 🎨 Design

- **Color Scheme**: Modern & Tech (Clean + Minimal)
  - Background: `#F8FAFC`
  - Text: `#1E293B`
  - Accent: `#3EDFA3` (Keymint mint green)
  - Secondary: `#13B388`
  - Muted: `#CBD5E1`

## 🚀 Features

- Responsive design (mobile-first)
- Smooth scrolling navigation
- Animated sections on scroll
- Contact form
- Project showcase
- Skills & expertise display
- Modern UI with accessibility features

## 📦 Getting Started

### Prerequisites

- Node.js (optional, for development server)

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies (optional):
   ```bash
   npm install
   ```

### Running the Site

#### Option 1: Using Live Server (Recommended)
```bash
npm start
```
This will start a development server at `http://localhost:3000`

#### Option 2: Open in Browser
Simply open `src/index.html` in your web browser

## 📁 Project Structure

```
portfolio-site/
├── src/
│   ├── index.html          # Main HTML file
│   ├── css/
│   │   └── styles.css      # Styles with your color scheme
│   ├── js/
│   │   └── main.js         # JavaScript functionality
│   └── assets/
│       └── resume.pdf      # Your resume (add your own)
├── package.json
└── README.md
```

## ✏️ Customization

### Update Your Information

1. **Personal Info**: Edit `src/index.html`
   - Update name, title, and description
   - Change email, LinkedIn, and GitHub links
   - Add your own project details

2. **Skills**: Modify the skills section in `src/index.html`
   - Update technologies you work with
   - Customize skill categories

3. **Projects**: Replace placeholder projects
   - Add project images in `src/assets/`
   - Update project descriptions and links

4. **Resume**: Replace `src/assets/resume.pdf` with your own resume

### Styling

All styles are in `src/css/styles.css`. The color scheme uses CSS variables for easy customization:

```css
:root {
    --color-bg: #F8FAFC;
    --color-text: #1E293B;
    --color-accent: #3EDFA3;
    --color-accent-dark: #13B388;
    --color-muted: #CBD5E1;
}
```

## 🌐 Deployment

### GitHub Pages
1. Push your code to GitHub
2. Go to Settings > Pages
3. Select your main branch
4. Your site will be live at `https://yourusername.github.io/repository-name`

### Netlify
1. Drag and drop the `src` folder to Netlify
2. Your site will be live instantly

### Vercel
1. Import your GitHub repository
2. Deploy with one click

## 📝 License

MIT License - feel free to use this template for your own portfolio!

## 🤝 Contributing

Feel free to fork this project and customize it for your own use.

---

Built with ❤️ and modern web technologies
