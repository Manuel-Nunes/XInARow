const fs = require('fs');
const path = require('path');

const devFolder = path.join(__dirname,'liveServerRapidDev');

const subFiles =['public'];

const deployFilesEnum= {
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
function deployFiles(src,dist,Files){
  Files.forEach(file => {
    fs.copyFile(path.join(src,file),path.join(dist,file),(err) =>{
      if (err)
        console.log(err);
    });
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

  const configs = files.filter(
    ( file)=>{
      return file.includes('.svg');
    }
  );

  deployFiles(devFolder,deployFilesEnum.Styles,styles);
  deployFiles(devFolder,deployFilesEnum.Scripts,scripts);
  deployFiles(devFolder,deployFilesEnum.Views,views);
  deployFiles(devFolder,deployFilesEnum.Images,resources);
  deployFiles(devFolder,deployFilesEnum.configs,configs);
}

console.log('Deploying identity Server files from liveServerRapidDev to static folders');

fs.readdir(devFolder, dirReadCallBack);