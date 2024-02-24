# node-sqlite-server
A simple Express server that allows users to track redemptions for christmas presents

# node-sqlite-server

### Instructions for running the server
- Ensure that you have `node` installed
- Pull a copy of the source code using:
  - `git clone git@github.com:nseah21/node-sqlite-server.git` via `ssh`, 
  - or `git clone https://github.com/nseah21/node-sqlite-server.git` via `https`,
  - or manually by downloding the ZIP file
- In a terminal window, make sure you are inside the root directory `node-sqlite-server/`
- To start the server:
  1. Run `npm ci`
  2. Uncomment the seed data block in `src/index.ts` to create and seed the databases
  3. You may comment out the seed data block after step 2
  4. Insert the two CSV files `staff-id-to-team-mapping.csv` and `staff-id-to-team-mapping-long.csv` into the `src/assets` folder, ensuring that the original file names are preserved
  5. Run `npx ts-node ./src/index.ts` to start the server
- To run the unit tests:
  1. Assuming you have already completed the steps above, run `npm test`

### Assumptions made 
- The CSV files containing the staff-to-team mappings are an append only file. Hence, there might exist (in the future) some `(staff_pass_id, team_name)` with more than one `created_at`, when staff members are rotated around teams during their employment.
- Each team can redeem their christmas presents at most once.

#### Note
- The CSV files have been omitted from version control to keep in line with best practices, although this might make the testing proces slightly more tedious...