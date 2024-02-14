//api key
let key = "ce39e7239416ad754359ca762d28521";
//array to hold search history
let searchHistory = [];
let lastSearched = "";

//api for open weather
let getWeather = function (city) {
  let apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

  //fetch api
  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          displayWeather(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })

    //catch errors
    .catch(function (error) {
      alert("Unable to connect to OpenWeather");
    });
};

//function to display weather
let searchSubmitHandler = function (event) {
  //prevent default
  event.preventDefault();

  //get value from input element
  let cityName = $("#cityname").val().trim();

  //check if search field has value
  if (cityName) {
    //pass value
    getWeather(cityName);
    //clear input
    $("#cityname").val("");
  } else {
    alert("Please enter a city name");
  }
};

//display weather
let displayWeather = function (weather) {
  //format and display values
  $("#city-name")
    .text(
      weather.name + " (" + dayjs(weather.dt * 1000).format("MM/DD/YYYY") + ") "
    )
    .append(
      `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png"></img>`
    );
  //temp
  $("#city-temp").text("Temperature: " + weather.main.temp.toFixed(1) + "°F");
  //humidity
  $("#city-humid").text("Humidity: " + weather.main.humidity + "%");
  //wind
  $("#city-wind").text("Wind Speed: " + weather.wind.speed.toFixed(1) + " mph");

  //lat & lon to make uv api call
  // use lat & lon to make the uv api call
  fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weather.coord.lat + "&lon="+ weather.coord.lon + "&appid=ce39e7239416ad754359ca762d28521a")
  .then(function(response) {
      response.json().then(function(data) {
      // display the uv index value
      $("#uv-box").text(data.value);

      //highlight value - using EPA's UV Index Scale colors
      if (data.value >= 11) {
        $("#uv-box").css("background-color", "#6c49cb");
      } else if (data.value < 11 && data.value >= 8) {
        $("#uv-box").css("background-color", "#d90011");
      } else if (data.value < 8 && data.value >= 6) {
        $("#uv-box").css("background-color", "#f95901");
      } else if (data.value < 6 && data.value >= 3) {
        $("#uv-box").css("background-color", "#f7e401");
      } else {
        $("#uv-box").css("background-color", "#299501");
      }
    });
  });

  //fetch 5-day forecast
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      weather.name +
      "&appid=ce39e7239416ad754359ca762d28521a&units=imperial"
  ).then(function (response) {
    response.json().then(function (data) {
      //clear previous entries
      $("#five-day").empty();
      //get the 5-day forecast
      for (i = 7; i <= data.list.length; i += 8) {
        //insert data
        let forecast =
          `
          <div class="col-md-2 m-2 py-3 card text-white bg-primary">
            <div class="card-body p-1">
              <h3 class="card-title">` +
          dayjs(data.list[i].dt * 1000).format("MM/DD/YY  ***") +
          `</h3>
              <img src="https://openweathermap.org/img/wn/` +
          data.list[i].weather[0].icon +
          `.png" alt="rain">
              <p class="card-text">Temp: ` +
          data.list[i].main.temp +
          `</p>
              <p class="card-text">Humidity: ` +
          data.list[i].main.humidity +
          `</p>
            </div>
          </div>
        `;
        //append to the page
        $("#five-day").append(forecast);
      }
    });
  });
  //save to last city searched
  lastSearched = weather.name;

  saveSearch(weather.name);
};

//save search
let saveSearch = function (city) {
  //check if city is already in the array
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    $("#search-history").append(
      "<a href='#' class='list-group-item list-group-item-action' id='" +
        city +
        "'>" +
        city +
        "</a>"
    );
  }

  //save to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  //save last searched city
  localStorage.setItem("lastSearched", JSON.stringify(lastSearched));
  //display array
  loadSearch();
};

//search history function
let loadSearch = function () {
  searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
  lastSearched = JSON.parse(localStorage.getItem("lastSearched"));

  //check if array is empty
  if (!searchHistory) {
    searchHistory = [];
  }
  //check if last searched is empty
  if (!lastSearched) {
    lastSearched = "";
  }

  //clear previous values
  $("#search-history").empty();

  //loop through all citys found in array
  for (i = 0; i < searchHistory.length; i++) {
    //add city as a link, set id, append
    $("#search-history").append(
      "<a href='#' class='list-group-item list-group-item-action' id='" +
        searchHistory[i] +
        "'>" +
        searchHistory[i] +
        "</a>"
    );
  }
};

//load search history
loadSearch();

//start on page with last searched
if (lastSearched != "") {
  getWeather(lastSearched);
}

//event handlers
$("#search-form").on("submit", searchSubmitHandler);
$("#search-history").on("click", function (event) {
  //get id value
  let city = $(event.target).closest("a").attr("id");
  //call getWeather function
  getWeather(city);
});
