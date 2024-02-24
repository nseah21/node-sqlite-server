import { Request, Response } from "express";
import { ErrorResponse } from "../../utils/error_response";
import { processRedemption } from "../connections/sqlite";
import { Database } from "sqlite3";

export function postRedemption(db: Database) {
    return (req: Request, res: Response) => {
        var staff_pass_id: string = req.body.staff_pass_id;
        processRedemption(db, staff_pass_id, (result: ErrorResponse) => {
            if (result.code == 204) {
                res.status(204).send();
            } else {
                res.status(result.code).send({ message: result.message });
            }
        });
    }
}