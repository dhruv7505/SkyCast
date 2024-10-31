const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const error=document.querySelector(".error");


let currentTab=userTab;
const API_KEY="16ee30182cd9aacf8e0233686d3ab2af";
currentTab.classList.add("current-tab");
getfromSessionStorage();
function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();            
        }
    } 
};

userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab)
});

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if (!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon}=coordinates;
    //hide the location grant page
    grantAccessContainer.classList.remove("active");
    // show user weather info
    loadingScreen.classList.add("active");

    try{
        const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        
        const data=await response.json();
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderInfo(data);
    }catch(err){
        loadingScreen.classList.remove("active");
        
        
    }
}

function renderInfo(weatherInfo){
    if(!weatherInfo){
        console.log(weatherInfo);
    }
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-country-Icon]");
    const cityTemp=document.querySelector("[data-temp]");
    const cityWindspeed=document.querySelector("[data-windSpeed]");
    const cityCloudiness=document.querySelector("[data-cloudiness]");
    const cityHumidity=document.querySelector("[data-humidity]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const weatherDisc=document.querySelector("[data-weatherDesc]");


    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDisc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    cityTemp.innerText=`${weatherInfo?.main?.temp} °C`;
    cityWindspeed.innerText=`${weatherInfo?.wind?.speed} m/s`;
    cityHumidity.innerText=`${weatherInfo?.main?.humidity} %`;
    cityCloudiness.innerText=`${weatherInfo?.clouds?.all} %`;
}
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(getPosition);
    }else{
        alert("NO Geolocation provided");
    }
}
function getPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantbtn=document.querySelector("[data-grantAccess]");
grantbtn.addEventListener("click",getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName ===""){
        return;
    }else{
        fetchSearcWeatherInfo(cityName);
    }
});
async function fetchSearcWeatherInfo(cityName){
    loadingScreen.classList.add("active");
    error.classList.remove("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    try{
        const response=await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
        );
        // console.log(response.status);
        if(response.status == 404){
            loadingScreen.classList.remove("active");
            error.classList.add("active");
            return;
        }
        const data=await response.json();
        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");
        
        renderInfo(data);
    }catch(err){
        console.log("errorhcicc");
        loadingScreen.classList.remove("active");
        // userInfoContainer.classList.remove("active");
        // error.classList.add("active");
        
    }
}