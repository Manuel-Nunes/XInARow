const fs = require('fs');
const path = require('path');

const devFolder = path.join(__dirname,'liveServerRapidDev');

const subFiles = ['public'];

/**
 * @enum {string}
 */
const deployFilesEnum = {
  Scripts: path.join(__dirname, ...subFiles ,'Scripts'),
  Configs: path.join(__dirname,...subFiles,'Configs'),
  Styles: path.join(__dirname,...subFiles,'Styles'),
  Views: path.join(__dirname,...subFiles,'Views'),
  Images: path.join(__dirname,...subFiles,'Images')
};

/**
 *
 * @param {string} folderName
 * @param {string[]} Files
 */
function deployFiles(src, dist, Files) {
  if (!fs.existsSync(src)) {
    console.log(`Could not deploy files as we are missing src: ${src}`);
    return;
  }

  if (!fs.existsSync(dist)) {
    console.log(`Could not deploy files as we are missing dist: ${dist}`);
    return;
  }

  Files.forEach(file => {
    fs.copyFile(path.join(src, file), path.join(dist, file), (err) => {
      if (err)
        console.log(err);
    });
  });
}

/**
 * Create folders based on deployFilesEnum
 */
function createFolders() {
  subFiles.forEach(folder => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath))
      fs.mkdirSync(folderPath);
  });

  Object.keys(deployFilesEnum).forEach(key => {
    if (!fs.existsSync(deployFilesEnum[key])) {
      fs.mkdirSync(deployFilesEnum[key]);
    }
  });
}

/**
 * discovers and sorts files from liveServerRapidDev
 * @param {Error} error
 * @param {string[]} files
 */
function dirReadCallBack(error, files){
  if (error){
    console.log(error);
    return;
  }

  const styles = files.filter(
    ( file)=>{
      return file.includes('.css');
    }
  );

  const configs = files.filter(
    ( file)=>{
      return file.includes('.json');
    }
  );

  files = files.filter(
    ( file)=>{
      return !file.includes('.json');
    }
  );

  const scripts = files.filter(
    ( file)=>{
      return file.includes('.js');
    }
  );

  const views = files.filter(
    ( file)=>{
      return file.includes('.html');
    }
  );

  const resources = files.filter(
    ( file)=>{
      return file.includes('.svg');
    }
  );

  console.log('Creating Folders');

  createFolders();

  console.log('Copying File');

  deployFiles(devFolder,deployFilesEnum.Styles,styles);
  deployFiles(devFolder,deployFilesEnum.Scripts,scripts);
  deployFiles(devFolder,deployFilesEnum.Views,views);
  deployFiles(devFolder,deployFilesEnum.Images,resources);
  deployFiles(devFolder,deployFilesEnum.Configs,configs);
}

console.log('Deploying resource Server files from liveServerRapidDev to static folders');


if (!fs.existsSync(devFolder)) {
  console.log('Rapid Dev Folder is missing.... will now create folder');
  fs.mkdirSync(devFolder);
}
fs.readdir(devFolder, dirReadCallBack);
