var key = "9b9f310efa391a785a8ba71112f98ed7"; //API KEY
var city = "Richmond"; //base city

//current time and date
var currentDate = moment(). format('dddd, MMMM Do YYYY');
var currentTime = moment(). format('YYYY-MM-DD HH:MM:SS');

$(document).ready(function () {
    
//city searched list
var cityList = [];
$('.search').on("click", function (event){
    event.preventDefault();
    city = $(this).parent('.btn').siblings('.textVal').val().trim();
    if (city === "") { 
        return;
    };
    //saves searched city into local storage
    localStorage.setItem('city', JSON.stringify(cityList));
    tossCoin ();

});
//function that will fetch data from open weather API
function tossCoin (city) {
    var url =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial&appid="+ key;
fetch(url)
.then(function(response){
    return response.json();
})
.then (function (data){
    console.log(data);
    localStorage.setItem("city",JSON.stringify(data));
    console.log(data);

//setting the current city on the page
var cityCurrent = document.getElementById ("current-city");
cityCurrent.textContent = city;
//function for getting weather
})
}


});