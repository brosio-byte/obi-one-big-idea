# OBI — One Big Idea™

A guided AI conversation that helps creators and coaches find the single idea their business grows from. Built for Creators Who Convert by Jon Brosio.

---

## Deploy to Vercel (step by step)

### Step 1: Create a GitHub repository

1. Go to github.com and sign in
2. Click the **+** icon in the top right → **New repository**
3. Name it `obi-one-big-idea`
4. Leave it **Public** (Vercel free tier works with public repos)
5. Click **Create repository**

### Step 2: Upload the code

On the repository page, click **uploading an existing file** and upload all the files from this folder. Make sure you maintain the folder structure:

```
obi-app/
  pages/
    api/
      chat.js
    _app.js
    index.js
  styles/
    globals.css
    Home.module.css
  .gitignore
  package.json
  README.md
```

Click **Commit changes**.

### Step 3: Deploy on Vercel

1. Go to vercel.com and sign in with your GitHub account
2. Click **Add New** → **Project**
3. Find your `obi-one-big-idea` repository and click **Import**
4. Leave all settings as default
5. Click **Deploy**

Vercel will build and deploy automatically. Takes about 60 seconds.

### Step 4: Add your Anthropic API key

1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Click **Add New**
3. Name: `ANTHROPIC_API_KEY`
4. Value: your API key from console.anthropic.com
5. Make sure **Production**, **Preview**, and **Development** are all checked
6. Click **Save**

### Step 5: Redeploy

1. Go to the **Deployments** tab
2. Click the three dots next to your latest deployment
3. Click **Redeploy**

Your app is now live at the URL Vercel gives you (something like `obi-one-big-idea.vercel.app`).

---

## Updating the CTA link

When you have a dedicated landing page for CWC, update the link in two places:

1. `pages/api/chat.js` — at the bottom of the SYSTEM_PROMPT, update the URL in the CTA section
2. `pages/index.js` — find `href="https://www.notion.so/..."` and replace with your new URL

Then commit the changes to GitHub. Vercel redeploys automatically.

---

## Local development

```bash
npm install
```

Create a `.env.local` file in the root:
```
ANTHROPIC_API_KEY=your_key_here
```

Then run:
```bash
npm run dev
```

Open http://localhost:3000
