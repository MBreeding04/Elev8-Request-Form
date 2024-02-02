import express from "express"
import mysql from "mysql"
import cors from "cors"
import * as dotenv from 'dotenv'
dotenv.config()
const app = express();

app.use(cors())

app.use(express.raw({ type: 'application/octet-stream', limit: '5mb' }));
app.use(express.json({ limit: '5mb' })); // Add other middleware as needed
app.get("/", (_req, res) => {
    res.json({ message: "Connected" });
});
//control to verify Admin UserName and Password
app.post("/VerifyUserPass", async (req, res) => {
    const db = mysql.createConnection({
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
    })
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
    db.end((err)=>{
        if (err) {
            console.error('Error closing connecting to MySQL:', err);
        } else {
            console.log('closed MySQL!');
        }
    })
})
//inputs form into database
app.post("/InputFormEntry", async (req, res) => {
    const db = mysql.createConnection({
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
    })
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
                    res.send({ inserted: true, result })
                }
                else {
                    res.send({ inserted: true, result })
                }
            }
        );
    }
    catch (error) {
        res.send({ inserted: false, error })
    }
    db.end((err)=>{
        if (err) {
            console.error('Error closing connecting to MySQL:', err);
        } else {
            console.log('closed MySQL!');
        }
    })
})
//inputs images to the database, cooresponding to a form entry (one to many)
app.post("/InputImages", async (req, res) => {
    const db = mysql.createConnection({
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
    })
    try {
        console.log('Request Body:', req.body);
        const base64Data = req.body.Data; // Access the 'Data' property from the JSON object
        const UUID = req.body.UUID
        db.query(
            "INSERT INTO `Pictures` (`PictureBlob`, `UUID`) VALUES (?, ?)",
            [base64Data, UUID],
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                } else if (result.length > 0) {
                    res.send({ inserted: true, result })
                } else {
                    res.send({ inserted: true, result })
                }
            }
        );
    } catch (error) {
        res.send({ inserted: false, error })
    }
    db.end((err)=>{
        if (err) {
            console.error('Error closing connecting to MySQL:', err);
        } else {
            console.log('closed MySQL!');
        }
    })
});
//Pulls all form entries and pictures associated with each form entry
app.post("/PullAllEntries", async (req, res) => {
    const db = mysql.createConnection({
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
    })
    try {
        db.query(
            "SELECT FormEntry.EntryId, FormEntry.TypeOfEntry, FormEntry.PageOfError, FormEntry.URLOfError, FormEntry.WhatIsExpected, FormEntry.WhatDidHappen, FormEntry.NumOfPictures, GROUP_CONCAT(Pictures.PictureId) AS PictureIds FROM FormEntry LEFT JOIN Pictures ON FormEntry.EntryId = Pictures.UUID GROUP BY FormEntry.EntryId, FormEntry.TypeOfEntry, FormEntry.PageOfError, FormEntry.URLOfError, FormEntry.WhatIsExpected, FormEntry.WhatDidHappen, FormEntry.NumOfPictures",
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                } else if (result.length > 0) {
                    res.send({ returned: true, result })
                } else {
                    res.send({ returned: true, result })
                }
            }
        );
    } catch (error) {
        res.send({ returned: false, error })
    }
    db.end((err)=>{
        if (err) {
            console.error('Error closing connecting to MySQL:', err);
        } else {
            console.log('closed MySQL!');
        }
    })
});
//Pulls pictures by there foreign key of form entries
app.post("/PullPicturesById", async (req, res) => {
    const db = mysql.createConnection({
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
    })
    try {
        const EntryId = req.body.EntryId
        console.log(EntryId)
        db.query(
            "SELECT PictureBlob FROM Pictures Where UUID = ?",
            [EntryId],
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                } else if (result.length > 0) {
                    res.send({ returned: true, result })
                } else {
                    res.send({ returned: true, result })
                }
            }
        );
    } catch (error) {
        res.send({ returned: false, error })
    }
    db.end((err)=>{
        if (err) {
            console.error('Error closing connecting to MySQL:', err);
        } else {
            console.log('closed MySQL!');
        }
    })
});
//deletes all entries and pictures associated with each form entries
app.post("/DeleteAllEntries", async (req, res) => {
    const db = mysql.createConnection({
        host: process.env.REACT_APP_HOST,
        user: process.env.REACT_APP_USER,
        password: process.env.REACT_APP_PASSWORD,
        database: process.env.REACT_APP_DATABASE,
        port: process.env.REACT_APP_PORT
    })
    try {
        db.query(
            "DELETE FormEntry, Pictures FROM FormEntry LEFT JOIN Pictures ON FormEntry.EntryId = Pictures.UUID",
            (err, result) => {
                console.log(`error message: ${err}`)
                if (err) {
                    res.send({ message: "None", err: err })
                } else if (result.length > 0) {
                    res.send({ returned: true, result })
                } else {
                    res.send({ returned: true, result })
                }
            }
        );
    } catch (error) {
        res.send({ returned: false, error })
    }
    db.end((err)=>{
        if (err) {
            console.error('Error closing connecting to MySQL:', err);
        } else {
            console.log('closed MySQL!');
        }
    })
});
app.listen('5000', () => {
    console.log("Connected to server")
}) 