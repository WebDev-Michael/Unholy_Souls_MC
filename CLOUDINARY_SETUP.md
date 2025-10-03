# Cloudinary Image Upload Setup

This document explains how to set up Cloudinary for image uploads in the Unholy Souls MC application.

## Prerequisites

1. A Cloudinary account (sign up at [cloudinary.com](https://cloudinary.com))
2. Your Cloudinary credentials (Cloud Name, API Key, API Secret)

## Setup Instructions

### 1. Get Your Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the "Dashboard" section
3. Copy your:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp backend/env.example backend/.env
   ```

2. Update `backend/.env` with your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   CLOUDINARY_API_KEY=your_api_key_here
   CLOUDINARY_API_SECRET=your_api_secret_here
   ```

### 3. Test the Configuration

Run the test script to verify your Cloudinary setup:

```bash
cd backend
node test-cloudinary.js
```

You should see:
- ✅ Cloudinary connection successful

### 4. Start the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Features

### Drag and Drop Upload
- Users can drag and drop image files directly onto the upload area
- Visual feedback when dragging files over the drop zone
- Image preview before upload
- File size and name display
- Available in both Gallery and Member Management sections

### File Upload
- Click to browse and select image files
- Support for common image formats (JPG, PNG, GIF, WebP, etc.)
- 10MB file size limit
- Automatic image optimization via Cloudinary

### URL Upload (Fallback)
- Users can still enter direct image URLs
- URL validation to prevent search result pages
- Support for direct image links

### Member Profile Images
- Drag and drop support for member profile pictures
- Same upload functionality as gallery images
- Optional image upload (members can be added without images)
- Images stored in organized Cloudinary folders

## How It Works

1. **File Selection**: User drags/drops or selects an image file
2. **Preview**: Image preview is shown immediately
3. **Upload**: When form is submitted, file is uploaded to Cloudinary
4. **Storage**: Cloudinary returns a secure URL
5. **Database**: URL is stored in the database for the frontend to display

## API Endpoints

### POST /upload
Uploads an image file to Cloudinary.

**Request:**
- Content-Type: multipart/form-data
- Body: FormData with 'image' field containing the file

**Response:**
```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/unholy-souls-mc/example.jpg",
  "publicId": "unholy-souls-mc/example",
  "width": 1920,
  "height": 1080,
  "format": "jpg",
  "bytes": 245760
}
```

## Troubleshooting

### Common Issues

1. **"Cloudinary connection failed"**
   - Check your credentials in the .env file
   - Ensure all three values are set correctly
   - Verify your Cloudinary account is active

2. **"Upload failed" error**
   - Check file size (must be under 10MB)
   - Ensure file is a valid image format
   - Check network connection

3. **Images not displaying**
   - Verify the imageUrl is being saved correctly in the database
   - Check if the Cloudinary URL is accessible
   - Ensure CORS is configured properly

### Testing Upload

You can test the upload functionality by:

1. **Gallery Images**:
   - Go to the admin panel
   - Click "Add New Image"
   - Either drag and drop an image file, click to browse and select a file, or enter a direct image URL

2. **Member Profile Images**:
   - Go to the admin panel
   - Click "Add New Member" or edit an existing member
   - In the Profile Image section, either drag and drop an image file, click to browse and select a file, or enter a direct image URL

## Security Notes

- File uploads are limited to image files only
- File size is limited to 10MB
- Images are stored in a dedicated Cloudinary folder
- All uploads go through validation before processing

## Production Deployment

For production deployment:

1. Set environment variables in your hosting platform
2. Ensure CLOUDINARY_* variables are properly configured
3. Test the upload functionality after deployment
4. Monitor Cloudinary usage and costs

## Cost Considerations

- Cloudinary offers a free tier with limited storage and transformations
- Monitor your usage to avoid unexpected charges
- Consider implementing image compression and optimization
- Set up usage alerts in your Cloudinary dashboard
