# Uploads Folder - PROTECTED FROM BUILD DELETION

This folder contains uploaded files from your admin panel and is now **PROTECTED** from being deleted during `npm run build`.

## How it works:
- **Before Fix**: `npm run build` would delete entire `public/` folder including uploads
- **After Fix**: Webpack is configured to `keep: /uploads\//` during clean process
- **Result**: Your uploaded product images are safe! 🎉

## Folder Structure:
```
public/uploads/
├── products/           # Product images uploaded via admin
│   ├── product-xxx.jpg
│   └── product-yyy.png
└── README.md          # This file
```

## Configuration Details:
The protection is configured in `webpack.config.js`:
```javascript
output: {
  clean: {
    keep: /uploads\//  // Keep uploads folder during build
  }
}
```

## Benefits:
✅ Admin uploaded images survive builds
✅ No need to re-upload products after deployment
✅ Automatic protection for all files in uploads folder
✅ Works with any file type (jpg, png, pdf, etc.)

**Your uploaded product images will never disappear again!**
