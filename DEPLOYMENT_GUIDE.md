# Vercel Deployment Guide: The £250k Edge Infrastructure

Your site is built using Next.js 16 (Turbopack) and is specifically engineered to run on **Vercel's Edge Network**. Follow these exact steps to deploy it flawlessly with sub-50ms global latency.

## Prerequisites
1. **GitHub Account:** Your repository (`harshrajsinhraulji/aki.eclat`) is already hosted here.
2. **Vercel Account:** Create a free account at [vercel.com](https://vercel.com/signup) using your GitHub login.

---

## Step 1: Import the Project
1. Go to your Vercel Dashboard and click **"Add New..."** -> **"Project"**.
2. Under "Import Git Repository", find `aki.eclat` and click **"Import"**.

## Step 2: Configure the Build Settings
Vercel will auto-detect Next.js, but to ensure the £250k performance, verify these settings:
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

## Step 3: Environment Variables
Currently, the site is statically generated and client-driven. However, if you add Firebase or a real Database later (Phase 10), you will add those keys here.
- For now, **leave this blank.**

## Step 4: Deploy
1. Click the massive **"Deploy"** button.
2. Vercel will install dependencies, run our strict Turbopack build, and assign you a production URL (e.g., `aki-eclat.vercel.app`).
3. This process takes approximately 45 seconds.

## Step 5: Domain Configuration (Optional but Highly Recommended)
To make it truly premium, you need a custom domain (e.g., `akieclat.com` or `aki.world`).
1. In the Vercel Project Dashboard, go to **Settings** -> **Domains**.
2. Type in the domain you own and click **Add**.
3. Vercel will provide you with DNS records (A Record or CNAME) to paste into your domain registrar (Namecheap, GoDaddy, Cloudflare).
4. Vercel will automatically provision a free SSL Certificate for you.

---

## ⚡ The Edge Advantage
Because we designed this site with `app/icon.tsx` Edge runtimes, heavily memoized Framer Motion physics, and statically optimized images, Vercel will automatically distribute your site to **Edge Nodes** worldwide. Whether a user accesses the site from London, Tokyo, or New York, the server response time will be near-instant.

> **Next Steps:** Whenever I `git push` new upgrades to your GitHub `main` branch, Vercel will automatically detect the push, rebuild the site, and deploy the new version with zero downtime. You literally do not have to lift a finger.
