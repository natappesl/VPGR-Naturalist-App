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

let s3;
let db;

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
            DatabaseService.instance.initAWS();
        }
        return DatabaseService.instance;
    }
    
    async initAWS () {
        Auth.currentCredentials()
        .then(credentials => {
            // Update aws credentials through Cognito to verify IAM Role 
            AWS.config.update(Auth.essentialCredentials(credentials));
            s3 = new AWS.S3();
            s3.getObject({Bucket:'natappdata', Key: 'natappDatabase.db', ResponseContentType: 'application/x-sqlite3'}).promise()
            .then ((data) => {
                RNFS.writeFile('/data/data/com.vpgrnaturalistapp/databases/vv.db', data.Body.toString('base64'), 'base64')
                .then(() => {
                    DatabaseService.instance.initDatabase();
                });
            });
        });
    }

    async getObjectList () {
        let response = await s3.listObjects({Bucket: 'natappdata', Prefix: 'json/'}).promise();
        let objectList = response.Contents;
        return objectList;
    }

    async populateDatabase () {
        let objectList = await this.getObjectList();
        for (let i = 0; i < objectList.length; i++) {
            await s3.getObject({Bucket: 'natappadata', Key: objectList[i]}).promise();
        }
    }

    async initDatabase () {
        db = await SQLite.openDatabase({name: "vv.db"});

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM species', [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  
                  console.log(`Record: ${row.sciname}`);
                }
            });
        });

        DatabaseService.instance.populateDatabase();
    }

    async populateDatabase () {
        let response = await s3.listObjects({Bucket: 'natappdata', Prefix: 'json/'}).promise();
        let objectList = response.Contents;
        for (let i = 0; i < objectList.length; i++) {
            await s3.getObject({Bucket: 'natappadata', Key: objectList[i]}).promise();
        }
    }

    search (query: string, type= SEARCH_TYPE.BY_TAG) {
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
    }
}

const instance = new DatabaseService();
Object.freeze(instance);

export default instance;