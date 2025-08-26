# GitHub Photo Upload Setup Guide

This guide explains how to set up the GitHub photo upload functionality in the RentEase admin panel.

## Prerequisites

1. A GitHub account
2. A GitHub repository (can be the same one hosting your site)
3. GitHub Personal Access Token

## Step 1: Create a GitHub Personal Access Token

1. Go to GitHub.com and sign in
2. Click your profile picture → Settings
3. Scroll down to "Developer settings" (bottom left)
4. Click "Personal access tokens" → "Tokens (classic)"
5. Click "Generate new token" → "Generate new token (classic)"
6. Give it a name like "RentEase Photo Upload"
7. Select scopes:
   - `repo` (Full control of private repositories)
   - `public_repo` (if using a public repository)
8. Click "Generate token"
9. **Copy the token immediately** (you won't see it again!)

## Step 2: Repository Setup

1. Create a new repository or use an existing one
2. Make sure the repository is public (for raw.githubusercontent.com URLs to work)
3. Note down your username and repository name

## Step 3: Admin Panel Configuration

1. Go to your admin page (`/admin.html`)
2. Fill in the GitHub upload section:
   - **GitHub Username**: Your GitHub username
   - **Repository Name**: Your repository name
   - **GitHub Personal Access Token**: The token you created in Step 1

## Step 4: Upload Photos

1. Click "Select Photos" to choose image files
2. Click "Upload to GitHub" to start the upload process
3. Photos will be uploaded to a `property-photos/` folder in your repository
4. Raw URLs will be automatically added to the "Image URLs" field
5. Save the property to store the URLs in Firebase

## How It Works

- Photos are uploaded to GitHub using the GitHub API
- Files are stored in a `property-photos/` folder with timestamped names
- Raw URLs are generated using `raw.githubusercontent.com`
- These URLs work with Vercel, GitHub Pages, and other hosting platforms
- URLs are automatically added to the property form for Firebase storage

## Security Notes

- **Never commit your GitHub token to version control**
- The token has full repository access, so keep it secure
- Consider using environment variables in production
- You can revoke the token anytime from GitHub settings

## Troubleshooting

### "GitHub API error: 401 Unauthorized"
- Check your username, repository name, and token
- Ensure the token has the correct permissions
- Verify the repository exists and is accessible

### "GitHub API error: 403 Forbidden"
- Check if the repository is private and the token has access
- Ensure the token has `repo` scope for private repos

### Photos not displaying
- Verify the repository is public
- Check that the raw.githubusercontent.com URLs are accessible
- Ensure the file paths in the URLs are correct

## File Structure

After upload, your repository will have:
```
your-repo/
├── property-photos/
│   ├── 1703123456789-1.jpg
│   ├── 1703123456790-2.png
│   └── ...
├── index.html
├── app.js
└── ...
```

## Benefits

- **Free hosting**: GitHub provides free storage and bandwidth
- **CDN**: Raw.githubusercontent.com serves files globally
- **Version control**: Track changes to your media files
- **Integration**: Works seamlessly with Vercel and other platforms
- **Scalability**: No storage limits for reasonable usage
