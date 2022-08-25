$("#SearchAndButtons").hide().slideDown(1000);

        var apiKey = '68f9f7d4f37107a3a352c973a0ff2aac'; //The key for the api request
        var output = []; //The output that will be displayed(the forecast)
        var cityName = '';
        var selected = null; //A variable to check if any of the radio boxes has been selected

        var windSpeed = [];
        var windDirection = [];
        var humidity = [];

        // This function will run after the user will choose the submit button
        $("button").click(function () {

            cityName = document.getElementById('city').value;
            cityName = cityName.toLocaleUpperCase();

            selected = $('input[name="showToday"]:checked').val();

            // This is the URL for the api request
            var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`;

            fetch(url) // gets the api according to the request, alerts if the city does'nt exists or the apiKey invalid
                .then((resp) => {
                    if (!resp.ok) alert("Wrong input");
                    return resp.json();
                })
                .then((data) => {
                    shoWeather(data);
                })
                .catch(console.err);

        });

        function shoWeather(data) {
            //Outputs to the console, the data from the api request 
            console.log(data);

            //Max amount of days available for the forecast are 5,(there are 8 forecasts per day)
            let days = [data.list[0], data.list[8], data.list[16], data.list[24], data.list[32]];

            let lat = data.city.coord.lat; // Getting Latitude
            let lon = data.city.coord.lon; // Getting Longtitude
            let country = data.city.country; // Getting Country 

            let temp = [];
            let feelsLike = [];
            let maxTemp = [];
            let minTemp = [];
            let description = [];
            let timeAndDate = [];
            let icon = [];
            let backGroundPic = [];

            // In this loop all the data needed is collected into arrays, each array is in lengh 5 (max 5 days)
            for (const day of days) {
                temp.push(day.main.temp);
                feelsLike.push(day.main.feels_like);
                maxTemp.push(day.main.temp_max);
                minTemp.push(day.main.temp_min);
                description.push(day.weather[0].main + " - " + day.weather[0].description);
                if ((day.weather[0].description).includes('clouds')) {
                    backGroundPic.push('clouds');
                }
                else if ((day.weather[0].description).includes('rain')) {
                    console.log((day.weather[0].description).includes('rain'));
                    backGroundPic.push('rain');
                } 
                else if ((day.weather[0].description).includes('mist')) {
                    backGroundPic.push('mist');
                }
                else if ((day.weather[0].description).includes('snow')) {
                    backGroundPic.push('snow');
                }
                else {
                    backGroundPic.push(day.weather[0].description);
                }
                let date = (day.dt_txt).split(" ")[0].split("-").reverse().join("-");
                //let time = ((day.dt_txt).split(" ")[1]).substring(0,5);
                timeAndDate.push(date);
                icon.push(day.weather[0].icon);

                windSpeed.push(day.wind.speed);
                windDirection.push(day.wind.deg);
                humidity.push(day.main.humidity);
            }

            // This loop builds the output (a string that will be added to the html)
            // The output will hold 5 strings, each one is a forecast
            for (let index = 0; index < 5; index++) {

                output.push(`<div class="card" style="background-image: url('${backGroundPic[index]}.jpg');">
                <img src="http://openweathermap.org/img/wn/${icon[index]}@2x.png" alt="Avatar" >
            <div class="container" >                
                <h2>${cityName}, ${country}<br>
                    ${timeAndDate[index]}</h2>
                <h4>Latitude: ${lat}<br/> Longitude: ${lon}</h4> 
                <p>Tempreture (°C): ${temp[index]}°<br/>    
                Feels Like (°C): ${feelsLike[index]}°<br/>
                Max-temp (°C): ${maxTemp[index]}°<br/>
                Min-temp (°C): ${minTemp[index]}°<br/>
                ${description[index]}<p>
                    <div class="moreInfo">
                    <p>
                        Wind Speed: ${windSpeed[index]} KM/H<br/>
                        Wind Direction (degrees): ${windDirection[index]}°<br/>
                        Humidity: ${humidity[index]}%<br/>
                        <p>
                    </div>
                    <a href="#"><h4 class="ShowMore">Show more</h4><a>
            </div >
        </div > `);

            }

            // Checking if the user selected 5 days forecast or just one
            if (selected == "5days") {
                $("#weatherCards").html(output).hide();
                $(".moreInfo").hide();
                $("#weatherCards").slideDown(1000);
                $("#weatherCards").width(1700);
            }
            else {
                $("#weatherCards").html(output[0]).hide();
                $(".moreInfo").hide();
                $("#weatherCards").slideDown(1000);
                $("#weatherCards").width(600);
            }

            output = []; // zeroing the output

            // A function that show more or less data in the cards, the user need to click a card
            var rolled = false;
            $(".card").click(function () {


                if (!rolled) {
                    $(".moreInfo").slideDown(1000);
                    $(".ShowMore").text("Show less");

                }
                if (rolled) {
                    $(".moreInfo").slideUp(1000);
                    $(".ShowMore").text("Show more");
                }
                rolled = !rolled;s
            });

        }
