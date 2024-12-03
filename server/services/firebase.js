const multer = require("multer");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

initializeApp(firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

// load into memory first
const loadIntoMemory = upload.array("image", 10);

const uploadToFirebase = async (req, res, next) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
        const dateTime = Date.now();
        const storageRef = ref(
        storage,
        `files/${file.originalname + "   " + dateTime}`
        );
        const metadata = {
        contentType: file.mimetype,
        };

        // upload to bucket
        const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
        );

        return await getDownloadURL(snapshot.ref)
    })

    // get url
    const urls = await Promise.all(uploadPromises);

    req.fileUpload = {
        urls: urls
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { loadIntoMemory, uploadToFirebase };