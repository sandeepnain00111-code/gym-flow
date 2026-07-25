"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');
/**
 * @desc    Upload a single image to Cloudinary
 * @route   POST /api/upload
 * @access  Private (any authenticated user)
 *
 * Accepts:  multipart/form-data with field name "image"
 * Returns:  { success, url, publicId }
 *
 * Usage flow:
 *   1. Frontend uploads image here → receives back the Cloudinary URL
 *   2. Frontend includes that URL in the subsequent form submission (payment screenshot, profile pic, etc.)
 *   This way, actual API routes never deal with raw file buffers.
 */
router.post('/', protect, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file provided. Use field name "image".');
        }
        // Determine the Cloudinary folder based on optional query param or default
        const folder = `gymflow/${req.query.folder || 'general'}`;
        const { url, publicId } = await uploadToCloudinary(req.file.buffer, folder);
        res.status(201).json({
            success: true,
            message: 'Image uploaded successfully',
            url,
            publicId
        });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
