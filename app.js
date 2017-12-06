var express = require('express')
var app = express()

app.use(express.static("public"))
app.get("/",(req,res)=>{
  res.send("index.html")
})

app.listen(process.env.PORT || 3030, ()=>{

      console.log("app ready on port " + process.env.PORT + " or 3030")
})