# Gemini Code Assistant Context

This document provides context for the Gemini Code Assistant to understand the project structure and key components.

## Project Overview

This project is a modern portfolio and CV website. It appears to have two main parts: a `portfolio-site` directory and a `src` directory at the root level. It's unclear if these are two separate websites or if one is a component of the other. The root `package.json` suggests that the main entry point is `src/index.html`.

## File Structure

The project has the following structure:

```
/
├───CONTENT_GUIDE.md
├───FEATURE_GUIDE.md
├───GEMINI.md
├───IMPROVEMENTS.md
├───package.json
├───QUICK_START.md
├───README.md
├───.git/
├───portfolio-site/
│   ├───package.json
│   ├───README.md
│   └───src/
│       ├───index.html
│       ├───assets/
│       │   └───resume.pdf
│       ├───components/
│       │   ├───about.html
│       │   ├───contact.html
│       │   ├───header.html
│       │   └───projects.html
│       ├───css/
│       │   └───styles.css
│       └───js/
│           └───main.js
└───src/
    ├───index.html
    ├───assets/
    │   └───resume.pdf
    ├───css/
    │   ├───styles.css
    │   └───styles.css.backup
    ├───data/
    │   └───content.json
    └───js/
        ├───content-loader.js
        ├───main.js
        └───pdf-generator.js
```

## Key Files

*   `package.json`: Defines project metadata, scripts, and dependencies.
*   `src/index.html`: The main HTML file for the portfolio website.
*   `src/css/styles.css`: The main stylesheet for the portfolio website.
*   `src/js/main.js`: The main JavaScript file for the portfolio website.
*   `src/js/content-loader.js`: Likely loads dynamic content from `src/data/content.json`.
*   `src/js/pdf-generator.js`: Potentially generates a PDF version of the resume.
*   `src/data/content.json`: Contains the data for the portfolio website.
*   `portfolio-site/`: This directory seems to contain a separate, self-contained portfolio site. It has its own `package.json` and `src` directory. It might be a different version or a submodule.

## Scripts

The following scripts are available in the root `package.json`:

*   `start`: Starts a live server for the `src` directory on port 3000.
*   `dev`: Starts a live server for the `src` directory on port 3000 and watches for changes.
*   `build`: A placeholder for a build step.

This information should help Gemini to understand the project and provide better assistance.
