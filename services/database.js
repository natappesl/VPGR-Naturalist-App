// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
// Enumeration Reference: https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/

import SQLite from "react-native-sqlite-storage";
import { Search } from "../components/screens/catalog-screen";
import Amplify, { Storage, Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import AWS from 'aws-sdk';

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

        this._db = SQLite.openDatabase({ name: "TPCH.db", location: "default" }, () => {}, this.errorCallback);


        return DatabaseService.instance;
    }

    errorCallback (error) {
        console.log ("Open DB Error:", error);
    }
    
    async search (query: string, type= SEARCH_TYPE.BY_TAG) {
        console.log("HELLO FROM DATABASE :heart:")
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
            AWS.config.update(Auth.essentialCredentials(credentials));
            const s3 = new AWS.S3();

            s3.listObjects({Bucket: 'natappdata'}, (err, data) => {
            });
        });
    }
}

const instance = new DatabaseService();
Object.freeze(instance);

export default instance;