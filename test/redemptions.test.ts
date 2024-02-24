import { WorksIn } from '../src/controllers/models/works_in';
import { ErrorResponse } from '../src/utils/error_response';
import { testDb, insertIntoRedemptions, seedDb, seedTestDb, selectAllFromWorksIn, testSeedDataPath } from '../src/controllers/connections/sqlite';
import { Database } from 'sqlite3';
import request from 'supertest';
import { app, server } from '../src/index';
import { response } from 'express';
import { readCsv } from '../src/utils/csv_reader';

console.error = jest.fn();

describe('POST /redemptions', () => {
  beforeEach((done) => {
    testDb.run("DELETE FROM Redemptions;", () => {
      done();
    });
  });

  afterAll((done) => {
    testDb.close();
    server.close();
    done()
  })

  test('responds with 400 and invalid format message', async () => {
    try {
      await request(app)
        .post('/redemptions')
        .send({ staff_name: 'MANAGER_T999888420B' })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toBe("must have required property 'staff_pass_id'");
        });
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });

  test('responds with 400 and invalid staff to team name mapping', async () => {
    try {
      await request(app)
        .post('/redemptions')
        .send({ staff_pass_id: 'nicholas_seah' })
        .then((res) => {
          expect(res.status).toBe(400);
          expect(res.body.message).toBe("No team found for given staff pass ID");
        });
    } catch (error) {
      expect(error).toBeFalsy();
    }
  });
});
