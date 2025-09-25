# Static Images Folder

This folder contains images that will be preserved during `npm run build`.

## How to use:

1. Add your images to this `static/images/` folder
2. Reference them in your code as `/images/filename.ext`
3. They will be copied to the build output and never deleted!

## Current Images:
- Add your `premium-floating-headphones-stockcake-removebg-preview.png` here
- Any other static images you want to preserve

## Example:
```javascript
<img src="/images/your-image.png" alt="Your Image" />
```

This folder is configured in `webpack.config.js` with `CopyWebpackPlugin` to be preserved during builds.
