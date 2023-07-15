
const express = require("express")
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log("Server is running on port " + port);
})


// main => pressure, humidity
// wind => speed