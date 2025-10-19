# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d9147871-a675-45f7-9b8e-99973ac8270c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d9147871-a675-45f7-9b8e-99973ac8270c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d9147871-a675-45f7-9b8e-99973ac8270c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Optional: Dune Analytics Embed

You can show a live Dune chart inside the Analytics page in two ways:

- Set an environment variable in a `.env` file at the project root:

	- `VITE_DUNE_EMBED_URL=https://dune.com/embeds/<chart-id>/<viz-id>`

- Or paste the URL directly in the Analytics page UI; it will be saved in localStorage.

Notes:
- Dune public embeds do not require an API key.
- If you later enable Beezie AI predictions, we can add an environment variable like `VITE_BEEZIE_API_KEY` and a small server proxy if needed to keep keys private.

## Beezie AI Predictions (Gemini)

To enable AI predictions in the Analytics page:

1) Create a `.env` file at the project root (same level as package.json) with:

```
GEMINI_API_KEY=YOUR_KEY_HERE
```

2) Start both the server and the frontend together:

```
npm run dev:full
```

This uses the backend proxy at `/api/beezie/predict`, so your key remains server-side.
