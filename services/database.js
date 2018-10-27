// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
// Enumeration Reference: https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/

import {AsyncStorage } from 'react-native';
import SQLite from "react-native-sqlite-storage";
import { Search } from "../components/screens/catalog-screen";
import Amplify, { Storage, Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';

Amplify.configure(aws_exports);
SQLite.DEBUG(true);
SQLite.enablePromise(false);

const SEARCH_TYPE = {
    BY_NAME: 'name',
    BY_SCI_NAME: 'scientificName',
    BY_TAG: 'tag',
    BY_TYPE: 'type'

}
Object.freeze(SEARCH_TYPE);

const CONSERVATION_STATUS = {
    LC: 'LC',
    NT: 'NT',
    VU: 'VU',
    EN: 'EN',
    CR: 'CR',
    EW: 'EW',
    EX:'EX'
    
}
Object.freeze(CONSERVATION_STATUS);

class DatabaseService {
    constructor () {
        if (!DatabaseService.instance) {
            DatabaseService.instance = this;
        }

        return DatabaseService.instance;
    }
    
    search (query: string, type= SEARCH_TYPE.BY_TAG) {


        // if (typeof query != "string"){

        // }
        // db.transaction((tx) => {
        //     let queryString = 'SELECT * FROM species WHERE ' + type + ' LIKE ' + '%' + query + '%';

        //     tx.executeSql(queryString, [], (tx, results) => {
        //         console.log("Query completed ", tx);

        //         var len = results.rows.length;

        //         for (let i = 0; i < len; i++) {
        //           let row = results.rows.item(i);
        //           console.log(`Record: ${row.name}`);
        //           this.setState({record: row});
        //         }
        //     });
        // });

        Auth.currentCredentials()
        .then(credentials => {
            // Update aws credentials through Cognito to verify IAM Role 
            AWS.config.update(Auth.essentialCredentials(credentials));
            const s3 = new AWS.S3();
            // List all json files in bucket
            s3.listObjects({Bucket: 'natappdata', Prefix: 'json/'}, (err, data) => {
                if (err) console.log(err);
                else{
                    // Loop through all json files
                    for (let i in data.Contents) {
                        // Get the object
                        s3.getObject({Bucket: 'natappdata', Key: data.Contents[i].Key}, (err, jsonData) => {
                            if (err) console.log(err);
                            else{
                                if (jsonData.ContentType = 'application/json') {
                                    let jsonDataString = jsonData.Body.toString('utf-8');
                                    try {
                                        let species = JSON.parse(jsonDataString);
                                        AsyncStorage.setItem(species.name, JSON.stringify(species)).then(() =>{
                                            AsyncStorage.getItem(species.name).then((val) => {
                                                let savedSpecies = JSON.parse(val);
                                                console.log(savedSpecies);
                                            });
                                        });
                                    }
                                    catch (err) {
                                        console.log(err, jsonDataString);
                                    }
                                }
                            }
                        });
                    }
                }
            });

            // s3.getObject({Bucket: 'natappdata', Key: 'natappdata.db',  ResponseContentType: 'application/x-sqlite3'}, (err,data) =>{
            //     if (err) console.log('Failed to getObject: ', err); // an error occurred
            //     else{
            //         console.log(data.Body.toString('utf-8'));
            //         AsyncStorage.setItem('speciesDatabase', data);
            //     }
            // });
        });
    }
}

const instance = new DatabaseService();
Object.freeze(instance);

export default instance;