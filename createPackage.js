const fs = require('fs');
const path = require('path');

// Base directory path
const baseDir = __dirname;

// Destination folder name
const destinationFolder = 'com.adobe.randomtheme';

// Create the destination folder
const destinationPath = path.join(baseDir, destinationFolder);
if (!fs.existsSync(destinationPath)) {
  fs.mkdirSync(destinationPath);
}

// Files to copy from client/assets
const filesToCopy = ['CSInterface.js', 'index.js', 'main.css'];

// Copy files from client/assets
const sourceFolderPath = path.join(baseDir, 'client/assets');
const targetFolderPath = path.join(destinationPath, 'client/assets');
if (!fs.existsSync(targetFolderPath)) {
  fs.mkdirSync(targetFolderPath, { recursive: true });
}

filesToCopy.forEach((file) => {
  const sourcePath = path.join(sourceFolderPath, file);
  const targetPath = path.join(targetFolderPath, file);
  fs.copyFileSync(sourcePath, targetPath);
});

// Folders and files to copy
const foldersToCopy = ['CSXS', 'jsx'];
const additionalFilesToCopy = ['index.html', '.debug', 'README.md'];

// Copy folders
foldersToCopy.forEach((folder) => {
  const sourcePath = path.join(baseDir, folder);
  const targetPath = path.join(destinationPath, folder);
  copyFolderRecursiveSync(sourcePath, targetPath);
});

// Copy additional files
additionalFilesToCopy.forEach((file) => {
  const sourcePath = path.join(baseDir, file);
  const targetPath = path.join(destinationPath, file);
  fs.copyFileSync(sourcePath, targetPath);
});

console.log('Folders and files copied successfully.');

// Recursive function to copy folders and sub-folders
function copyFolderRecursiveSync(source, target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target);
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const curSource = path.join(source, file);
      const curTarget = path.join(target, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, curTarget);
      } else {
        fs.copyFileSync(curSource, curTarget);
      }
    });
  }
}
