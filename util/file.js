const fs = require("fs");
const path = require("path");

const imageFolder = path.join(__dirname, "../");

const deleteFile = (filePath) => {
    fs.unlink(imageFolder + filePath, (err) => { //unlink deletes a file
        if (err) {
            throw (err);
        }
    });
}

exports.deleteFile = deleteFile;