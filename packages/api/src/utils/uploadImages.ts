/* eslint-disable prettier/prettier */
import multer from "multer";
import fs from "fs";
import moment from "moment";
const storage = multer.diskStorage({
    destination: function (_, __, cb) {
        if (!fs.existsSync("public/uploads/")) {
            fs.mkdirSync("public/uploads/");
        }
        cb(null, "public/uploads/");
    },
    filename: async function (_, file, cb) {
        try {
            const imageName = `${moment().format("YYYY-MM-DD-HH-mm-ss-SSS")}-${file.originalname}`;
            cb(null, imageName);
        } catch (error) {
            throw new Error(error);
        }
    },
});
export const multiUpload = multer({
    storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 10 MB limit
    },
});
