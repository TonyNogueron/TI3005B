import multer from "multer";

// // Attempt 1 with disk storage
// import path from "path";
// import fs from "fs";

// // Create the 'uploads' directory if it doesn't exist
// const dir = "uploads";
// if (!fs.existsSync(dir)) {
//   fs.mkdirSync(dir);
// }

// // Specify the disk storage configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save files to the 'uploads' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Use timestamp to avoid overwriting files
//   },
// });

// const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const allowedTypes = ["application/pdf"];
//   if (allowedTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only PDF is allowed."));
//   }
// };

// Attempt 2 with memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export { upload };
