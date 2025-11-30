# Portfolio

A modern, responsive portfolio website built with HTML, CSS, and JavaScript.
Features a "Premium Modern" aesthetic with dark mode, glassmorphism, and dynamic interactions.

## Features

- **Premium Modern Design**: Sleek dark theme with vibrant accents and glassmorphism.
- **Responsive Layout**: Fully responsive design that works on all devices.
- **Dynamic Content**: Content is loaded from a JSON file for easy updates.
- **PDF Resume Generation**: Client-side PDF generation for resumes.
- **Project Showcase**: Highlighted projects with detailed descriptions.

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts)
- **Icons**: CSS-based and SVG
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/catsika/portfolio.git
   ```

2. Open `index.html` in your browser.
   
   *Note: For the best experience (and to avoid CORS issues with JSON loading), use a local server:*
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js (Live Server)
   npx live-server .
   ```

## Customization

Edit `data/content.json` to update your personal information, projects, and skills without touching the HTML.

## License

[MIT](LICENSE) © 2025 Clifford Atsika
