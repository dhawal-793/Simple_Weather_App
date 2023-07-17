
const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const path = require("path");
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));
const viewsPath = path.join(__dirname, "views");
app.set('view engine', 'ejs');
app.set("views", viewsPath);
const port = process.env.PORT || 3000;

// const fetchDate = () => {
//     let date = new Date();
//     console.log(date.toLocaleDateString())
//     return ""
// }

app.get("/", (req, res) => {
    res.render('checkweather', { city: "", search: false });
})
app.post("/cancel", (req, res) => {
    // console.log(req.body)
    res.redirect("/")
})
app.post("/", (req, res) => {
    // console.log(req.body)
    const city = (req.body.city).trim();
    if (city === null || city === "") {

        res.render('checkweather', {
            city: city,
            search: true,
            value: 'missing'
        })
    }
    else if (!city.match(/^[A-Za-z]+$/)) {

        res.render('checkweather', {
            city: city,
            search: true,
            value: 'invalid'
        })
    }
    else {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=013151cc4308b7793e0e3bdc30347cad&units=metric`;
        https.get(url, (response) => {
            // console.log(response.statusCode)
            if (response.statusCode === 200) {
                // const date = fetchDate();
                response.on('data', (data) => {
                    const weather = JSON.parse(data);
                    console.log(weather)
                    const weather_data = {
                        Weather: weather?.weather[0]?.main,
                        Temperature: weather?.main?.temp,
                        Icon: weather?.weather[0]?.icon
                    }

                    res.render('checkweather', {
                        city: city,
                        search: true,
                        value: 'found',
                        cityname: city.toUpperCase(),
                        temperature: weather_data.Temperature,
                        weather: weather_data.Weather,
                        icon: `https://openweathermap.org/img/wn/${weather_data.Icon}@2x.png`
                    })
                })
            }
            else {

                res.render('checkweather', {
                    city: city,
                    search: true,
                    value: 'wrong'
                })
            }
        }).on("error", (error) => {
            // console.error("Error :", error)
            res.render('checkweather', {
                city: city,
                search: true,
                value: 'server-error'
            })
        });

    }
})



app.listen(port, () => {
    console.log("Server is running on port " + port);
})


// main => pressure, humidity
// wind => speed