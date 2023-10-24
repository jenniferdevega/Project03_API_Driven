//--===================== Start of Declaration =====================--

//Note: DO NOT USE d-flex in section since section.style.display = 'none'; will not work
const SECTION_HOURLY = document.querySelector("#sectionHourly");
const DIV_HOURLY = document.querySelector("#divHourlyForecast");
const ELEMENT_MAIN = document.querySelector("#main");
const INPUT_LOCATION = document.querySelector("#inputLocation");
const BTN_SEARCH_LOCATION = document.querySelector("#btnSearchLocation");
const HEADER = document.querySelector("#header");

const API_KEY = "cdcaf7b8f51846e3af9234924232110";

let longitude;
let latitude;
let isBoolean = false;
//--===================== End of Declaration =====================--

//--===================== Start of Execution=====================--

  window.addEventListener('load', () => {
  //Defaults
    //Focus input
    INPUT_LOCATION.focus();

    //Hide element Hourly Section Forecast
    hideSection(true);
    displayHeader();
    getUserLocation();
  });
//--===================== End of Execution =====================--

//--===================== Start of Functions =====================--
function displayHeader() {
    HEADER.innerHTML +=
    `
      <h1 class="p-3 badge bg-primary fs-1">
        Weather Forecast
      </h1>
    `;
  }

function hideSection(isBoolean){
  isBoolean == true ? SECTION_HOURLY.style.display = 'none': SECTION_HOURLY.style.display = "block";;
}

//Validation
function isValidInputLocation(){
  const inputLocation = document.querySelector("#inputLocation").value.toUpperCase();
  var isValid = false;

  if(inputLocation =="" || !inputLocation.match(/\w/)){ 
    Swal.fire({
      title: 'Location Not Found',
      icon: 'error',
      html: '<span style="color:#0461B1">Please enter the correct <strong>Location Name</strong></span>',
      allowOutsideClick: false
    });
  }else{
    //Unhide element Hourly Section Forecast
    hideSection(false);
    isValid = true;
  }
  return isValid;
}

//Verify Device Enabled Location
function getUserLocation(){
  //Retrieve current location
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(coordinates => {

    //For Testing purposes
    console.log(coordinates);
    
      longitude = coordinates.coords.longitude;
      latitude = coordinates.coords.latitude;

      var APICurrentWeather = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}`;

      //Unhide element Hourly Section Forecast
      hideSection(false);

      fetchWeatherAPIs(APICurrentWeather);
    });
  };
}

function convertStringToDateTime(strDateTime){

  console.log(strDateTime);

  const DATE_TIME = new Date(strDateTime);
  var strDay;

  console.log(DATE_TIME);

  //Get Day of the Week
  switch (DATE_TIME.getDay()) {
    case 0:
      strDay = "Sunday";
      break;
    case 1:
      strDay = "Monday";
      break;
    case 2:
      strDay = "Tuesday";
      break;
    case 3:
      strDay = "Wednesday";
      break;
    case 4:
      strDay = "Thursday";
      break;
    case 5:
      strDay = "Friday";
      break;
    case 6:
      strDay = "Saturday";
  }

  //Get 12 hour format
  var hours = DATE_TIME.getHours();
  var minutes = DATE_TIME.getMinutes();
  var AMPM = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + AMPM;

  //Return DateTime in array format
  var arrayDateTimeDetails = new Array(3);
  arrayDateTimeDetails[0] = strDay;
  arrayDateTimeDetails[1] = DATE_TIME.toDateString().slice(3,16);
  arrayDateTimeDetails[2] = strTime;

  console.log(arrayDateTimeDetails);
  return arrayDateTimeDetails;
}

//List of APIs
function fetchWeatherAPIs(APICurrentWeather){
  fetch(APICurrentWeather)
  .then(response => response.json())
  .then(data => {

    //For Testing purposes
    console.log(data);

    formatCurrentWeather(data);
    searchLocation(APICurrentWeather, data);
  })
  .catch(error => console.log(error));
};

function formatCurrentWeather(data){
  var dateTimeDetails = convertStringToDateTime(data.location.localtime);

   var child = `
        <div class="card-body d-flex">
          <div class="w-100 mt-5 row d-flex">

            <div class="col-2">
               <img class="weatherIcon" src="${data.current.condition.icon}" alt="weather icon">
            </div>

            <div class="col-2 pt-2 text-center fs-5">
              <h1 class="fw-bold">
                ${data.location.name}
              </h1>
              <span>
                ${data.location.region}, ${data.location.country}
              </span>
            </div>
            
            <div class="col-2 pt-2">
              <div class="badge bg-primary fs-3">
              ${data.current.temp_c} °C
              </div>

              <div class="badge bg-info fs-4 mt-3">
              ${data.current.temp_f} °F
              </div>
            </div>

            <div class="col-2 pt-2 divLeft shadow">
              Precipitation: <strong>${data.current.precip_in}%</strong>
                <br>
              Humidity: <strong>${data.current.humidity}%</strong>
                </br>
              Wind: <strong>${data.current.wind_kph} km/h </strong>
            </div>

            <div class="col-4 pt-2 text-center">
              <span>
                As of <strong class=" fs-5">${dateTimeDetails[0]},</strong>
                <span class="fs-4">${dateTimeDetails[2]}</span>
                </br>
                <span class="fs-5">${dateTimeDetails[1]}</span>
                </br>
              </span>

              <span class="badge bg-info fs-5 mt-3">
                ${data.current.condition.text}
              </span>
            </div>

          </div>
        </div>

      <div class="card-body pt-5">
        <div class="w-100 mt-5 row">

          <div class="col-4 pt-2 pb-2 divLeft">
          </div>

          <div class="col-2 pt-2 pb-2 text-center fs-5">
            <img src="images/sunrise.gif" alt="sunrise icon" class="imgSunrise">
            <span class="badge bg-warning">
              Sunrise ${data.forecast.forecastday[0].astro.sunrise}
            </span>
          </div>

          <div class="col-2 pt-2 pb-2 text-center fs-5">
          <img src="images/sunset.gif" alt="sunset icon" class="imgSunset">
            <span class="badge bg-dark">
              Sunset ${data.forecast.forecastday[0].astro.sunset}
            </span>
          </div>
          
          <div class="col-4 pt-2 pb-2">
          </div>

        </div>
      </div>
      `
  // Append to parent
  ELEMENT_MAIN.innerHTML += child;

  getHourlyWeather(data);
};

function getHourlyWeather(data) {
    for (i = 0; i < 24; i++) {
      var dateTimeDetails = convertStringToDateTime(data.forecast.forecastday[0].hour[i].time);
      DIV_HOURLY.innerHTML +=
      `
        <div class="card-body d-flex">
            <div class="w-100 d-flex">

              <div class="divRight d-flex cardSize">
                <div
                   class="shadow-lg bg-body rounded-3 d-flex flex-column justify-content-center align-items-center mt-2 p-3 fs-3 cardSize">
                  <span>${dateTimeDetails[2]}</span>
                  <img
                    class="mt-3"
                    src="${data.forecast.forecastday[0].hour[i].condition.icon}" alt="weather icon"
                  >
                  <span class="text-center w-100 p-1 mt-3 badge bg-info fs-6 fw-bold">
                    ${data.forecast.forecastday[0].hour[i].condition.text}
                  </span>
                  <span class="text-center w-100 mt-3 fs-4">
                    ${data.forecast.forecastday[0].hour[i].temp_c} ℃ | ${data.forecast.forecastday[0].hour[i].temp_f} °F
                  </span>
                </div>
              </div>

            </div>
        </div>
      `
    }
}

function resetElements(){
  DIV_HOURLY.innerHTML = "";
};

function searchLocation(api, data){
  BTN_SEARCH_LOCATION.addEventListener("click", () => {
    resetElements();
    if(isValidInputLocation()){
      hideSection(false);
      api = `https://api.weatherapi.com/v1/forecast.json?key=3f5f1e7f0c3f4ee4baa135432230210&q=${INPUT_LOCATION.value}`;
      fetchWeatherAPIs(api, data);
    }
  });

  INPUT_LOCATION.addEventListener('keypress',(e)=> {
    resetElements();
    if(e.key === "Enter"){
      if(isValidInputLocation()){
        hideSection(false);
        api = `https://api.weatherapi.com/v1/forecast.json?key=3f5f1e7f0c3f4ee4baa135432230210&q=${INPUT_LOCATION.value}`;
        fetchWeatherAPIs(api, data);
      }
    (e);
    }
  });

  console.log(`Input Value: ${INPUT_LOCATION.value}`);
  console.log(`API value: ${api}`);
}

//--===================== End of Functions =====================--

//--===================== Start of Function Execution=====================--
searchLocation();
//--===================== End of Function Execution =====================--