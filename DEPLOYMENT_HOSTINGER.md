# How to Deploy Islamabad City Guide on Hostinger

This application is built with **React + Vite + TypeScript + Tailwind CSS** with a full-stack **Express Node.js** backend (`server.ts`).

Depending on your Hostinger plan, choose **Method 1** (recommended for full-stack with AI assistant & backend API) or **Method 2** (for standard shared web hosting).

---

## Method 1: Hostinger VPS / Node.js Hosting (Recommended - Full Stack)

Use this method if you have a **Hostinger VPS** (Ubuntu/Debian) or a plan that supports running Node.js services. This allows the backend APIs (`/api/listings`, `/api/assistant`, reviews, submissions, and admin features) to run with persistence.

### Step 1: Connect to your Hostinger VPS via SSH
```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Node.js (v20+ or v22)
```bash
# Update package list and install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs git
node -v # Should display v20 or higher
```

### Step 3: Install PM2 Process Manager
```bash
npm install -g pm2
```

### Step 4: Upload or Clone the Project
You can clone via Git or upload the project zip to `/var/www/islamabad-guide`:
```bash
mkdir -p /var/www/islamabad-guide
cd /var/www/islamabad-guide
# Clone your repository or extract files here
```

### Step 5: Install Dependencies & Build
```bash
npm install
npm run build
```

### Step 6: Configure Environment Variables
Create your `.env` file in `/var/www/islamabad-guide/.env`:
```bash
PORT=3000
NODE_ENV=production
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### Step 7: Start the Server with PM2
```bash
pm2 start "npm start" --name "islamabad-guide"
pm2 save
pm2 startup
```

### Step 8: Configure Nginx Reverse Proxy (Domain to Port 3000)
Edit `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Test and restart Nginx:
```bash
nginx -t
systemctl restart nginx
```

Install a free SSL certificate via Certbot:
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## Method 2: Hostinger Shared / Cloud Web Hosting (hPanel File Manager)

If you have Hostinger **Premium Web Hosting**, **Business Web Hosting**, or **Cloud Startup** using hPanel (standard `public_html`), you can deploy the production build as a static web app.

### Step 1: Build the Project Locally
In your terminal, run:
```bash
npm install
npm run build
```
This will compile the website into the `dist/` directory.

### Step 2: Open Hostinger hPanel
1. Log in to your Hostinger account at [hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Go to **Websites** and click **Manage** next to your domain.
3. Open **Files** > **File Manager**.

### Step 3: Upload the Build Files to `public_html`
1. Navigate to the `public_html` directory of your website.
2. (Optional) Remove any default placeholder files (e.g., `default.php`).
3. Upload all contents from your local `dist/` folder:
   - `index.html`
   - `assets/` folder
   - `images/` folder
   - `.htaccess` file (already included in `public/.htaccess`)

### Step 4: Verify `.htaccess` for React SPA Routing
Ensure the `.htaccess` file exists in `public_html/` with the following content (enables clean URLs and client-side page routing):
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 5: Enable Free SSL Certificate in hPanel
1. In hPanel, navigate to **Security** > **SSL**.
2. Click **Install SSL** (Hostinger provides lifetime free Let's Encrypt SSL).
3. Toggle on **Force HTTPS**.

Your website will now be live on your custom domain!
