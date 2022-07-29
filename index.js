const express = require("express");
const port = 8000;

const app = express();





app.listen(port, (err)=>{
    if (err){
        return console.log("Unable to start server :",err);
    }
    return console.log("Server is listening on port",port);
})