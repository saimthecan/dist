
document.getElementById("location-form").addEventListener("submit", getWeather);
const getWeatherButton = document.getElementById('userLocation');
getWeatherButton.onclick = getWeatherFromLocation;

const API_KEY = process.env.API_KEY;


async function fetchCountries() {
    try {
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const apiUrl = 'https://shivammathur.com/countrycity/countries';
      const response = await fetch(corsProxy + apiUrl);
      const countries = await response.json();
  
      const countrySelect = document.getElementById('countrySelect');
  
      countries.forEach((country) => {
        const option = document.createElement('option');
        option.value = country;
        option.text = country;
        countrySelect.add(option);
      });
     
  
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  }
  
  fetchCountries();

    // Fetch user's country using IP
async function fetchUserCountry() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const userCountry = data.country_name;
  
      // Set the fetched country as the default selected country
      const countrySelect = document.getElementById('countrySelect');
      countrySelect.value = userCountry;
  
      // Fetch cities for the default country
      fetchCities(userCountry);
    } catch (error) {
      console.error('Error fetching user country:', error);
    }
  }
  
  fetchCountries().then(() => {
    fetchUserCountry();
  });


  async function fetchCities(country) {
    try {
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `https://shivammathur.com/countrycity/cities/${encodeURIComponent(country)}`;
      const response = await fetch(corsProxy + apiUrl);
      const cities = await response.json();
  
      const citySelect = document.getElementById('citySelect');
      citySelect.innerHTML = ''; // Clear existing options
  
      cities.forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.text = city;
        citySelect.add(option);
      });
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  }

  document.getElementById('countrySelect').addEventListener('change', function () {
    const selectedCountry = this.value;
    fetchCities(selectedCountry);
  });


  
//Seçilen şehirden lat,lot alma
async function getLocation(city) {

    const nominatimUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=854312915ee06dc91df05e3b53609c26`;
   
    try {
      const response = await fetch(nominatimUrl);
      const data = await response.json();
  
      if (data.length === 0) {
        throw new Error("Geçersiz konum");
      } else {
     return { lat: data[0].lat, lon: data[0].lon };
     
      }
    } catch (error) {
      throw new Error("Koordinatlar alınamadı");
    }
  }

  // Kullanıcının ip'sinde lat,lot alma
async function getUserLocation() {
  
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();
    return { lat: data.latitude, lon: data.longitude };  
  }

  // Kullanıcının api'sinden hava durumu getirme
async function getWeatherFromLocation(event) {
	event.preventDefault();
	try {
	  const { lat, lon } = await getUserLocation();
	  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`;
  
	  const response = await fetch(url);
	  const data = await response.json();
  
	  if (data.cod === "404") {
		alert("Geçersiz konum. Lütfen tekrar deneyin.");
	  } else {
		displayWeather(data);
	  }
	} catch (error) {
	  alert("Hava durumu alınamıyor. Lütfen daha sonra tekrar deneyin.");
	}
  }

  //Seçilen şehirden api getirme
async function getWeather(event) {
    event.preventDefault();
  
    const selectElement = document.querySelector('.form-select2');
    const city = selectElement.value;
  
  
    try {
      const { lat, lon } = await getLocation(city);
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}&lang=en`;
      
  
      const response = await fetch(url);
      const data = await response.json();
     
  
      if (data.cod === "404") {
        alert("Geçersiz konum. Lütfen tekrar deneyin.");
      } else {
        console.log(data)
        displayWeather(data);
       
      }
    } catch (error) {
      alert("Hava durumu alınamıyor. Lütfen daha sonra tekrar deneyin.");
    }
  }



  function displayWeather(data) {
    let today = new Date();
    let day = today.getDate();
    let month = today.getMonth() + 1; // Add 1 because getMonth() returns 0-based index
    let year = today.getFullYear();
    let options = { weekday: 'long' };
    let dayName = today.toLocaleDateString('en-US', options);

   
  const dateElement = document.getElementById("day")
  const dayElement = document.getElementById("day-name")
  const weatherDescription = document.getElementById("desc");
  const temperature = document.getElementById("temp");
    const locationDisplay = document.getElementById("locations");
  
    dayElement.textContent = dayName;
    dateElement.textContent = day + '/' + month + '/' + year;
    weatherDescription.textContent = data.weather[0].description; 
  temperature.textContent = `${data.main.temp.toFixed(1)}°C`; 
  locationDisplay.innerHTML = "<strong>Location:</strong> " + `${data.name}, ${data.sys.country}`;

}



  

