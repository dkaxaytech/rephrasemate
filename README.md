# RephraseMate ✍️🤖

> **RephraseMate** is a full-stack, web-based AI Rephrase Agent that takes any sentence, paragraph, or draft and automatically generates four distinct variations simultaneously:
> 1. **Formal** — Polished, professional English suitable for reports, executives, and academic writing.
> 2. **Casual** — Friendly, natural conversational English for team messaging and chat.
> 3. **Email Format** — A ready-to-send email with an appropriate Subject line and formatted body.
> 4. **Simple English** — Clear, jargon-free English that anyone can understand.

---

## 🚀 Features

- **Concurrent 4-Tone Generation**: Generates Formal, Casual, Email, and Simple English versions in a single structured Gemini API request.
- **Strict Factual Preservation**: Preserves 100% of facts, names, dates, times, numerical data, technical terms, and URLs.
- **Non-Conversational Agent**: Rephrases the text from the author's viewpoint without answering or replying to questions in the text.
- **One-Click Copy & Copy All**: Individual copy buttons with visual feedback tooltips, plus a combined "Copy All Variations" action.
- **Safe & Private Architecture**:
  - `GEMINI_API_KEY` is kept strictly on the Node.js Express backend and never exposed to the client.
  - User text is never saved or logged in server console outputs.
  - 5,000-character input validation and 64KB JSON body limits.
- **Responsive & Modern UI**: Built with React 19, Tailwind CSS v4, and Lucide icons.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Motion
- **Backend**: Node.js, Express 4, tsx, dotenv
- **AI Engine**: Google Gen AI SDK (`@google/genai`) using `gemini-3.8-flash` (with automatic fallback to `gemini-3.1-flash-lite`)

---

## 📦 Local Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/<YOUR_GITHUB_USERNAME>/rephrasemate.git
cd rephrasemate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 4. Run in development mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production build
```bash
npm run build
npm start
```

---

## 📤 Pushing This Project to GitHub

Follow these simple steps in your terminal to publish the project to your GitHub account:

### Step 1: Initialize Git and Commit
```bash
git init
git add .
git commit -m "Initial commit: RephraseMate AI Agent"
```

### Step 2: Create a New Repository on GitHub
1. Go to [GitHub New Repository](https://github.com/new).
2. Set the repository name to `rephrasemate`.
3. Choose **Public** or **Private**.
4. **Do NOT** check "Add a README" or ".gitignore" (these already exist in the project).
5. Click **Create repository**.

### Step 3: Link and Push
Replace `<YOUR_GITHUB_USERNAME>` with your GitHub username:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/rephrasemate.git
git push -u origin main
```

---

## 🌐 Deploy Directly on GitHub Pages

The repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and hosts your app directly on **GitHub Pages** (`https://<username>.github.io/rephrasemate/`).

### How to Enable GitHub Pages in 2 Clicks:

1. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
2. In your GitHub repository:
   - Click on the **Settings** tab.
   - On the left sidebar, click **Pages** (under "Code and automation").
   - Under **Build and deployment** > **Source**, change from "Deploy from a branch" to:
     👉 **GitHub Actions**
3. That's it! 
   - Click the **Actions** tab to watch the workflow build and deploy your site.
   - Once finished (takes ~45 seconds), your live URL will be shown right on the Pages settings page:
     `https://<YOUR_GITHUB_USERNAME>.github.io/rephrasemate/`

### 🔒 How Security & AI Work on GitHub Pages:
- GitHub Pages is a static host, so your `GEMINI_API_KEY` is **never** committed to GitHub or exposed in browser code.
- The frontend on GitHub Pages connects directly to the backend API (`/api/rephrase`) with CORS enabled.
- You can customize the API endpoint at build time using the optional `VITE_API_URL` repository secret if you deploy your own server, or use the pre-configured backend.

---

## 📄 License

Apache-2.0
