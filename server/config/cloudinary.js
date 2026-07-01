const multer = require('multer');

let upload;
let cloudinaryConfigured = false;

if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
  try {
    const cloudinary = require('cloudinary').v2;
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'saree-tassels/products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit', quality: 'auto', fetch_format: 'auto' }],
      },
    });

    upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
    cloudinaryConfigured = true;
    console.log('Cloudinary successfully configured for file uploads.');
  } catch (err) {
    console.error('Error configuring Cloudinary, falling back to mock storage:', err.message);
  }
}

if (!cloudinaryConfigured) {
  console.log('Using in-memory mock storage fallback for uploads (picsum.photos image mock).');
  const memoryUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
  
  upload = {
    array: (fieldname, maxCount) => {
      const originalMiddleware = memoryUpload.array(fieldname, maxCount);
      return (req, res, next) => {
        originalMiddleware(req, res, (err) => {
          if (err) return next(err);
          if (req.files) {
            req.files.forEach((file, index) => {
              // Provide a nice fallback saree/product picture from Unsplash or Picsum
              const imageId = Math.floor(Math.random() * 50) + 100;
              file.path = `https://picsum.photos/800/800?image=${imageId}`;
            });
          }
          next();
        });
      };
    }
  };
}

module.exports = { upload };
