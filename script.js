//--===================== Start of Declaration =====================--

//Note: DO NOT USE d-flex in section since section.style.display = 'none'; will not work
const ELEMENT_SECTION = document.querySelector("#sectionHourlyForecast");
const ELEMENT_MAIN = document.querySelector("#main");
const API_KEY = "cdcaf7b8f51846e3af9234924232110";

let longitude;
let latitude;
let inputLocation = document.querySelector("#inputLocation");
let isBoolean = false;
//--===================== End of Declaration =====================--

//--===================== Start of Execution=====================--
  window.addEventListener('load', () => {
  //Defaults
    //Hide element Hourly Section Forecast
    hideSection(true);

    //Focus input
    inputLocation.focus();
    displayHeader();

    getUserLocation();
  });


//Event Listeners
btnSearchLocation.addEventListener('click', () => {
  validateInputLocation();
});

inputLocation.addEventListener('keypress',(e)=> {
  if(e.key === "Enter"){
    validateInputLocation();(e);
  }
});

// //--===================== End of Execution =====================--

//--===================== Start of Functions =====================--
function displayHeader() {
    const header = document.querySelector("#header");
    header.innerHTML += 
    `
      <h1 class="text-center p-3">
        Weather Forecast
      </h1>
    `;
  }

function hideSection(isBoolean){

  isBoolean == true ? ELEMENT_SECTION.style.display = 'none': ELEMENT_SECTION.style.display = "block";;
}

//Validation
function validateInputLocation(){
  const inputLocation = document.querySelector("#inputLocation").value.toUpperCase();
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
  }
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
      ELEMENT_SECTION.style.display = "block";
      fetchWeatherAPIs(APICurrentWeather);
    })
  }
}

function convertStringToDateTime(strDateTime){
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
  })
  .catch(error => console.log(error));
};

function formatCurrentWeather(data){
  var dateTimeDetails = convertStringToDateTime(data.location.localtime);

   var right = `
        <div class="card-body">
          <div class="w-100 mt-5 row">

            <div class="col-2 pt-2 pb-2 divRight">
               <img class="position-absolute weatherIcon" src="${data.current.condition.icon}" alt="weather icon">
            </div>

            <div class="col-2 pt-2 pb-2 text-center fs-5">
              <h1 class="fw-bold">
                ${data.location.name}
              </h1>
              <span>
                ${data.location.region}, ${data.location.country}
              </span>
            </div>
            
            <div class="col-2 pt-2 pb-2">
              <div class="badge bg-primary fs-3">
              ${data.current.temp_c} °C
              </div>

              <div class="badge bg-info fs-4 mt-3">
              ${data.current.temp_f} °F
              </div>
            </div>

            <div class="col-2 pt-2 pb-2 divLeft shadow">
              Precipitation: <strong>${data.current.precip_in}%</strong>
                <br>
              Humidity: <strong>${data.current.humidity}%</strong>
                </br>
              Wind: <strong>${data.current.wind_kph} km/h </strong>
            </div>

            <div class="col-4 pt-2 pb-2 text-center fs-5">
              <span>
                As of <strong>${dateTimeDetails[0]}, ${dateTimeDetails[2]}</strong>
                </br>
                ${dateTimeDetails[1]}
                </br>
              </span>

              <span class="badge bg-warning">
                ${data.current.condition.text}
              </span>
            </div>

          </div>
        </div>


        <div class="card shadow mt-5 w-100">
          <div class="card-body">
          <div class="row">

            <div class="col-2 pt-2 pb-2 text-center">
            </div>

            <div class="col-2 pt-2 pb-2 text-center">
 
            </div>

            <div class="col-2 pt-2 pb-2=">

            </div>

            <div class="col-2 pt-2 pb-2 text-center">
            </div>

            <div class="col-2 pt-2 pb-2 text-center">
            
            </div>

            <div class="col-2 pt-2 pb-2 text-center">
            </div>
          
          </div>
        </div>
        </div>
      `
  var left =  `
    <div class="col-sm-6 mt-4">
      <div class="col-4 mt-3 w-100">
        <div class="text-center rounded-pill d-flex justify-content-center p-2">
          <span class="time fst-italic m-0 ps-2">
            Sunrise ${data.forecast.forecastday[0].astro.sunrise}
          </span>
        </div>
        <div class="text-center rounded-pill d-flex justify-content-center p-2 mt-3">
          <span class="time fst-italic ps-2  m-0">
            Sunset ${data.forecast.forecastday[0].astro.sunset}
          </span>
        </div>
      </div>
    </div>
  `

 
  // append children to parent main
  ELEMENT_MAIN.innerHTML += right;
  ELEMENT_MAIN.innerHTML += left;

};
//--===================== End of Functions =====================--