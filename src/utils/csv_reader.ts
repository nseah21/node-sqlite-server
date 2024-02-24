import fs from "fs";
import { parse } from "csv-parse";

export function readCsv(filepath: string, callback: (result: string[]) => void) {
    fs.createReadStream(filepath) 
        .pipe(parse({ delimiter: ",", from_line: 2 }))
        .on("data", (row: string[]) => {
            // console.log(row);
            callback(row);
        })
}