# cPanel Deployment Guide for Glorious Trade Hub

## Prerequisites
- cPanel hosting account with Node.js support
- MySQL database access
- SSH access (optional but recommended)
- Domain: weser.glorioustradehub.com

## Step 1: Database Setup

1. **Create MySQL Database**
   - Login to cPanel
   - Go to "MySQL Databases"
   - Create a new database (e.g., `weser_glorious_db`)
   - Create a database user with full privileges
   - Note down the database credentials

2. **Import Database Schema**
   - The application will automatically create tables on first run
   - Optionally, import `database-seed.sql` for sample data

## Step 2: File Upload

1. **Upload Project Files**
   - Upload all project files to your domain's public_html directory
   - Ensure all files maintain their directory structure

2. **Set Correct Permissions**
   - Set folders to 755 permissions
   - Set files to 644 permissions
   - Set uploads/ folder to 777 permissions

## Step 3: Environment Configuration

1. **Create .env file**
   ```bash
   cp .env.example .env
   ```

2. **Update .env with your cPanel details**
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_cpanel_db_user
   DB_PASSWORD=your_cpanel_db_password
   DB_NAME=your_cpanel_db_name

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secure-jwt-secret-key-here

   # Server Configuration
   PORT=3000
   NODE_ENV=production

   # Client URL
   CLIENT_URL=https://weser.glorioustradehub.com
   ```

## Step 4: Install Dependencies

### Option A: Via SSH (Recommended)
```bash
ssh your-username@your-server.com
cd public_html/weser.glorioustradehub.com
npm install
npm run build
```

### Option B: Via cPanel Terminal
- Open cPanel Terminal
- Navigate to your domain directory
- Run: `npm install && npm run build`

## Step 5: Node.js Application Setup

1. **Setup Node.js App in cPanel**
   - Go to "Node.js" in cPanel
   - Click "Create Application"
   - Set Node.js version (14+ recommended)
   - Set Application Root: `public_html/weser.glorioustradehub.com`
   - Set Application URL: `weser.glorioustradehub.com`
   - Set Application startup file: `server.js`

2. **Environment Variables**
   - Add all environment variables from your .env file in the cPanel Node.js interface

## Step 6: Start the Application

1. **Start via cPanel**
   - Click "Start" in the Node.js application interface

2. **Verify Installation**
   - Visit https://weser.glorioustradehub.com
   - You should see the Glorious Trade Hub homepage

## Step 7: SSL Certificate

1. **Enable SSL**
   - Go to "SSL/TLS" in cPanel
   - Install an SSL certificate (Let's Encrypt is free)
   - Enable "Force HTTPS Redirect"

## Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Verify database credentials in .env
   - Ensure database user has proper permissions
   - Check if database exists

2. **Application Won't Start**
   - Check Node.js error logs in cPanel
   - Verify all dependencies are installed
   - Ensure correct file permissions

3. **404 Errors for Routes**
   - Verify .htaccess file is uploaded
   - Check Apache mod_rewrite is enabled

4. **File Upload Issues**
   - Ensure uploads/ directory exists
   - Set proper permissions (777) for uploads/
   - Check file size limits in cPanel

### Performance Optimization:

1. **Enable Gzip Compression**
   - Already configured in .htaccess

2. **Browser Caching**
   - Cache headers are set in .htaccess

3. **CDN (Optional)**
   - Consider using a CDN for static assets

## Default Login Credentials

After importing the sample data:

**Admin Account:**
- Email: admin@glorioustradehub.com
- Password: admin123

**User Account:**
- Email: user@example.com
- Password: user123

**Important:** Change these passwords immediately after deployment!

## Maintenance

### Regular Tasks:
- Monitor error logs
- Update dependencies regularly
- Backup database regularly
- Monitor disk space usage

### Updates:
1. Upload new files
2. Run `npm install` if dependencies changed
3. Run `npm run build` for frontend changes
4. Restart the Node.js application

## Support

For deployment issues:
- Check cPanel error logs
- Contact your hosting provider for Node.js specific issues
- Refer to the main README.md for application documentation
