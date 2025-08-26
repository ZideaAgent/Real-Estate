# Cloudinary Setup Guide

## Overview
This project now includes Cloudinary integration for image uploads. Images are uploaded to Cloudinary and the URLs are stored in Firebase for display in property cards.

## Setup Steps

### 1. Cloudinary Account Setup
- You already have your Cloudinary credentials:
  - Cloud Name: `dycisbm24`
  - API Key: `977787321868472`
  - API Secret: `X4WFZyzX9PLv3SS9qnV1XKcCQPc`

### 2. Create Upload Preset (Recommended)
For better security and control, create a custom upload preset:

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to Settings > Upload
3. Scroll to "Upload presets"
4. Click "Add upload preset"
5. Set:
   - Name: `rentease_properties` (or any name you prefer)
   - Signing Mode: `Unsigned` (for client-side uploads)
   - Folder: `properties` (optional, for organization)
6. Save the preset

### 3. Update Configuration
In `admin.js`, update the `uploadPreset` value:

```javascript
const cloudinaryConfig = {
  cloudName: 'dycisbm24',
  apiKey: '977787321868472',
  uploadPreset: 'rentease_properties' // Replace with your custom preset name
};
```

### 4. Usage
1. Go to the admin page
2. Select images using the file upload input
3. Images will automatically upload to Cloudinary
4. URLs are stored in Firebase with other property data
5. Images appear in property cards on the main site

## Security Notes
- The current setup uses unsigned uploads (suitable for public images)
- For production, consider using signed uploads with server-side validation
- API key is public but upload preset controls what can be uploaded

## Troubleshooting
- If uploads fail, check that your upload preset exists and allows unsigned uploads
- Ensure your Cloudinary account has sufficient storage/bandwidth
- Check browser console for error messages

## Benefits
- Fast, reliable image hosting
- Automatic optimization and resizing
- CDN delivery worldwide
- No server storage needed
- Easy integration with Firebase
