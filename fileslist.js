// https://stackoverflow.com/questions/41462606/get-all-files-recursively-in-directories-nodejs

const fs = require("fs");
const path = require("path");

function* walkSync(rootDirectory) {
  const files = fs.readdirSync(rootDirectory, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(rootDirectory, file.name));
    } else {
      yield path.join(rootDirectory, file.name);
    }
  }
}

function buildFilesList(rootDirectory, imageExtensions = ["webp"]) {
  const imagesPathList = [];
  const markdownFiles = [];

  for (const filePath of walkSync(
    "/home/jsbisht/workspace/github/aws-associate/Cloud Academy - AWS Associate"
  )) {
    const extension = filePath.substring(filePath.lastIndexOf(".") + 1);
    if (extension === "md") markdownFiles.push(filePath);
    else if (imageExtensions.includes(extension)) imagesPathList.push(filePath);
  }

  return {
    imagesPathList,
    markdownFiles,
  };
}

function buildUsedImagesList(markdownFiles) {}

function deleteFiles(files, callback) {
  var i = files.length;
  files.forEach(function (filepath) {
    fs.unlink(filepath, function (err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

function deleteUnusedImages(unusedImagesPaths) {
  deleteFiles(files, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("all files removed");
    }
  });
}

function run(rootDirectory) {
  const { imagesPaths, markdownFiles } = buildFilesList(rootDirectory);
  const { usedImagesPaths } = buildUsedImagesList(markdownFiles);
  const unusedImagesPaths = imagesPaths.filter(
    (imagePath) => !usedImagesPaths.includes(imagePath)
  );
  deleteUnusedImages(unusedImagesPaths);
}
