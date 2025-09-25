import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-api-key');

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Convert file to base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Extract product information from image
  async extractProductInfo(imageFile) {
    try {
      const base64Image = await this.fileToBase64(imageFile);
      
      const prompt = `
        Analyze this product image and extract the following information in JSON format:
        {
          "name": "Product name (be descriptive and specific)",
          "description": "Detailed product description (2-3 sentences)",
          "category": "Product category (e.g., Electronics, Clothing, Food, etc.)",
          "estimatedPrice": "Estimated price in USD (number only, no currency symbol)",
          "features": ["feature1", "feature2", "feature3"],
          "tags": ["tag1", "tag2", "tag3"],
          "color": "Primary color if visible",
          "brand": "Brand name if visible",
          "condition": "new/used/refurbished",
          "extractedText": "Any text visible in the image"
        }

        Guidelines:
        - Be specific and accurate in product naming
        - Provide realistic price estimates based on what you see
        - Create meaningful categories that could be used in an e-commerce store
        - Extract all visible text accurately
        - If information is not clearly visible, use "Unknown" or reasonable estimates
        - Make the description marketing-friendly and appealing
      `;

      const imagePart = {
        inlineData: {
          data: base64Image,
          mimeType: imageFile.type
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const productData = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: productData
        };
      } else {
        throw new Error('Could not extract JSON from AI response');
      }
    } catch (error) {
      console.error('Gemini API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to analyze image'
      };
    }
  }

  // Generate product variations or suggestions
  async generateProductVariations(productData) {
    try {
      const prompt = `
        Based on this product: "${productData.name}" in category "${productData.category}", 
        suggest 3-5 related product variations or accessories that could be sold together.
        
        Return as JSON array:
        [
          {
            "name": "Variation name",
            "description": "Brief description",
            "estimatedPrice": "Price estimate"
          }
        ]
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const variations = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: variations
        };
      }
      
      return { success: false, error: 'Could not generate variations' };
    } catch (error) {
      console.error('Gemini Variations Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate variations'
      };
    }
  }

  // Generate SEO-friendly product content
  async generateSEOContent(productData) {
    try {
      const prompt = `
        Create SEO-optimized content for this product: "${productData.name}"
        
        Return as JSON:
        {
          "seoTitle": "SEO-friendly title (50-60 characters)",
          "metaDescription": "Meta description (150-160 characters)",
          "keywords": ["keyword1", "keyword2", "keyword3"],
          "longDescription": "Detailed product description for marketing (2-3 paragraphs)",
          "bulletPoints": ["benefit1", "benefit2", "benefit3"]
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const seoData = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          data: seoData
        };
      }
      
      return { success: false, error: 'Could not generate SEO content' };
    } catch (error) {
      console.error('Gemini SEO Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate SEO content'
      };
    }
  }
}

export default new GeminiService();
