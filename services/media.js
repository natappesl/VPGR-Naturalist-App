// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
import DatabaseService from './database';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

const imagesPath = RNFS.DocumentDirectoryPath + '/images/';
const lmdFileName = 'LastModifiedDate';
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
      // name of image file with type suffix (.png or .jpg)
      let fileName = item.Key.slice(6, item.Key.length);
      let filePath = imagesPath + fileName;
      // name of image file WITHOUT type suffix
      let imageName = fileName.slice(0, fileName.indexOf('.'));
      // path to LastModifiedDate file
      let modifiedFilePathName = imagesPath + imageName + lmdFileName;

      // ignore files/ directory
      if (fileName == '') {
        continue;
      }

      try {
        let params = {
          Bucket: "natappdata",
          Key: item.Key
        }

        // Check for a last modified date
        if (RNFS.exists(modifiedFilePathName)) {
          let savedModifiedDate = await DatabaseService.readLastModifiedDate(modifiedFilePathName);
          if (savedModifiedDate) {
            // Add parameter condition to only
            // download if there is a newer version
            params.IfModifiedSince = savedModifiedDate;
          }
        }

        await S3.getObject(params).promise()
        .then (response => {
          if (response.ContentType == 'image/png' || response.ContentType == 'image/jpeg') {
            let modifiedFilePathName = imagesPath + imageName + lmdFileName;
            let write = RNFS.writeFile(filePath, response.Body.toString('base64'), 'base64');
            DatabaseService.writeLastModifiedDate(modifiedFilePathName, response.LastModified.toJSON() )
          }
        })
        .catch( error => {
          if (!(error.code = 'NotModified')) {
            console.debug ('Image get error: ', error);
          }
        });
      } catch (error) {
        console.debug(error);
      }
    }
  }

 getImageURI (imageString) {
    try {
      let uri;
      if (Platform.OS == 'android' || Platform.OS == 'ios'){
        uri = 'file://' + imagesPath + imageString;
      }
      return uri;
    } catch (error) {
      console.debug(error);
    }
  }
}

const instance = new MediaService ();
Object.freeze(instance);

export default instance;