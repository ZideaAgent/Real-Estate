# GitHub Photo Upload Setup Guide for Vercel Deployment

This guide explains how to set up the GitHub photo upload functionality in the RentEase admin panel, specifically configured for your [Vercel deployment](https://vercel.com/zideas-projects/real-estate).

## Prerequisites

1. A GitHub account (you already have: `zideas-projects`)
2. Your GitHub repository: `real-estate` (already deployed on Vercel)
3. GitHub Personal Access Token

## Step 1: Create a GitHub Personal Access Token

1. Go to GitHub.com and sign in with your `zideas-projects` account
2. Click your profile picture → Settings
3. Scroll down to "Developer settings" (bottom left)
4. Click "Personal access tokens" → "Tokens (classic)"
5. Click "Generate new token" → "Generate new token (classic)"
6. Give it a name like "RentEase Media Upload"
7. Select scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (since your real-estate repo is public)
8. Click "Generate token"
9. **Copy the token immediately** (you won't see it again!)

## Step 2: Repository Configuration

Your repository `zideas-projects/real-estate` is already set up and deployed on Vercel. The upload system will create:

- `/assets/images/` - for all property photos
- `/assets/videos/` - for property videos

## Step 3: Admin Panel Configuration

1. Go to your admin page (`/admin.html`)
2. Fill in the GitHub upload section:
   - **GitHub Username**: `zideas-projects` (pre-filled)
   - **Repository Name**: `real-estate` (pre-filled)
   - **GitHub Personal Access Token**: The token you created in Step 1

## Step 4: Upload Media Files

1. Click "Select Media Files" to choose image and video files
2. Click "Upload to GitHub" to start the upload process
3. Files will be uploaded to the appropriate folders:
   - Images → `/assets/images/timestamp-number.ext`
   - Videos → `/assets/videos/timestamp-number.ext`
4. URLs will be automatically added to the "Image URLs" field
5. Save the property to store the URLs in Firebase

## How It Works with Vercel

- Photos and videos are uploaded to GitHub using the GitHub API
- Files are organized in Vercel-friendly folder structure
- **Vercel URLs**: `https://real-estate-zideas-projects.vercel.app/assets/images/filename.jpg`
- **GitHub Raw URLs**: `https://raw.githubusercontent.com/zideas-projects/real-estate/main/assets/images/filename.jpg`
- URLs are automatically added to the property form for Firebase storage

## Vercel Deployment Integration

- **Automatic Deployment**: When you upload files to GitHub, Vercel will automatically redeploy your site
- **CDN**: Vercel provides global CDN for fast media delivery
- **Custom Domain**: Your media will be available at your Vercel domain
- **Version Control**: Track all media changes in your GitHub repository

## Security Notes

- **Never commit your GitHub token to version control**
- The token has full repository access, so keep it secure
- Consider using Vercel environment variables in production
- You can revoke the token anytime from GitHub settings

## Troubleshooting

### "GitHub API error: 401 Unauthorized"
- Check your username (`zideas-projects`) and repository name (`real-estate`)
- Ensure the token has the correct permissions
- Verify the repository exists and is accessible

### "GitHub API error: 403 Forbidden"
- Check if the repository is private and the token has access
- Ensure the token has `repo` scope for private repos

### Media not displaying after upload
- **Vercel URLs**: Wait for Vercel to redeploy (usually 1-2 minutes)
- **GitHub Raw URLs**: Should work immediately
- Verify the file paths in the URLs are correct
- Check Vercel deployment logs for any build errors

## File Structure

After upload, your repository will have:
```
real-estate/
├── assets/
│   ├── images/
│   │   ├── 1703123456789-1.jpg
│   │   ├── 1703123456790-2.png
│   │   └── ...
│   └── videos/
│       ├── 1703123456791-1.mp4
│       └── ...
├── index.html
├── app.js
└── ...
```

## Benefits of Vercel Integration

- **Automatic CDN**: Global content delivery network
- **Instant Deployments**: Automatic redeployment on GitHub pushes
- **Custom Domain**: Use your own domain for media
- **Analytics**: Track media performance and usage
- **Edge Functions**: Potential for image optimization
- **Free Tier**: Generous free hosting for media files

## Next Steps

1. Set up your GitHub Personal Access Token
2. Configure the admin panel with your credentials
3. Upload your first media files
4. Wait for Vercel to redeploy
5. Your media will be available at your Vercel domain!
