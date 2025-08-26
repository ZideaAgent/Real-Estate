# Assets Folder Structure

This folder contains all media assets for the RentEase real estate website.

## Structure

```
assets/
├── images/          # Property images
├── videos/          # Property videos
└── README.md        # This file
```

## Usage Guidelines

### Images
- Supported formats: JPG, PNG, WebP
- Recommended size: 800x600px or larger
- Naming convention: `property-[id]-[number].[ext]`
- Example: `property-001-1.jpg`, `property-001-2.png`

### Videos
- Supported formats: MP4, WebM, OGG
- Recommended resolution: 720p or higher
- Naming convention: `property-[id]-video.[ext]`
- Example: `property-001-video.mp4`

## Path References

When adding properties through the admin panel, use these path formats:

### Images
```
assets/images/property-001-1.jpg
assets/images/property-001-2.png
```

### Videos
```
assets/videos/property-001-video.mp4
```

## GitHub Repository

All assets are stored in the GitHub repository at:
https://github.com/ZideaAgent/Real-Estate

## Live Deployment

Assets are served from the live website at:
https://real-estate-bice-iota.vercel.app

## Notes

- Keep file sizes reasonable for web performance
- Use descriptive names for easy management
- Update this README when adding new asset types
