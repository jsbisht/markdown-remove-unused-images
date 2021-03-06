// https://stackoverflow.com/questions/41462606/get-all-files-recursively-in-directories-nodejs
import "regenerator-runtime/runtime";
import * as fs from "fs";
import * as path from "path";

export function* walkSync(rootDirectory) {
  if (!rootDirectory) return null;
  const files = fs.readdirSync(rootDirectory, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(rootDirectory, file.name));
    } else {
      yield path.join(rootDirectory, file.name);
    }
  }
}

export function getFilesInDirectory(rootDirectory, imageExtensions = ["webp"]) {
  const imagesPathList = [];
  const markdownFiles = [];

  for (const filePath of walkSync(rootDirectory)) {
    const extension = filePath.substring(filePath.lastIndexOf(".") + 1);
    if (extension === "md") markdownFiles.push(filePath);
    else if (imageExtensions.includes(extension)) imagesPathList.push(filePath);
  }

  return {
    imagesPathList,
    markdownFiles
  };
}

/**
 * Only images with relative paths are considered
 */
export function getImageListFromContent(content) {
  const matchPattern = /\.\/[\w-.]+[?)]/g;
  const imageList = [...content.matchAll(matchPattern)].flat();
  return imageList.map((image) => image.substring(2, image.length - 1));
}

export function getUsedImagesInMarkdownFile(markdownFile) {
  try {
    const data = fs.readFileSync(markdownFile, "utf8");
    const list = getImageListFromContent(data);
    return list;
  } catch (err) {
    console.error(err);
  }
}

export function getUsedImagesList(markdownFiles) {
  let usedImagesList = [];
  for (const markdownFile in markdownFiles) {
    const list = getUsedImagesInMarkdownFile(markdownFile);
    usedImagesList = usedImagesList.concat(list);
  }
  return usedImagesList;
}

export function deleteFiles(files, callback) {
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

export function deleteUnusedImages(unusedImagesPaths) {
  deleteFiles(files, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("all files removed");
    }
  });
}

export function run(rootDirectory) {
  const { imagesPaths, markdownFiles } = getFilesInDirectory(rootDirectory);
  const { usedImagesPaths } = getUsedImagesList(markdownFiles);
  const unusedImagesPaths = usedImagesPaths
    .map((usedImagesPath) => `${rootDirectory}${path.sep}${usedImagesPath}`)
    .filter((imagePath) => !imagesPaths.includes(imagePath));
  // deleteUnusedImages(unusedImagesPaths);
  console.log(unusedImagesPaths);
}

// run(
//   "/home/jsbisht/workspace/github/aws-associate/Cloud Academy - AWS Associate"
// );
