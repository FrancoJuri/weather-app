let city = localStorage.getItem('city');
const title = document.querySelector('.title');
const btnClose = document.getElementById('btn-close');
const searchMore = document.getElementById('search-more');
const searchContainer = document.getElementById('search-container');
const londonRecomendation = document.getElementById('London-recomendation');
const barcelonaRecomendation = document.getElementById('Barcelona-recomendation');
const buenosAiresRecomendation = document.getElementById('BuenosAires-recomendation');
const weatherSection = document.getElementById('weather-section');
const celsius = document.getElementById('celsius');
const fahrenheit = document.getElementById('fahrenheit');
const searchForm = document.getElementById('search-form');
const citySearchInput = document.getElementById('city-search-input');
const divAlerts = document.getElementById('div-alerts');
const highlightsSection = document.getElementById('highlights-section');
const iconFavicon = document.querySelector('.link-favicon');
const changeDefaultCity = document.getElementById('change-default-city');
title.textContent = `Franco Juri | ${city} Weather`;

document.addEventListener('DOMContentLoaded', () => {
    celsius.classList.add('select-unit');
    const temperatureUnit = document.querySelector('.select-unit');
    consultAPI(city, temperatureUnit.value)
})

celsius.addEventListener('click', () => {
    celsius.classList.add('select-unit');
    const temperatureUnit = document.querySelector('.select-unit');
    fahrenheit.classList.remove('select-unit');
    consultAPI(city, temperatureUnit.value)
})

fahrenheit.addEventListener('click', () => {
    fahrenheit.classList.add('select-unit');
    celsius.classList.remove('select-unit');
    const temperatureUnit = document.querySelector('.select-unit');
    consultAPI(city, temperatureUnit.value)
});

changeDefaultCity.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'weather.html';
})

searchForm.addEventListener('submit', validateForm);

searchMore.addEventListener('click', showSearchMore)

btnClose.addEventListener('click', closeSearchMore)

barcelonaRecomendation.addEventListener('click', () => {
    const temperatureUnit = document.querySelector('.select-unit');
    city = 'Barcelona';
    consultAPI(city, temperatureUnit.value);
})

buenosAiresRecomendation.addEventListener('click', () => {
    const temperatureUnit = document.querySelector('.select-unit');
    city = 'Buenos Aires';
    consultAPI(city, temperatureUnit.value);
})

londonRecomendation.addEventListener('click', () => {
    const temperatureUnit = document.querySelector('.select-unit');
    city = 'London';
    consultAPI(city, temperatureUnit.value);
})

function showSearchMore(){
    searchContainer.style.display = 'flex';
    setTimeout(() => {
        searchContainer.style.transform = 'translateX(0px)'
    }, 1)
    searchMore.style.display = 'none';
    weatherSection.style.display = 'none';
}

function closeSearchMore(){
    searchContainer.style.transform = 'translateX(-770px)';
    setTimeout(() => {
        searchContainer.style.display = 'none';
        searchMore.style.display = 'block';
        weatherSection.style.display = 'flex';
    }, 290)
}

function validateForm(e){
    e.preventDefault();
    const temperatureUnit = document.querySelector('.select-unit');
    if(citySearchInput.value.trim() === ''){
        printAlert('You must type a location to search');
        return;
    }

    city = citySearchInput.value.trim();

    consultAPI(city, temperatureUnit.value);
}

function printAlert(msg){
    divAlerts.innerHTML = msg;
    citySearchInput.style.borderColor = 'red';
    citySearchInput.addEventListener('input', () => {
        citySearchInput.style.borderColor = 'rgb(231, 231, 235)';
        divAlerts.innerHTML = 'Type a location to search';
    })
}

async function consultAPI(el, unit){
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${el}&units=${unit}&appid=${mykey}`);
        const result = await response.json();
        if(Number(result.cod) === 404){
            printAlert('No results found');
            return;
        }
        title.textContent = `Franco Juri | ${el} Weather`;
        closeSearchMore();
        showHTML(result);
    } catch (error) {
        console.log(error)
    }
}   

function showHTML(el){
    const dateToday = moment().format('ddd, DD MMM');
    const temperatureUnit = document.querySelector('.select-unit');
    const { main: {temp, temp_max, temp_min, humidity, pressure}, name, visibility, wind: {speed}, weather } = el;
    const [weatherInfo] = weather;
    const { main, description, icon } = weatherInfo;
    iconFavicon.href = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    weatherSection.innerHTML = `
        <img src='https://openweathermap.org/img/wn/${icon}@2x.png' alt='${description} Icon' class='img-fluid weather-icon'>
        <h2> ${temp} <span>${temperatureUnit.textContent}</span></h2>
        <div class='min-max d-flex'>
            <p> min: ${temp_min}${temperatureUnit.textContent}</p> <p> max: ${temp_max}${temperatureUnit.textContent}</p>
        </div>
        <h3> ${main} </h3>
        <div class='date-div d-flex'>
            <span>Today</span> <span>•</span> <span>${dateToday}</span>
        </div>
        <div class='d-flex ubication-div'>
            <span class='ubication-icon'>?</span> <span>${name}</span>
        </div>
    `

    highlightsSection.innerHTML = `
        <div class='wind-speed box-highlight p-4 ms-5'>
            <h3>Wind speed</h3>
            <span class='mt-4'></span>
        </div>

        <div class='humidity-speed box-highlight p-4 ms-5'>
            <h3>Humidity</h3>
            <span class='humidity'>${humidity}<span>%</span></span>
        </div>

        <div class='visibility box-highlight p-4 ms-5'>
            <h3>Visibility</h3>
            <span class='mt-4'>${visibility} M</span>
        </div>

        <div class='air-pressure box-highlight p-4 ms-5'>
            <h3>Air Pressure</h3>
            <span class='mt-4'>${pressure} hPa</span>
        </div>

    `

    if(temperatureUnit.value === 'imperial'){
        document.querySelector('.wind-speed span').textContent = `${speed} Miles`
    } else{
        document.querySelector('.wind-speed span').textContent = `${speed} M/S`
    }

    if(window.matchMedia("(max-width: 817px)").matches){
        document.querySelector('.wind-speed').classList.remove('ms-5');
        document.querySelector('.visibility').classList.remove('ms-5');
    }
    
    if(window.matchMedia("(max-width: 628px)").matches){
        document.querySelector('.humidity-speed').classList.remove('ms-5');
        document.querySelector('.air-pressure').classList.remove('ms-5');
    }

}