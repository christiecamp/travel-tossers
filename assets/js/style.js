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
          displayWeather(data, city);
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







//current time and date
var currentDate = moment().format("dddd, MMMM Do YYYY");
var currentTime = moment().format("YYYY-MM-DD HH:MM:SS");

//city searched list
var cityList = [];
$("#submit").on("click", function (event) {
  event.preventDefault();
  city = $(this).parent(".btn").siblings(".textVal").val().trim();
  if (city === "") {
    return;
  }
  cityList.push(city);
  //saves searched city into local storage
  localStorage.setItem("city", JSON.stringify(cityList));
  tossCoin();
});
//function that will fetch data from open weather API
function tossCoin(city) {
  var url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid=" +
    key;
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      localStorage.setItem("city", JSON.stringify(data));
      console.log(data);

      //setting the current city on the page
      var cityCurrent = document.getElementById("current-flip");
      cityCurrent.textContent = city;
      //function for getting weather
    });
}
