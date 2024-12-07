const multer = require('multer')
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
} = require('firebase/storage')
const { initializeApp } = require('firebase/app')
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
}

initializeApp(firebaseConfig)
const storage = getStorage()
const upload = multer({ storage: multer.memoryStorage() })

// load into memory first
const loadIntoMemory = upload.array('image', 10)

const uploadToFirebase = async (req, res, next) => {
  try {
    const uploadPromises = req.files.map(async (file) => {
      const dateTime = Date.now()
      const storageRef = ref(
        storage,
        `files/${file.originalname + '   ' + dateTime}`
      )
      const metadata = {
        contentType: file.mimetype
      }

      // upload to bucket
      const snapshot = await uploadBytesResumable(
        storageRef,
        file.buffer,
        metadata
      )

      return await getDownloadURL(snapshot.ref)
    })

    // get url
    const urls = await Promise.all(uploadPromises)

    req.fileUpload = {
      urls
    }

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { loadIntoMemory, uploadToFirebase }
