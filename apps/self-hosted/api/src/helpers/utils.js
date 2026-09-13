const fs = require("fs");

const createFolderIfNotExist = (folderPath) => {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
};

module.exports = {
    createFolderIfNotExist,
};
