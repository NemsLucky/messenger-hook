'use strict'
require("dotenv").config()
const express = require("express")

const app = express()
app.use(express.json())

app.get("/", (req, res)=>{
    res.sendStatus(200)
})

app.post("/webhook", (req, res)=>{
    
    let body = req.body
    
    if(body.object === "page") {

        body.entry.forEach(entry=>{
            let webhook_event = entry.messaging[0]
            console.log(webhook_event)
        })

        res.status(200).send("EVENT_RECEIVED")
    } else {
        res.sendStatus(404)
    }
})

app.get("/webhook", (req, res)=>{

    const VERIFY_TOKEN = process.env.VERIFY_TOKEN

    let mode = req.query['hub.mode']
    let token = req.query['hub.verify_token']
    let challenge = req.query['hub.challenge']

    if(mode && token){
        if(mode === "subscribe" && token === VERIFY_TOKEN){
            console.log("WEBHOOK_VERIFIED")
            res.status(200).send(challenge)
        }
    } else {
        res.sendStatus(403)
    }

})

const PORT = process.env.PORT || 8080

app.listen(PORT, _=>console.log("server listing on port ", PORT))