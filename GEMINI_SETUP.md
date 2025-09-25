# 🤖 AI Product Entry Setup Guide

## Get Your Free Gemini API Key

1. **Go to Google AI Studio**
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with your Google account

2. **Create API Key**
   - Click "Create API Key"
   - Select your project or create a new one
   - Copy the generated API key

3. **Add to Environment**
   - Open your `.env` file in the project root
   - Replace `your-gemini-api-key-here` with your actual API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Restart Server**
   - Stop the development server (Ctrl+C)
   - Run `npm run dev` again

## 🎯 How to Use AI Product Entry

1. **Access Admin Panel**
   - Login as admin
   - Go to Admin Panel → Products

2. **Use AI Product Entry**
   - Click "AI Product Entry" button
   - Upload a product image (JPG, PNG, up to 10MB)
   - Click "Analyze with AI"
   - Review and edit extracted information
   - Click "Create Product"

## ✨ Features

- **Automatic Product Detection**: AI identifies product name and type
- **Smart Categorization**: Creates categories automatically if they don't exist
- **Price Estimation**: Provides realistic price estimates
- **Text Extraction**: Reads any text visible in the image
- **Feature Detection**: Lists product features and benefits
- **Brand Recognition**: Identifies brand names when visible

## 🔧 Troubleshooting

- **"API key not configured"**: Make sure you've added the correct API key to `.env`
- **"Failed to analyze image"**: Check your internet connection and API key
- **"Image too large"**: Resize image to under 10MB
- **"Invalid image format"**: Use JPG, PNG, or JPEG formats only

## 💡 Tips for Best Results

- Use clear, well-lit product images
- Ensure the product is the main focus of the image
- Include product packaging or labels when possible
- Avoid blurry or low-quality images
- Make sure text on the product is readable

## 🆓 Free Tier Limits

Gemini API Free Tier includes:
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per month

Perfect for testing and small-scale usage!
