import { Database } from "sqlite3";
import { readCsv } from "../../utils/csv_reader";
import { Redemption } from "../models/redemption";
import { ErrorResponse } from "../../utils/error_response";
import { WorksIn } from "../models/works_in";

const dbPath: string = `./src/databases/my_department.db`;
const testDbPath: string = `./src/databases/my_test_department.db`;

const seedDataPath: string = `./src/assets/staff-id-to-team-mapping-long.csv`;
export const testSeedDataPath: string = `./src/assets/staff-id-to-team-mapping.csv`;

export const db: Database = createDbConnection(dbPath);
export const testDb: Database = createDbConnection(testDbPath);

function createDbConnection(dbPath: string): Database {
    const db: Database = new Database(dbPath, (err: Error | null) => {
        if (err) {
            return console.error(err.message);
        }
        initialize(db);
        console.log("Connection with SQLite has been established");
    });
    return db;
}

function initialize(db: Database) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS WorksIn (
            staff_pass_id VARCHAR,
            team_name VARCHAR,
            created_at BIGINT,
            PRIMARY KEY (staff_pass_id, team_name)
        );
        CREATE TABLE IF NOT EXISTS Redemptions (
            team_name VARCHAR, 
            redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (team_name)
        );
    `);
}

export function selectAllFromWorksIn(db: Database, callback: (result: WorksIn[]) => void) {
    db.all("SELECT * FROM WorksIn;", (err: Error | null, rows: WorksIn[]) => {
        if (err) {
            return console.error(err.message);
        }
        console.log(rows);
        callback(rows);
    });
}

export function seedDb() {
    db.run(`DELETE FROM WorksIn;`)
    db.run(`DELETE FROM Redemptions;`)
    readCsv(seedDataPath, (row: string[]) => {
        db.run(
            `INSERT INTO WorksIn (staff_pass_id, team_name, created_at)
            VALUES (?, ?, ?);`, row, (err: Error | null) => {
            if (err) {
                return console.error(err.message);
            }
        }
        )
    })
}

export function seedTestDb() {
    testDb.run(`DELETE FROM WorksIn;`)
    testDb.run(`DELETE FROM Redemptions;`)
    readCsv(testSeedDataPath, (row: string[]) => {
        testDb.run(
            `INSERT INTO WorksIn (staff_pass_id, team_name, created_at)
            VALUES (?, ?, ?);`, row, (err: Error | null) => {
            if (err) {
                return console.error(err.message);
            }
        }
        )
    })
}

export function processRedemption(db: Database, staff_pass_id: string, callback: (result: ErrorResponse) => void) {
    selectTeamNameFromWorksIn(db, staff_pass_id, (staffToTeamNameMappings: WorksIn[]) => {
        if (staffToTeamNameMappings.length == 1) {
            console.log("staff_pass_id " + staff_pass_id + " maps to team_name " + staffToTeamNameMappings[0].team_name);
        } else {
            return callback({ code: 400, message: "No team found for given staff pass ID" });
        }

        selectRedemption(db, staffToTeamNameMappings[0].team_name, (redemptions: Redemption[]) => {
            if (redemptions.length == 0) {
                insertIntoRedemptions(db, staffToTeamNameMappings[0].team_name, (err: Error | null) => {
                    if (err) {
                        return callback({ code: 500, message: "The server encountered an error while processing your request" }); 
                    } else {
                        return callback({ code: 204 });
                    }
                });
            } else if (redemptions.length == 1) {
                return callback({ code: 400, message: "Unable to complete the request as there was an existing redemption at " + redemptions[0].redeemed_at });
            }
        });
    });
}

function selectTeamNameFromWorksIn(db: Database, staff_pass_id: string, callback: (results: WorksIn[]) => void) {
    db.all("SELECT team_name FROM WorksIn WHERE staff_pass_id = ? \
            ORDER BY created_at DESC LIMIT 1;", staff_pass_id, (err: Error | null, rows: WorksIn[]) => {
        if (err) {
            return console.error(err.message);
        }
        callback(rows);
    });
}

function selectRedemption(db: Database, team_name: string, callback: (results: Redemption[]) => void) {
    db.all("SELECT team_name, DATETIME(redeemed_at, 'localtime') AS redeemed_at FROM Redemptions WHERE team_name = ?;", team_name, (err: Error | null, rows: Redemption[]) => {
        if (err) {
            return console.error(err.message);
        }
        callback(rows);
    })
}

export function insertIntoRedemptions(db: Database, team_name: string, callback: (error: Error | null) => void) {
    db.run(`
            INSERT INTO Redemptions (team_name)
            VALUES (?);
    `, team_name, (err: Error | null) => {
        if (err) {
            console.error(err.message);
        } 
        callback(err);
    })
}
