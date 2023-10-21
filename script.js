//--===================== Start of Declaration =====================--


//--===================== End of Declaration =====================--

//--===================== Start of Execution=====================--
//First execution
window.addEventListener('load', () => {
    header();
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

//--===================== End of Execution =====================--

//--===================== Start of Functions =====================--
function header() {
    const header = document.querySelector("#header");
    header.innerHTML += 
    `
      <h1 class="text-center p-3">
        Weather Forecast
      </h1>
    `;
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
    alert("hello");
  }
}
//--===================== End of Functions =====================--