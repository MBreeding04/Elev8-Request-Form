import express from "express"
import mysql from "mysql"
import cors from "cors"
const app = express();

app.use(cors())


app.use(express.json());

const db = mysql.createConnection({
    host: process.env.REACT_APP_HOST,
    user: process.env.REACT_APP_USER,
    password: process.env.REACT_APP_PASSWORD,
    database: process.env.REACT_APP_DATABASE,
    port: process.env.REACT_APP_PORT
})
app.get("/", (_req, res) => {
    res.json({ message: "Connected" });
});
app.listen('5000', () => {
    console.log("Connected to server")
})