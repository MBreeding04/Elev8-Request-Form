import express from "express"
import mysql from "mysql"
import cors from "cors"
import * as dotenv from 'dotenv'
dotenv.config()
console.log(dotenv.config())
const app = express();

app.use(cors())


app.use(express.json());

const db = mysql.createConnection({
    host: 'sql9.freemysqlhosting.net',
    user: 'sql9678711',
    password: 'dUyhpX35jf',
    database: 'sql9678711',
    port: '3306'
})
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL!');
        // Perform database operations here
    }
});
app.get("/", (_req, res) => {
    res.json({ message: "Connected" });
});
app.post("/VerifyUserPass", async (req, res) => {
    try {
        const UserName = req.body.UserName;
        const Password = req.body.Password;
        db.query(
            "SELECT * FROM AdminUsers WHERE UserName = ? AND Password = ?",
            [UserName, Password],
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                }
                else if (result.length > 0) {
                    res.send({ Authenticated: true })
                }
                else {
                    res.send({ Authenticated: false })
                }
            }
        );
    }
    catch (error) {
        res.send({ Authenticated: false, error: { error } })
    }
})
app.post("/InputFormEntry", async (req, res) => {
    try {
        const TypeOfError = req.body.TypeOfError;
        const PageOfError = req.body.PageOfError;
        const URLOfError = req.body.URLOfError;
        const WhatIsExpected = req.body.WhatIsExpected;
        const WhatDidHappen = req.body.WhatDidHappen;
        const NumOfPictures = req.body.NumOfPictures;
        db.query(
            "INSERT INTO `FormEntry` (`TypeOfEntry`, `PageOfError`, `URLOfError`, `WhatIsExpected`, `WhatDidHappen`, `NumOfPictures`) VALUES (?, ?, ?, ?, ?, ?)",
            [TypeOfError, PageOfError, URLOfError, WhatIsExpected, WhatDidHappen, NumOfPictures],
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                }
                else if (result.length > 0) {
                    res.send({inserted: true, result})
                }
                else {
                    res.send({inserted: true, result})
                }
            }
        );
    }
    catch (error) {
        res.send({inserted: false, error})
    }
})
app.post("/InputImages", async (req, res) => {
    console.log(req.body)
    try {
        const Blob = req.body.Blob;
        const UUID = req.body.UUID;
        db.query(
            "INSERT INTO `Pictures` (`PictureBlob`, `UUID`) VALUES (?, ?)",
            [Blob, UUID],
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                }
                else if (result.length > 0) {
                    res.send({inserted: true, result})
                }
                else {
                    res.send({inserted: false, result})
                }
            }
        );
    }
    catch (error) {
        res.send({inserted: false, error})
    }
})
app.listen('5000', () => {
    console.log("Connected to server")
}) 