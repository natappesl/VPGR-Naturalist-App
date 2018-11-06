// Singleton Reference: https://www.sitepoint.com/javascript-design-patterns-singleton/
// Enumeration Reference: https://www.sohamkamani.com/blog/2017/08/21/enums-in-javascript/

//TODO: Update databse from S3 using ifModifiedSince param in getObject

import SQLite from "react-native-sqlite-storage";
import Amplify, { Storage, Auth } from "aws-amplify";
import aws_exports from "../aws-exports";
import AWS from "aws-sdk";
import RNFS from "react-native-fs";

Amplify.configure(aws_exports);
SQLite.DEBUG(false);
SQLite.enablePromise(true);

const dbFolderPath = "/data/data/com.vpgrnaturalistapp/databases/";
const dbFileName = "speciesDatabase.db";

let s3;
let db;
let dbLoaded;

const SEARCH_TYPE = {
  BY_NAME: "name",
  BY_SCI_NAME: "scientificName",
  BY_TAG: "tag",
  BY_TYPE: "type"
};
Object.freeze(SEARCH_TYPE);

const CONSERVATION_STATUS = {
  LC: "LC",
  NT: "NT",
  VU: "VU",
  EN: "EN",
  CR: "CR",
  EW: "EW",
  EX: "EX"
};
Object.freeze(CONSERVATION_STATUS);

class DatabaseService {
  constructor() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = this;
      dbLoaded = false;
      DatabaseService.instance.initAWS();
    }
    return DatabaseService.instance;
  }

  async initAWS() {
    Auth.currentCredentials().then(async credentials => {
      // Update aws credentials through Cognito to verify IAM Role
      AWS.config.update(Auth.essentialCredentials(credentials));
      s3 = new AWS.S3();

      let dbExists = await RNFS.exists(dbFolderPath + dbFileName);
      if (dbExists) {
        console.log("Found DB file: " + dbFolderPath + dbFileName);
      } else {
        await DatabaseService.instance.downloadDatabase();
      }

      await DatabaseService.instance.openDatabase();
    });
  }

  async openDatabase() {
    // await DatabaseService.instance.populateDatabase();
    // await DatabaseService.instance.uploadDatabase();

    db = await SQLite.openDatabase({ name: dbFileName });
    dbLoaded = true;

  }

  dbLoaded() {
    return dbLoaded;
  }

  async downloadDatabase() {
    console.log('Downloading database file ' + dbFileName + ' ...');
    s3.getObject({
      Bucket: "natappdata",
      Key: dbFileName,
      ResponseContentType: "application/x-sqlite3"
    })
      .promise()
      .then(data => {
        RNFS.writeFile(
          dbFolderPath + dbFileName,
          data.Body.toString("base64"),
          "base64"
        ).catch(error => {
          alert("Database download FAILED!");
          console.error(error);
        });
      });
  }

  async uploadDatabase() {
    console.log('Uploading database file ' + dbFileName + ' ...');
    let uploadDBFile = await RNFS.readFile(dbFolderPath + dbFileName, "base64");
    let buf = Buffer.from(uploadDBFile, "base64");
    s3.upload({
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
    await db.transaction(tx => {
      tx.exequteSql("DROP TABLE IF EXISTS species");
      tx.executeSql(
        `CREATE TABLE species (id INTEGER PRIMARY KEY AUTOINCREMENT, sciname STRING, overview STRING, behavior STRING, habitat STRING, size STRING, conservationstatus STRING, stype STRING); `
      );
    });
  }

  async populateDatabase() {
    let listResponse = await s3
      .listObjects({ Bucket: "natappdata", Prefix: "json/" })
      .promise();
    let objectList = listResponse.Contents;

    for (const item of objectList) {
      let speciesResponse = await s3
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
    let listResponse = await s3
      .listObjects({ Bucket: "natappdata", Prefix: "json/" })
      .promise();
    let objectList = listResponse.Contents;

    for (const item of objectList) {
      let speciesResponse = await s3
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

  async getSpecies(speciesData) {
    let speciesQuery;
    await db.transaction( async (tx) => {
      let [t, resp] = await tx.executeSql(`SELECT * FROM species WHERE sciname = ?;`, [speciesData.scientificName]);
      speciesQuery = resp.rows.item(0);
    });
    return speciesQuery;
  }

  async insertSpecies(speciesData) {
    let speciesId = -1;
    if (!speciesData.scientificName) return speciesId;

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

  // async insertLinks(speciesData, id) {
  //   if (speciesData.imageURL) {
  //     await db.transaction(tx => {
  //       tx.executeSql(
  //         `INSERT INTO links (id, url, type) VALUES (?,?, 'image');`,
  //         [id, speciesData.imageURL]
  //       );
  //     }).catch(error => {
  //       //alert(speciesData.scientificName + " insert imageURL failed!");
  //       console.error(error);
  //     });
  //   }
  //   if (speciesData.references) {
  //     let refs = speciesData.references.split(" ");
  //     for (const ref of refs) {
  //       await db.transaction(tx => {
  //         tx.executeSql(
  //           `INSERT INTO links (id, url, type) VALUES (?,?, 'reference');`,
  //           [id, ref]
  //         );
  //       }).catch(error => {
  //         //alert(speciesData.scientificName + " insert ref failed!");
  //         console.error(error);
  //       });
  //     }
  //   }
  // }

  async insertTraits(speciesData, id) {
    let traits = speciesData.tags.split(" ");
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

  async getAllDistinctSpecies() {
    let allSpecies;

    await db.transaction(async tx => {
      let [t, results] = await tx.executeSql(
        `SELECT * FROM species s, (aliases NATURAL JOIN links) a, images i WHERE a.id = i.id AND i.id = s.id GROUP BY s.id`
      );
      allSpecies = results.rows.raw();
    })
    .catch(error => {
      console.error(error);
    });

    return allSpecies;
  }

  async search (text) {
    let searchResult;
    await db.transaction( async (tx) => {
        let query = `SELECT DISTINCT * FROM species s, (aliases NATURAL JOIN links) a, images i WHERE a.id = i.id AND i.id = s.id AND ( a.id IN ( SELECT id FROM traits WHERE tag LIKE ? )) OR ( a.id IN ( SELECT id FROM aliases WHERE alias LIKE ? ));`;
        let [t, results] = await tx.executeSql(query, [text]);
        searchResult = results.rows.raw();
    });
    return searchResult;
  }
}

const instance = new DatabaseService();
Object.freeze(instance);

export default instance;
