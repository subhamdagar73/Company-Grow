// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from '../config/cloudinary.js';

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'companygrow',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
//     resource_type: 'auto'
//   }
// });

// const upload = multer({ 
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024
//   }
// });

// export default upload;



// middleware/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'companygrow',           // your branded uploads folder
    allowed_formats: [               // what Cloudinary will accept
      'jpg', 'jpeg', 'png', 'pdf',
      'doc', 'docx'
    ],
    resource_type: 'auto',           // detect images/docs automatically
  },
});

// Only allow images or PDFs/DOCs, and reject everything else  
const fileFilter = (req, file, cb) => {
  const { mimetype } = file;
  if (
    mimetype.startsWith('image/') ||
    mimetype === 'application/pdf' ||
    mimetype === 'application/msword' ||
    mimetype ===
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,      // 10 MB max
  },
});

export default upload;
