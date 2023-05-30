// function for Day and Time
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let nextDayIndex = day + 1 > 6 ? 0 : day + 1;
  return days[nextDayIndex];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#weather-forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
   <div class="col-2">
     <div class="weather-forecast-date">${formatDay(forecastDay.time)}</div>
     <img
       src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
         forecastDay.condition.icon
       }.png"
       alt=""
     />
     <div class="weather-forecast-temperature">
       <span class="weather-forecast-temperature-max"> ${Math.round(
         forecastDay.temperature.maximum
       )}°</span>
       <span class="weather-forecast-temperature-min"> ${Math.round(
         forecastDay.temperature.minimum
       )}°</span>
     </div>
   </div>
 `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "0be4d0ade7d8f64fb3ca53dd30f6fotd";
  let latitude = coordinates.latitude;
  let longitude = coordinates.longitude;
  let apiForecastUrl = `https://api.shecodes.io/weather/v1/forecast?lat=${latitude}&lon=${longitude}&key=${apiKey}&units=${units}`;
  axios.get(apiForecastUrl).then(displayForecast);
}

//function to display weather details
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let windUnitElement = document.querySelector("#windUnits");
  if (units == "metric") {
    windElement.innerHTML = Math.round(response.data.wind.speed);
    windUnitElement.innerHTML = "km/hr";
  } else if (units == "imperial") {
    windElement.innerHTML = Math.round(response.data.wind.speed / 3.5);
    windUnitElement.innerHTML = "m/hr";
  }

  temperature = response.data.temperature.current;
  city = response.data.city;

  temperatureElement.innerHTML = Math.round(temperature);
  cityElement.innerHTML = city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;

  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `https://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.icon);

  getForecast(response.data.coordinates);
}

//function to search for a city
function search(city) {
  let apiKey = "0be4d0ade7d8f64fb3ca53dd30f6fotd";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);
}
// function to search city button might have to be : let cityInputElement = document.querySelector("#city-input").value; search(cityInputElement);

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector(".search-btn");
searchButton.addEventListener("click", handleSubmit);

// function for current location
function currentPosition(position) {
  let apiPositionUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${log}&key=${apiKey}&units=${units}`;
  let lat = position.coords.latitude;
  let log = position.coords.longitude;
  let apiKey = "0be4d0ade7d8f64fb3ca53dd30f6fotd";
  axios.get(apiPositionUrl).then(displayTemperature);
}

//function for current location button
function searchCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}
document
.querySelector("#current-location-btn").addEventListener("click", searchCurrentLocation);


//functions to covert and display celcius and fahrenheit temp
function displayFarenheitTemperature(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  units = "imperial";
  search(city);
}

function displaycelciusTemperature(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  units = "metric";
  search(city);
}

let temperature = null;
let units = "metric";
let apiKey = "0be4d0ade7d8f64fb3ca53dd30f6fotd";
let city = null;

//function for temp unit links click
let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFarenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displaycelciusTemperature);

//default city
search("New York");
