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

      var APICurrentWeather = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${latitude},${longitude}`;

      //Unhide element Hourly Section Forecast
      ELEMENT_SECTION.style.display = "block";
      fetchWeatherAPIs(APICurrentWeather);
    })
  }
}

//List of APIs
function fetchWeatherAPIs(APICurrentWeather){
  fetch(APICurrentWeather)
  .then(response => response.json())
  .then(data => {

    //For Testing purposes
    console.log(data);

    currentWeather(data);
  })
  .catch(error => console.log(error));
};

function currentWeather(data){

};
//--===================== End of Functions =====================--