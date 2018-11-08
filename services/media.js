// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
import DatabaseService from './database';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

const imagesPath = RNFS.DocumentDirectoryPath + '/images/';

//TODO: Does 'file://' work for ios uri ?

class MediaService {
  constructor () {
    if (!MediaService.instance) {
      MediaService.instance = this;
      MediaService.instance.downloadImages();
    }

    return MediaService.instance;
  }

  async downloadImages() {
    let dir = await RNFS.mkdir(imagesPath);
    let S3 = await DatabaseService.getS3();
    let listResponse = await S3
      .listObjects({ Bucket: "natappdata", Prefix: "files/" })
      .promise();
    let objectList = listResponse.Contents;

    for (const item of objectList) {
      let fileName = item.Key.slice(6, item.Key.length);
      let filePath = imagesPath + fileName;
      let fileExists = await RNFS.exists(filePath);

      if (fileExists) {
        continue;
      }

      try {
        let response = await S3.getObject({ Bucket: "natappdata", Key: item.Key }).promise();
        if (response.ContentType == 'image/png' || response.ContentType == 'image/jpeg' ){
          console.log(fileName);
          let write = RNFS.writeFile(filePath, response.Body.toString('base64'), 'base64');
        }
      } catch (error) {
        console.warn(error);
      }
    }


    console.log('DONE DOWNLOADING IMAGES');
  }

 getImageURI (imageString) {
    try {
      let uri;
      if (Platform.OS == 'android' || Platform.OS == 'ios'){
        uri = 'file://' + imagesPath;
      }
      return uri;
    } catch (error) {
      console.warn(error);
    }
  }
}

const instance = new MediaService ();
Object.freeze(instance);

export default instance;