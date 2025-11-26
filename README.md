# Ihsan - Daily Islamic Reminder App

A beautiful, glassmorphic React application that generates shareable cards for Quran verses and Hadiths.

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed on your computer.

### Steps
1. **Clone or Download** this repository.
2. Open your terminal/command prompt and navigate to the project folder.
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Start the Development Server**:
   ```bash
   npm start
   ```
   *Note: Depending on your setup (Vite/CRA), this might be `npm run dev`.*
5. Open your browser and visit `http://localhost:3000` (or the port shown in your terminal).

---

## ⚙️ Configuration Guide

### 1. How to Change the Website URL in WhatsApp Messages

Currently, the app automatically uses the URL of the page you are currently on (e.g., `localhost` when testing, or your Vercel link when deployed).

To **hardcode** a specific URL (so it always shares your production link, even when testing locally):

1. Open `App.tsx`.
2. Search for the function `handleWhatsAppShare`.
3. Locate this line:
   ```typescript
   const appUrl = window.location.href;
   ```
4. Change it to your specific domain string:
   ```typescript
   const appUrl = "https://your-custom-domain.com";
   ```

### 2. How to Change the URL in the Footer

To change the link displayed at the very bottom of the page:

1. Open `App.tsx`.
2. Scroll down to the bottom of the `return` statement (around line 200).
3. Find this section:
   ```tsx
   <a href="#" className="...">
     www.ihsan-app.com
   </a>
   ```
4. Update the text inside the tag and the `href` attribute:
   ```tsx
   <a href="https://your-website.com" target="_blank" rel="noopener noreferrer" className="...">
     your-website.com
   </a>
   ```

## 📦 Deployment

This project is ready to be deployed on **Vercel**:

1. Push your code to GitHub.
2. Go to Vercel and import the project.
3. It will automatically detect the settings. Click **Deploy**.
