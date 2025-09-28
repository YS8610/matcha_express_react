import multer from 'multer';
import BadRequestError from '../errors/BadRequestError.js';
import ConstMatcha from '../ConstMatcha.js';
import fs from 'fs';

const upload = multer({ 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new BadRequestError({
        message: "Only image files are allowed",
        code: 400,
        logging: false,
        context: { fileType: file.mimetype },
      }));
    }
  },
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      // ensure the directory exists
      try {
        await fs.promises.access(ConstMatcha.PHOTO_DUMP_DIR);
      } catch (error) {
        await fs.promises.mkdir(ConstMatcha.PHOTO_DUMP_DIR, { recursive: true });
      }
      cb(null, ConstMatcha.PHOTO_DUMP_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
    }
  })
});

export default upload;

// curl -F "file=@./photoDump/s1.jpg" \
// -H "Authorization: Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjI0NzY3MTIyLWNkODEtNDNjMi1hYjU3LTkwOGExOWUzNmNiNSIsImVtYWlsIjoiY2hhbmdlZEB5YWhvby5jb20iLCJ1c2VybmFtZSI6ImVjaG8gYXBpIiwiYWN0aXZhdGVkIjp0cnVlLCJpYXQiOjE3NTg5NzI3NDcsImV4cCI6MTc2MDcwMDc0N30.wzkZGuN1vXhD9jH28rfs6QA-xKPCm5I7NsEtSGv7LjlRuI6xzDWqD3xG9zvJIobpcVaHbZQywKLpTlP2WMqVrg" \
// -X POST http://localhost:8080/api/user/photo; echo