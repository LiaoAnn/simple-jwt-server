import dotenv from "dotenv";
import express from "express";
import jsonwebtoken from "jsonwebtoken";
dotenv.config();
const { HASH_KEY, PORT, ADDRESS } = process.env;
const simpleDB = [
    {
        email: "email1",
        password: "password1"
    },
    {
        email: "email2",
        password: "password2"
    }
]
const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    let user = simpleDB.find(u => u.email == email && u.password == password);
    if (typeof user != "undefined") {
        jsonwebtoken.sign(
            { email },
            HASH_KEY,
            {},
            (err, token) => {
                res.json({
                    success: true,
                    message: "",
                    data: token
                })
            }
        )
        return;
    }
    res.json({
        success: false,
        message: "Can't find user",
        data: ""
    })
    res.end();
})

app.get("/check", (req, res) => {
    const { headers } = req;
    let auth = headers["authorization"];
    if (typeof auth == "undefined") {
        res.json({
            success: false,
            message: "Missing header",
            data: ""
        })
        return;
    }

    let jwt = auth.split(" ").pop();
    jsonwebtoken.verify(jwt, HASH_KEY, (err, payload) => {
        if (err) res.sendStatus(403);
        res.json({
            success: true,
            message: "",
            data: payload
        })
    })
})

app.listen(PORT, ADDRESS, () => console.log(`App is running at ${ADDRESS}:${PORT}`));