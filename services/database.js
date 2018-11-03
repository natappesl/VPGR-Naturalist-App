// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
// Enumeration Reference: https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/

//TODO: Update databse from S3 using ifModifiedSince param in getObject


import SQLite from "react-native-sqlite-storage";
import { Search } from "../components/screens/catalog-screen";
import Amplify, { Storage, Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';

Amplify.configure(aws_exports);
SQLite.DEBUG(true);
SQLite.enablePromise(true);

const dbFolderPath = '/data/data/com.vpgrnaturalistapp/databases/';
const dbFileName = 'sp.db';

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
        .then( async credentials => {
            // Update aws credentials through Cognito to verify IAM Role 
            AWS.config.update(Auth.essentialCredentials(credentials));
            s3 = new AWS.S3();
            // let dbExists = await RNFS.exists(dbFolderPath + dbFileName);
            // if (dbExists) {
            //     console.log ("DB already exists." + dbFolderPath + dbFileName);
            //     RNFS.readDir(dbFolderPath)
            //     .then((val) => {
            //         console.log(val);
            //     });
            //     DatabaseService.instance.initDatabase();
            // }
            // else {
                console.log ("Downloading DB.");
                s3.getObject({Bucket:'natappdata', Key: 'natappDatabase.db', ResponseContentType: 'application/x-sqlite3'}).promise()
                .then ((data) => {
                    RNFS.writeFile(dbFolderPath + dbFileName, data.Body.toString('base64'), 'base64')
                    .then(() => {
                        DatabaseService.instance.initDatabase();
                    });
                });
            // }
        });
    }

    async initDatabase () {
        db = await SQLite.openDatabase({name: dbFileName});

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM species', [], (tx, results) => {
                var len = results.rows.length;
                for (let i = 0; i < len; i++) {
                  let row = results.rows.item(i);
                  
                  console.log(`Record: ${row.sciname}`);
                }
            });
        });

        await DatabaseService.instance.populateDatabase();

    }

    async dropSpeciesTable () {
        await db.transaction ((tx) => {
            tx.exequteSql('DROP TABLE IF EXISTS species');
            tx.executeSql(`CREATE TABLE species (id INTEGER PRIMARY KEY AUTOINCREMENT, sciname STRING, overview STRING, behavior STRING, habitat STRING, size STRING, conservationstatus STRING, stype STRING); `);
        });
    }

    async populateDatabase() {
        let speciesId = -1;
        let listResponse = await s3.listObjects({Bucket: 'natappdata', Prefix: 'json/'}).promise();
        let objectList = listResponse.Contents;

        for (const item of objectList) {
            let speciesResponse = await s3.getObject({Bucket: 'natappdata', Key: item.Key}).promise();
            try {
                let speciesString = speciesResponse.Body.toString();
                let speciesData = JSON.parse(speciesString);
                let id = await DatabaseService.instance.insertSpecies(speciesData);
                if (id != -1) {
                    // DatabaseService.instance.insertAliases(speciesData);
                    // DatabaseService.instance.insertLinks(speciesData);
                    // DatabaseService.instance.insertTraits(speciesData);
                }
            }
            catch (err) {
                console.warn("Species parse error:", err, speciesResponse);
            }
        }
    }

    async insertSpecies (speciesData) {
        let speciesId = -1;
        if (!speciesData.scientificName) return speciesId;

        await db.transaction(async (tx) => {

            let [t, existsResult] = await tx.executeSql('SELECT * FROM species WHERE sciname = "' + speciesData.scientificName + '"');

            let alreadyExists = existsResult.rows.length > 0 ? true : false;
            if (alreadyExists) {
                console.warn (speciesData.scientificName + " already exists, bro.");
                return speciesId;
            }
        });

        await db.transaction( async (tx) => {
            let [t, insertResult] = await tx.executeSql(
                `INSERT INTO species (
                    sciname,
                    overview,
                    behavior,
                    habitat,
                    size,
                    conservationstatus,
                    stype
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`,
                [
                    speciesData.scientificName,
                    speciesData.overview,
                    speciesData.behavior,
                    speciesData.habitat,
                    speciesData.size,
                    speciesData.conservationStatus,
                    speciesData.type
                ]
            );
            return speciesId = insertResult.insertId;
        }).catch ( (error) => {
            alert(speciesData.scientificName + " insert failed!");
            console.error(error);
        });
        return speciesId;
    }


    async _addToDatabase (speciesData) {
        db.transaction((tx) => {
            if (!speciesData.scientificName) return;

            tx.executeSql('SELECT * FROM species WHERE sciname = "' + speciesData.scientificName + '"', [],
            (tx, resultSet) => {
                let alreadyExists = resultSet.rows.length > 0 ? true : false;
                if (alreadyExists) {
                    console.log (speciesData.scientificName + " already exists, bro.");
                    return;
                }
                tx.executeSql(
                    `INSERT INTO species (
                        sciname,
                        overview,
                        behavior,
                        habitat,
                        size,
                        conservationstatus,
                        stype
                    ) VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    )`,
                    [
                        speciesData.scientificName,
                        speciesData.overview,
                        speciesData.behavior,
                        speciesData.habitat,
                        speciesData.size,
                        speciesData.conservationStatus,
                        speciesData.type
                    ],
                    (tx, resultSet) => {
                        // console.log ("INSERT COMPLETE", resultSet)
                });
            },
            (err) => {
                console.warn(err.message);
            });
        });

        db.transaction((tx) => {
            tx.executeSql('SELECT * FROM species', [],
            (tx, resultSet) => {
                console.log("SPECIES", resultSet);
            },
            (err) => {
                // console.warn(err.message);
            });
        });
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