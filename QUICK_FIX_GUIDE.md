# 🚨 QUICK FIX: Cloudinary Upload Preset Issue

## The Problem
Your uploads are failing because the default upload preset `ml_default` doesn't exist in your Cloudinary account.

## ✅ Immediate Solution

### Step 1: Test Your Connection
1. Go to your admin page
2. Click **"Test Cloudinary Connection"** button
3. This will test different preset names and tell you which ones work

### Step 2: Create a Custom Upload Preset (Recommended)
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Click **Settings** → **Upload**
3. Scroll down to **"Upload presets"**
4. Click **"Add upload preset"**
5. Fill in:
   - **Preset name**: `rentease_properties` (or any name you like)
   - **Signing Mode**: `Unsigned` (important!)
   - **Folder**: `properties` (optional)
6. Click **Save**

### Step 3: Update Your Code
In `admin.js`, change line 118:
```javascript
uploadPreset: 'rentease_properties' // Replace with your preset name
```

## 🔍 What the Test Button Does
The "Test Cloudinary Connection" button will:
- Test multiple preset names automatically
- Tell you which ones exist and which don't
- Update your working preset if it finds one
- Give you detailed feedback about what's wrong

## 🎯 Why This Happens
- Cloudinary requires custom upload presets for security
- The default `ml_default` preset doesn't exist in new accounts
- Each account needs to create their own presets

## 🚀 After Fix
Once you have a working preset:
- Uploads will work immediately
- You can upload multiple images
- Images will be stored in Firebase
- Property cards will display the images

## 📞 Need Help?
If the test button shows all presets as failed:
1. Check your Cloudinary cloud name is correct
2. Make sure you're logged into the right Cloudinary account
3. Create a new upload preset following Step 2 above
