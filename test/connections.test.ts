import { WorksIn } from '../src/controllers/models/works_in';
import { ErrorResponse } from '../src/utils/error_response';
import { testDb, insertIntoRedemptions, seedDb, seedTestDb, selectAllFromWorksIn, testSeedDataPath } from '../src/controllers/connections/sqlite';
import { Database } from 'sqlite3';
import request from 'supertest';
import { app, server } from '../src/index';
import { response } from 'express';
import { readCsv } from '../src/utils/csv_reader';

console.error = jest.fn();

describe('Database Functions', () => {
    beforeEach((done) => {
        testDb.run("DELETE FROM Redemptions;", () => {
            done();
        });
    });

    test('Test Database Connection', (done) => {
        expect(testDb).toBeInstanceOf(Database);
        done();
    });

    test('Select All From WorksIn', (done) => {
        selectAllFromWorksIn(testDb, (rows: WorksIn[]) => {
            expect(rows).toHaveLength(3);
            expect(rows[0]).toHaveProperty('staff_pass_id');
            expect(rows[0]).toHaveProperty('team_name');
            expect(rows[0]).toHaveProperty('created_at');
            done();
        });
    });

});