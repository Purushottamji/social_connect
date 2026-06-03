const multer = require("multer");
const path = require("path");

// टेम्परेरी स्टोरेज कॉन्फ़िगरेशन
const storage = multer.diskStorage({});

// फाइल टाइप चेक करने के लिए वैलिडेशन (सिर्फ इमेजेस और वीडियोस)
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Only Images and Videos are allowed!"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // मैक्सिमम 5MB की वीडियो या इमेज
});

module.exports = upload;
