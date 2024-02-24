import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Validator, ValidationError, AllowedSchema } from "express-json-validator-middleware";
import { RedemptionRequestSchema } from "./controllers/models/redemption";
import { processRedemption, seedDb, seedTestDb, selectAllFromWorksIn } from "./controllers/connections/sqlite";
import { postRedemption } from "./controllers/handlers/redemption";
import { db } from "./controllers/connections/sqlite";

dotenv.config();

/* Uncomment this to re-seed the database */
// seedDb();
// seedTestDb();

export const app: Express = express();
app.use(express.json());

const port = process.env.PORT || 3000;
const { validate } = new Validator({});

app.get("/", (req: Request, res: Response) => {
    res.send("Hello and welcome to the Christmas Gifts redemption booth!\n\n \
    Please send a POST request to /redemptions in the following format:\n" +
        JSON.stringify({ "staff_pass_id": "STAFF_H123804820G" }));
});

app.post("/redemptions", validate({ body: RedemptionRequestSchema }), postRedemption(db))

app.use((err: Error | null, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ValidationError && err.validationErrors.body) {
        res.status(400).send({ message: err.validationErrors.body[0].message });
        next();
    } else {
        next(err);
    }
});

export const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
