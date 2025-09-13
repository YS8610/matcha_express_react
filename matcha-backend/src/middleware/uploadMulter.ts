import multer from 'multer';

const upload = multer({ dest: 'photoDump/' });

export default upload;
