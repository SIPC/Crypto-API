const express = require('express');
const lib = require("./lib.js");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.json({ "status": 200, "msg": "Crypto-API, Developed by sipc.ink, https://github.com/SIPC/Crypto-API", });
});


app.get("/address/type", async (req, res) => {
    try {
        if (req.query.address) {
            const data = await lib.Get_Address_type(req.query.address)
            res.status(data.status).json(data);
        } else {
            res.status(400).json({ "status": 400, "msg": "Missing address parameter" });
        }
    } catch (error) {
        console.error("Error get address type:", error);
        res.status(500).json({ "status": 500, "msg": "Internal server error" });
    }
});



app.get("/address/info", async (req, res) => {
    if (!req.query.crypto) {
        return res.status(400).json({ "status": 400, "msg": "Missing crypto parameter" });
    }
    if (!req.query.address) {
        return res.status(400).json({ "status": 400, "msg": "Missing address parameter" });
    }
    try {
        const data = await lib.Get_Address_info(req.query.crypto, req.query.address)
        res.status(data.status).json(data);
    } catch (error) {
        console.error("Error get address type:", error);
        res.status(500).json({ "status": 500, "msg": "Internal server error" });
    }
})

app.listen(port, () => {
    console.log(`
     ██████╗██████╗ ██╗   ██╗██████╗ ████████╗ ██████╗        █████╗ ██████╗ ██╗
    ██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝██╔═══██╗      ██╔══██╗██╔══██╗██║
    ██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   ██║   ██║█████╗███████║██████╔╝██║
    ██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   ██║   ██║╚════╝██╔══██║██╔═══╝ ██║
    ╚██████╗██║  ██║   ██║   ██║        ██║   ╚██████╔╝      ██║  ██║██║     ██║
     ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝    ╚═════╝       ╚═╝  ╚═╝╚═╝     ╚═╝
    `);
    console.log(`Server running on http://localhost:${port}`);
});