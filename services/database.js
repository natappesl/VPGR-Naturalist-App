// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
// Enumeration Reference: https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/

//TODO: Update database from S3 using ifModifiedSince param in getObject
//TODO: Refactor into component?
//TODO: DB, S3 into This.
//TODO: Make S3, DB into getter
import SQLite from 'react-native-sqlite-storage';
import Amplify, { Storage, Auth } from 'aws-amplify';
import aws_exports from '../aws-exports';
import AWS from 'aws-sdk';
import RNFS from 'react-native-fs';
import {
  ColorTraits,
  SizeTraits,
  SpeciesTypes
} from '../constants/trait-categories';
import {Platform} from 'react-native';


Amplify.configure(aws_exports);
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const dbFolderPath = Platform.OS == 'ios' ?
  RNFS.LibraryDirectoryPath + '/LocalDatabase/' :
  '/data/data/com.vpgrnaturalistapp/databases/';

const dbFileName = 'speciesDatabase.db';

let _S3;
let _db;

class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = this;

      // DatabaseService.instance.updateDatabase();
    }
    return DatabaseService.instance;
  }

  async getS3() {
    if (_S3) {
      return _S3;
    }

    await Auth.currentCredentials().then(async credentials => {
      // Update aws credentials through Cognito to verify IAM Role
      AWS.config.update(Auth.essentialCredentials(credentials));
      _S3 = new AWS.S3();

      let dbExists = await RNFS.exists(dbFolderPath + dbFileName);
      if (dbExists) {
        console.log("Found DB file: " + dbFolderPath + dbFileName);
      } else {
        await DatabaseService.instance.downloadDatabase();
      }

      await DatabaseService.instance.getDB();
      // await DatabaseService.instance.updateDatabase();
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

  async updateDatabase() {
    await DatabaseService.instance.downloadDatabase();
    await DatabaseService.instance.createAliasedSpeciesView();
    await DatabaseService.instance.uploadDatabase();
  }

  async downloadDatabase() {
    console.log(RNFS);
    console.log('Downloading database file ' + dbFileName + ' ...');
    let S3 = await DatabaseService.instance.getS3();

    S3.getObject({
      Bucket: 'natappdata',
      Key: dbFileName,
      ResponseContentType: 'application/x-sqlite3'
    })
      .promise()
      .then(data => {
        console.log('Writing DB file to: ', dbFolderPath + dbFileName)
        RNFS.writeFile(
          dbFolderPath + dbFileName,
          data.Body.toString('base64'),
          'base64'
        ).catch(error => {
          alert('Database download FAILED!');
          console.error(error);
        });
      });
  }

  async uploadDatabase() {
    console.log('Uploading database file ' + dbFileName + ' ...');
    let uploadDBFile = await RNFS.readFile(dbFolderPath + dbFileName, "base64");
    let buf = Buffer.from(uploadDBFile, "base64");

    let S3 = await DatabaseService.instance.getS3();
    S3.upload({
      Bucket: "natappdata",
      Key: dbFileName,
      Body: buf,
      ContentType: "application/x-sqlite3"
    })
      .promise()
      .then(data => {
        alert("Database upload SUCCESS!");
      })
      .catch(error => {
        alert("Database upload FAILED!");
        console.error(error);
      });
  }

  async dropSpeciesTable() {
    let db = await DatabaseService.instance.getDB();
    await db.transaction(tx => {
      tx.exequteSql("DROP TABLE IF EXISTS species");
      tx.executeSql(
        `CREATE TABLE species (id INTEGER PRIMARY KEY AUTOINCREMENT, sciname STRING, overview STRING, behavior STRING, habitat STRING, size STRING, conservationstatus STRING, stype STRING); `
      );
    });
  }

  async populateDatabase() {
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

  async updateSpecies() {
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

  async updateImageURLs() {
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
  async getSpecies(speciesData) {
    let speciesQuery;
    let db = await DatabaseService.instance.getDB();
    await db.transaction( async (tx) => {
      let [t, resp] = await tx.executeSql(`SELECT * FROM species WHERE sciname = ?;`, [speciesData.scientificName]);
      speciesQuery = resp.rows.item(0);
    });
    return speciesQuery;
  }

  async insertSpecies(speciesData) {
    let speciesId = -1;
    if (!speciesData.scientificName) return speciesId;

    let db = await DatabaseService.instance.getDB();
    await db.transaction(async tx => {
      let [t, existsResult] = await tx.executeSql(
        'SELECT * FROM species WHERE sciname = "' +
          speciesData.scientificName +
          '"'
      );

      let alreadyExists = existsResult.rows.length > 0 ? true : false;
      if (alreadyExists) {
        console.warn(speciesData.scientificName + " already exists, bro.");
        return speciesId;
      }
    });

    await db
      .transaction(async tx => {
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
        return (speciesId = insertResult.insertId);
      })
      .catch(error => {
        alert(speciesData.scientificName + " insert failed!");
        console.error(error);
      });
    return speciesId;
  }

  async insertAliases(speciesData, id) {
    let names = speciesData.name.split(",");
    let db = await DatabaseService.instance.getDB();

    for (const name of names) {
      await db.transaction(tx => {
        tx.executeSql(`INSERT INTO aliases (id, alias) VALUES (?,?);`, [
          id,
          name
        ]);
      }).catch(error => {
        //alert(speciesData.scientificName + " insert Alias failed!");
        console.error(error);
      });
    }
  }

  async insertImageLinks(speciesData, id) {
    if (speciesData.imageURL) {
      let db = await DatabaseService.instance.getDB();
      await db.transaction((tx) => {
        tx.executeSql(
          `INSERT INTO images (id, url) VALUES (?,?);`,
          [id, speciesData.imageURL]
        );
      }).catch(error => {
        //alert(speciesData.scientificName + " insert imageURL failed!");
        console.error(error);
      });
    }
  }

  async insertReferenceLinks(speciesData, id) {
    if (speciesData.references) {
      let db = await DatabaseService.instance.getDB();
      let refs = speciesData.references.split(" ");
      for (reference of refs) {
        await db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO links (id,url) VALUES (?,?);',
            [id, reference]
          );
        }).catch(error => {
          //alert(speciesData.scientificName + " insert ref failed!");
          console.error(error);
        });
      }
    }
  }

  async _insertLinks(speciesData, id) {
    if (speciesData.imageURL) {
      let db = await DatabaseService.instance.getDB();
      await db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO links (id, url, type) VALUES (?,?, 'image');`,
          [id, speciesData.imageURL]
        );
      }).catch(error => {
        //alert(speciesData.scientificName + " insert imageURL failed!");
        console.error(error);
      });
    }
    if (speciesData.references) {
      let refs = speciesData.references.split(" ");
      for (const ref of refs) {
        await db.transaction(tx => {
          tx.executeSql(
            `INSERT INTO links (id, url, type) VALUES (?,?, 'reference');`,
            [id, ref]
          );
        }).catch(error => {
          //alert(speciesData.scientificName + " insert ref failed!");
          console.error(error);
        });
      }
    }
  }

  async insertTraits(speciesData, id) {
    let traits = speciesData.tags.split(" ");
    let db = await DatabaseService.instance.getDB();
    for (const tag of traits) {
      await db.transaction(tx => {
        tx.executeSql(`INSERT INTO traits (id, tag) VALUES (?,?);`, [id, tag]);
      }).catch(error => {
        //alert(speciesData.scientificName + " insert trait failed!");
        console.error(error);
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
