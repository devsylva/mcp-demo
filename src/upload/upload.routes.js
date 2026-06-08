import { upload, handleUploadError } from './upload.middleware.js';

export function registerUploadRoutes(app) {
  app.post(
    '/api/upload',
    upload.single('file'),
    handleUploadError,
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file received.' });
      }
      return res.status(200).json({
        success: true,
        filename: req.file.filename,
        size: req.file.size,
      });
    }
  );
}
