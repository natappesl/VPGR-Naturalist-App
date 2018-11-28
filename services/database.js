// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
// Enumeration Reference: https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/

import SQLite from 'react-native-sqlite-storage';
import Amplify, { Storage, Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import {
  ColorTraits,
  SizeTraits,
  SpeciesTypes,
} from '../constants/trait-categories';
import {
  RequiredSpeciesFields,
} from '../constants/species-fields';
import {Platform, Alert} from 'react-native';


Amplify.configure(aws_exports);
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const dbFolderPath = 
  (Platform.OS == 'ios') ?
  RNFS.LibraryDirectoryPath + '/LocalDatabase/' :
  '/data/data/com.vpgrnaturalistapp/databases/';

const dbFileName = 'speciesDatabase.db';
const lmdFileName = 'lastModifiedDate';
const bucketName = 'natappdata';
const dbFileType = 'application/x-sqlite3';
let _S3;
let _db;

class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = this;
      DatabaseService.instance.syncDatabase();
    }
    return DatabaseService.instance;
  }

  async getS3() {
    await Auth.currentUserCredentials().then(async credentials => {
      // Update aws credentials through Cognito to verify IAM Role
      AWS.config.update(Auth.essentialCredentials(credentials));
      _S3 = new AWS.S3();
    })
    .catch(async error => {
      throw error;
    });

    return _S3;
  }

  async getDB() {
    if (_db) {
      return _db;
    }

    _db = await SQLite.openDatabase({ name: dbFileName });

    return _db;

  }

  async checkAuth () {
    let isAuth = true;
    await Auth.currentAuthenticatedUser()
    .catch (error => {
      Alert.alert("You are not authenticated!");
      console.error(error);
      isAuth = false;
    });

    return isAuth;
  }

  async writeDatabase (dbFileData) {
    await RNFS.writeFile(
      dbFolderPath + dbFileName,
      dbFileData,
      'base64'
    ).catch(error => {
      alert('Database writing FAILED!');
      console.error(error);
    });
  }

  async getDatabaseFile(additionalParams = {}) {
    let S3 = await DatabaseService.instance.getS3();

    let params = {
    Bucket: bucketName,
    Key: dbFileName,
    ResponseContentType: dbFileType,
    ...additionalParams
    }

    let newDBDownloaded = true;
    let data = await S3.getObject(params).promise()
    .catch (err => {
      if (!(err.statusCode == 304)) {
        console.error(error);
      }
      newDBDownloaded = false;
    });

    if (!newDBDownloaded) return;

    // Save the new database and lastModifiedDate
    let lmdFilePathName = dbFolderPath + lmdFileName;
    await DatabaseService.instance.writeDatabase(data.Body.toString('base64'));
    await DatabaseService.instance.writeLastModifiedDate( lmdFilePathName, data.LastModified.toJSON());
    Alert.alert("Local Database Updated!");
  }

  async uploadDatabase() {
    let dbFilePathName = dbFolderPath + dbFileName;
    let uploadDBFile = await RNFS.readFile( dbFilePathName, "base64");
    let buf = Buffer.from(uploadDBFile, "base64");

    let S3 = await DatabaseService.instance.getS3();
    S3.upload({
      Bucket: bucketName,
      Key: dbFileName,
      Body: buf,
      ContentType: dbFileType,
    }).promise()
    .then(() => {
      Alert.alert("Local Database Uploaded!");
    })
    .catch(error => {
      alert("Database upload FAILED!");
      console.error(error);
    });
  }

  async syncDatabase() {
    console.debug('Syncing database file ' + dbFileName + ' ...');
    let dbFilePathName = dbFolderPath + dbFileName;
    let dbExists = await RNFS.exists(dbFilePathName);
    if (!dbExists) {
      await DatabaseService.instance.getDatabaseFile();
    } else {
      let savedModifiedDate = await DatabaseService.instance.readLastModifiedDate(dbFolderPath + lmdFileName);
      let additionalParams;
      if (savedModifiedDate) {
        additionalParams = {
          IfModifiedSince: savedModifiedDate
        }
      }
      await DatabaseService.instance.getDatabaseFile(additionalParams);
    }
  }

  async writeLastModifiedDate (filePathName, lastModifiedDate) {
    await RNFS.writeFile(
      filePathName,
      lastModifiedDate,
      'utf8'
    )
    .then (() => {
    })
    .catch(error => {
      console.error(error);
    });
  }

  async readLastModifiedDate(filePathName) {
    let savedModifiedDate;
    if (RNFS.exists(filePathName)) {
      let savedModifiedDateJSON = await RNFS.readFile(filePathName, 'utf8')
      .catch (error => {});
      if (savedModifiedDateJSON) {
        savedModifiedDate = new Date (savedModifiedDateJSON);
      }
    }
    return savedModifiedDate;
  }

  async _dropSpeciesTable() {
    let db = await DatabaseService.instance.getDB();
    await db.transaction(tx => {
      tx.exequteSql("DROP TABLE IF EXISTS species");
      tx.executeSql(
        `CREATE TABLE species (id INTEGER PRIMARY KEY AUTOINCREMENT, sciname STRING, overview STRING, behavior STRING, habitat STRING, size STRING, conservationstatus STRING, stype STRING); `
      );
    });
  }

  async _populateDatabase() {
    let S3 = await DatabaseService.instance.getS3();

    let listResponse = await S3
      .listObjects({ Bucket: "natappdata", Prefix: "json/" })
      .promise();
    let objectList = listResponse.Contents;

    for (const item of objectList) {
      let speciesResponse = await S3
        .getObject({ Bucket: "natappdata", Key: item.Key })
        .promise();
      try {
        let speciesString = speciesResponse.Body.toString();
        let speciesData = JSON.parse(speciesString);
        let speciesId = await DatabaseService.instance.insertSpecies(speciesData);

        if (speciesId != -1) {
          DatabaseService.instance.insertAliases(speciesData, speciesId);
          DatabaseService.instance.insertImageLinks(speciesData, speciesId);
          DatabaseService.instance.insertReferenceLinks(speciesData, speciesId);
          DatabaseService.instance.insertTraits(speciesData, speciesId);
        }
      } catch (err) {
        console.warn("Species parse error:", err, speciesResponse);
      }
    }
  }

  async updateSpecies(id, fieldName, fieldValue) {
    await DatabaseService.instance.syncDatabase();

    let success = false;
    let query =
    `UPDATE species
    SET ` + fieldName + ` = '` + fieldValue + `'
    WHERE id = ` + id + `;`;

    let db = await DatabaseService.instance.getDB();
    await db.transaction (async tx => {
      await tx.executeSql(query)
      success = true;
    });

    DatabaseService.instance.uploadDatabase();
    
    return success;
  }

  async _updateSpecies() {
    let S3 = await DatabaseService.instance.getS3();
    let listResponse = await S3
      .listObjects({ Bucket: "natappdata", Prefix: "json/" })
      .promise();
    let objectList = listResponse.Contents;

    for (const item of objectList) {
      let speciesResponse = await S3
        .getObject({ Bucket: "natappdata", Key: item.Key })
        .promise();

      try {
        
        let speciesString = speciesResponse.Body.toString();
        let speciesData = JSON.parse(speciesString);

        if (!speciesData.scientificName || !speciesData.tags) {
          console.log("Found nonspecies: ", speciesData)
          return;
        }

        let speciesQuery = await DatabaseService.instance.getSpecies(speciesData);
        if (speciesQuery.id) {
          DatabaseService.instance.insertTraits(speciesData, speciesQuery.id);
        }
      } catch (err) {
        console.warn("Species TRAIT error:", err, speciesResponse);
      }
    }
  }

  async _updateImageURLs() {
    let db = await DatabaseService.instance.getDB();
    await db.transaction (async tx => {
      let [txtwo, result] = await tx.executeSql(
        `
        UPDATE images
        SET url = substr(url, 14)
        WHERE substr(url, 1, 13) = '~/data/files/';
        `
        );
      console.log(result);
    });
  }
  async getSpecies(id) {
    let species;
    let query =
    `SELECT * FROM aliasedSpecies WHERE id = ` + id + `;`;

    let db = await DatabaseService.instance.getDB();
    await db.transaction( async (tx) => {
      let [t, result] = await tx.executeSql(query);
      species = result.rows.item(0);
    });
    return species;
  }

  async insertSpecies(speciesData, speciesTraits, speciesImages, speciesLinks = []) {
    // Returns the species.id of the newly creates species entry
    // or -1 on failure.
    let speciesId = -1;

    let verified = await DatabaseService.instance.verifyData(speciesData, speciesTraits, speciesImages);
    if (!verified) {
      return speciesId;
    }

    let isAuth = await DatabaseService.instance.checkAuth();
    if (!isAuth) return;

    await DatabaseService.instance.syncDatabase();

    let db = await DatabaseService.instance.getDB();

    await db.transaction(async tx => {
      console.log("Inserting Species entry: " + speciesData);
      let [txtwo, insertSpeciesResult] = await tx.executeSql(
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
          speciesData.sciname,
          speciesData.overview,
          speciesData.behavior,
          speciesData.habitat,
          speciesData.size,
          speciesData.conservationstatus,
          speciesData.stype
        ]
      );

      speciesId = insertSpeciesResult.insertId;
    })
    .catch(error => {
      alert(speciesData.sciname + " insert failed!");
      console.error(error);
    });
    await DatabaseService.instance.insertAliases([speciesData.alias], speciesId);
    await DatabaseService.instance.insertLinks(speciesImages, speciesId, 'images');
    await DatabaseService.instance.insertTraits(speciesTraits, speciesId);
    if (speciesLinks.length > 0) {
      await DatabaseService.instance.insertLinks(speciesLinks, speciesId, 'links');
    }

    console.debug("SUCCESSFULLY INSERTED: " + speciesData.alias + " ID: " + speciesId);
    DatabaseService.instance.uploadDatabase();
    return speciesId;
  }

  async deleteSpecies(id) {
    Alert.alert('Double Confirm Deletion', 'Are you very sure you want to delete species id: ' + id + '?', [{text: 'Yes', onPress: async () => {
      let isAuth = await DatabaseService.instance.checkAuth();
      if (!isAuth) return;

      await DatabaseService.instance.syncDatabase();
      let db = await DatabaseService.instance.getDB();
      await db.transaction( async tx => {
        tx.executeSql('DELETE FROM traits WHERE id = ' + id);
        tx.executeSql('DELETE FROM aliases WHERE id = ' + id);
        tx.executeSql('DELETE FROM links WHERE id = ' + id);
        tx.executeSql('DELETE FROM images WHERE id = ' + id);
        tx.executeSql('DELETE FROM species WHERE id = ' + id);
      })
      .then( async () => {
        await DatabaseService.instance.uploadDatabase();
        Alert.alert('Species ' + id + ' deleted!');
      })
      .catch(err => {
        Alert.alert('Species ' + id + " deletion Failed!", [{text: 'Bye Bye.', onPress: () => {}}]);
      });
    }},
    {text: 'No', onPress: () => {}}]);
  }

  async verifyData(speciesData, speciesTraits, speciesImages) {
    //Verify that tags and images aren't empty
    if (speciesTraits.length <= 0) {
      Alert.alert('Species Verification Failed!', 'The passed traits array is empty, species must have at least one tag!');
      return false;
    }
    if (speciesImages.length <= 0) {
      Alert.alert('Species Verification Failed!', 'The passed images array is empty, species must have at least one image!');
      return false;
    }
    // Verify that the tags and images are arrays
    if (!Array.isArray(speciesTraits)) {
      Alert.alert('Species Verification Failed!', 'The passed traits are not in an array! Did you accidentally use curly braces?');
      return false;
    }
    if (!Array.isArray(speciesImages)) {
      Alert.alert('Species Verification Failed!', 'The passed images are not in an array! Did you accidentally use curly braces?');
      return false;
    }
    // Verify that the passed species data has
    // all the necessary species fields
    for (field of RequiredSpeciesFields) {
      if (!speciesData[field]) {
        Alert.alert('Species Verification Failed!', 'The passed data is missing the required field: ' + field);
        return false;
      }
    }
    
    let db = await DatabaseService.instance.getDB();

    // Check that the species doesn't already exist
    // by checking if there is an entry with the same scientific name
    let alreadyExists = false;
    await db.transaction(async tx => {
      let [t, existsResult] = await tx.executeSql(
        'SELECT * FROM species WHERE sciname = "' +
          speciesData.sciname + '";'
      );
      alreadyExists = existsResult.rows.length > 0 ? true : false;
    });
    if (alreadyExists) {
      Alert.alert('Species Verification Failed!', speciesData.sciname + " already exists.");
      return false;
    }

    return true;
  }

  async insertAliases(speciesAliases, id) {
    if (speciesAliases.length != 0) {
      let db = await DatabaseService.instance.getDB();
      await db.transaction(async tx => {
        for (alias of speciesAliases) {
          await tx.executeSql (
            `INSERT INTO aliases (
                id,
                alias
              ) VALUES (
                ?,
                ?
              );`,
              [
                id,
                alias
              ]
          );
        }
      })
      .catch (err => {
        console.warn(err);
      });
    }
  }

  async insertLinks(speciesLinks, id, linkType) {
    if (speciesLinks.length != 0) {
      let db = await DatabaseService.instance.getDB();
      await db.transaction(async tx => {
        for (link of speciesLinks) {
          await tx.executeSql (
            `INSERT INTO ` + linkType + ` (
                id,
                url
              ) VALUES (
                ?,
                ?
              );`,
              [
                id,
                link
              ]
          );
        }
      }).catch (err => {
        console.warn(err);
      });
    }
  }


  async insertTraits(speciesTags, id) {
    if (speciesTags.length != 0) {
      let db = await DatabaseService.instance.getDB();
      await db.transaction(async tx => {
        for (tag of speciesTags) {
          await tx.executeSql (
            `INSERT INTO traits (
                id,
                tag
              ) VALUES (
                ?,
                ?
              );`,
              [
                id,
                tag
              ]
          );
        }
      });
    }
  }

  async _addToDatabase(speciesData) {
    let db = await DatabaseService.instance.getDB();
    db.transaction(tx => {
      if (!speciesData.scientificName) return;

      tx.executeSql(
        'SELECT * FROM species WHERE sciname = "' +
          speciesData.scientificName +
          '"',
        [],
        (tx, resultSet) => {
          let alreadyExists = resultSet.rows.length > 0 ? true : false;
          if (alreadyExists) {
            console.log(speciesData.scientificName + " already exists, bro.");
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
            }
          );
        },
        err => {
          console.warn(err.message);
        }
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM species",
        [],
        (tx, resultSet) => {
          console.log("SPECIES", resultSet);
        },
        err => {
          // console.warn(err.message);
        }
      );
    });
  }

  async searchAliases (alias) {
    let searchResult;
    let db = await DatabaseService.instance.getDB();

    await db.transaction( async (tx) => {
        let query = `
          SELECT DISTINCT *
          FROM aliases
          WHERE alias = ?`;
        let [t, results] = await tx.executeSql(query, [alias]);
        searchResult = results.rows.raw();
    });
    return searchResult;
  }

  async getAliasedSpecies() {
    let allSpecies;
    let db = await DatabaseService.instance.getDB();
    //await DatabaseService.instance.createAliasedSpeciesView();
    await db.transaction(async tx => {
      let [t, results] = await tx.executeSql(
        `SELECT * FROM aliasedSpecies`
      );
      allSpecies = results.rows.raw();
    })
    .catch(error => {
      console.error(error);
    });

    return allSpecies;
  }

  async getSpeciesByCategory(colorIndex, sizeIndex, stypeIndex) {
    let params = [];
    let query = `SELECT DISTINCT * FROM aliasedSpecies`;

    if (colorIndex != -1) {
      let updatedQuery = DatabaseService.instance.appendCondition(query, `id IN (SELECT id FROM traits WHERE tag = ?)`);
      query = updatedQuery;
      params.push(ColorTraits[colorIndex]);
    }

    if (sizeIndex != -1) {
      let updatedQuery = DatabaseService.instance.appendCondition(query, `id IN (SELECT id FROM traits WHERE tag = ?)`);
      query = updatedQuery;
      params.push(SizeTraits[sizeIndex]);
    }

    if (stypeIndex != -1) {
      let updatedQuery = DatabaseService.instance.appendCondition(query, `id IN (SELECT id FROM traits WHERE tag = ?)`);
      query = updatedQuery;
      params.push(SpeciesTypes[stypeIndex]);
    }

    query = query.concat(` GROUP BY id;`);
    // console.log('FINISHED Query: ', query);
    // console.log('PARAMS: ', params);

    let db = await DatabaseService.instance.getDB();
    let results;
    await db.transaction (async tx => {
      let [txtwo, res] = await tx.executeSql(query, params);
      results = res.rows.raw();
    });

    return results;

  }

  appendCondition(query, conditionText, addConjuct = true, or = false ) {
    let newQuery = query;
    // Chop off any trailing semicolon
    if (query.includes(';')) {
      console.warn ('Semicolon found in query to append!');
      newQuery = query.slice(0, query.length-1);
    }
    if (!query.includes('WHERE')) {
      newQuery = newQuery.concat(' WHERE ');
    } else if (addConjuct) {
      or ? (newQuery = newQuery.concat(' OR ')) : (newQuery = newQuery.concat(' AND '));
    }
    newQuery = newQuery.concat(' ' + conditionText);
    // console.log("OLD Query: ", query);
    // console.log("NEW QUERY: ", newQuery);
    return newQuery;
  }

  async search (searchText) {
    let searchResult = [];
    let db = await DatabaseService.instance.getDB();
    let tags = searchText.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );

    if (tags.length <= 0) {
      return searchResult;
    }

    let firstCondition = true;
    let query =
    `SELECT DISTINCT *
    FROM aliasedSpecies
    WHERE (
      `;

    for (tag of tags) {
      let conditionText =
        "( id IN ( SELECT id FROM traits WHERE tag LIKE '%" + tag + "%' ) " +
        "OR id IN ( SELECT id FROM aliases WHERE alias LIKE '%" + tag + "%' ) " +
        `OR stype LIKE '%` + tag + `%' )
        `;

      let updatedQuery = DatabaseService.instance.appendCondition(query, conditionText, !firstCondition);
      query = updatedQuery;
      firstCondition = false;
    }

    query = query.concat(` );`);
    await db.transaction( async (tx) => {
      let [t, results] = await tx.executeSql(query);
      searchResult = results.rows.raw(); 
    });

    return searchResult;
  }

  async searchTraits (tag) {
    let searchResult;
    let db = await DatabaseService.instance.getDB();

    await db.transaction( async (tx) => {
        let query = `
          SELECT DISTINCT *
          FROM traits
          WHERE tag = ?`;
        let [t, results] = await tx.executeSql(query, [tag]);
        searchResult = results.rows.raw();
    });
    return searchResult;
  }

  async getImagesById (id) {
    let searchResult;
    let db = await DatabaseService.instance.getDB();

    await db.transaction( async (tx) => {
        let query = `
          SELECT *
          FROM images
          WHERE id = ?`;
        let [t, results] = await tx.executeSql(query, [id]);
        searchResult = results.rows.raw();
    });
    return searchResult;
  }

  async getReferencesById (id) {
    let searchResult;
    let db = await DatabaseService.instance.getDB();

    await db.transaction( async (tx) => {
        let query = `
          SELECT *
          FROM links
          WHERE id = ?`;
        let [t, results] = await tx.executeSql(query, [id]);
        searchResult = results.rows.raw();
    });
    return searchResult;
  }

  async createAliasedSpeciesView () {
    let db = await DatabaseService.instance.getDB();
    await db.transaction ( async tx => {
      tx.executeSql(`DROP VIEW IF EXISTS aliasedSpecies;`);
      tx.executeSql(
        `CREATE VIEW aliasedSpecies (
          id,
          sciname,
          alias,
          aliases,
          overview,
          behavior,
          habitat,
          size,
          conservationstatus,
          stype,
          url
      )
      AS
          SELECT s.id,
                sciname,
                alias,
                aliases,
                overview,
                behavior,
                habitat,
                size,
                conservationstatus,
                stype,
                url
            FROM species s,
                aliases a,
                images i,
                (
                    SELECT id,
                          GROUP_CONCAT(alias) AS aliases
                      FROM aliases
                    GROUP BY id
                )
                aa
          WHERE a.id = i.id AND 
                i.id = s.id AND 
                aa.id = s.id
          GROUP BY s.id;`
      )
    });
  }

  async createColorTraitsView () {
    let db = await DatabaseService.instance.getDB();
    await db.transaction ( async tx => {
      tx.executeSql(`DROP VIEW IF EXISTS colorTraits;`);
      
      tx.executeSql(
        `CREATE VIEW colorTraits (
          id,
          tag
      )
      AS
          SELECT *
            FROM traits
          WHERE tag IN ('brown', 'black', 'white', 'yellow', 'blue', 'green', 'red');
      `
      )
    });
  }

}



const instance = new DatabaseService();
Object.freeze(instance);

export default instance;
