# Facts – Interactive Fact Web App

Facts is a simple and responsive web application that allows users to browse, submit, and react to interesting facts. It is built using React and connected to a Supabase backend for real-time data handling. The project was designed as a clean and lightweight single-page application.

## Features

- View a list of facts with categories
- Submit your own facts with a source link
- React to facts with emoji-style voting
- Filter facts by topic
- Smooth scroll and reveal animations

## Live Site

The app is deployed on GitHub Pages:  
https://yohaiabi.github.io/Facts/

## Getting Started

To run the project locally:

1. Clone the repository:
   git clone https://github.com/yohaiabi/Facts.git
   cd Facts

2. Install dependencies:
   npm install

3. Start the development server:
   npm run dev

4. Open your browser and go to:
   http://localhost:5173

> Make sure you have Node.js and npm installed.

## Project Structure

Key files and folders:

- public/  
  Contains static files such as index.html, logo.png, and manifest.json

- src/  
  Contains App.js (main component), index.js (entry point), style.css (custom styles), and supabase.js (backend config)

- package.json / package-lock.json  
  Define the project's dependencies and scripts

- .gitignore  
  Specifies which files should be excluded from version control

- build/  
  Generated when running npm run build – should not be committed

## Tech Stack

- React
- Supabase
- Vite
- CSS (Vanilla)
