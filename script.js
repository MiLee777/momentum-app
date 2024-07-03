// Часы и календарь
const time = document.querySelector('.time');
const dateNow = document.querySelector('.date');

function showTime() {
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent = currentTime;

    setTimeout(showTime,1000);
    showDate();
}

showTime();

function showDate() {
    const date = new Date();
    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const currentDate = date.toLocaleDateString('en-US', options);
    dateNow.textContent = currentDate;
}

// Приветствие 
const greeting = document.querySelector('.greeting');

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    
    if (hours < 6) return 'night';
    else if (hours < 12) return 'morning';
    else if (hours < 18) return 'afternoon';
    else return 'evening';
}

const timeOfDay = getTimeOfDay();
const greetingText = `Good ${timeOfDay}`;
    
greeting.textContent = greetingText;

// Ввод имени
const nameEnter = document.querySelector('.name');

function setLocalStorage() {
    localStorage.setItem(nameEnter, nameEnter.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
    const nameFromLS = localStorage.getItem(nameEnter);
    if (nameFromLS !== null) {
        nameEnter.value = nameFromLS;
    }
}

window.addEventListener('load', getLocalStorage);


// Слайдер 
let randomNum;

function getRandomNum(min,max) {
    min = Math.ceil(1);
    max = Math.floor(20);
    randomNum = Math.floor(Math.random() * (max - min + 1) + min);
    return randomNum;
}

function setBg() {
    let timeOfDay = getTimeOfDay();
    let bgNum = getRandomNum().toString().padStart(2, '0');
    const img = new Image();
    img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
    img.onload = () => {
        document.body.style.backgroundImage = `url('${img.src}')`;
    }
}
setBg();

function getSlideNext() {
    randomNum = randomNum % 20 + 1;
    setBg();
}

function getSlidePrev() {
    randomNum = randomNum <= 1 ? 20 : randomNum - 1;
    setBg();
}

const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);


// Виджет погоды
const api = {
    endpoint: 'https://api.openweathermap.org/data/2.5/',
    key: '7b4cff3b40c46fd55396cb1e92f793eb'
}

const city = document.querySelector('.city');
let weatherIcon = document.querySelector('.weather-icon');
let temperature = document.querySelector('.temperature');
let weatherDescription = document.querySelector('.weather-description');
let wind = document.querySelector('.wind');
let humidity = document.querySelector('.humidity');
const error = document.querySelector('.weather-error');

city.addEventListener('keydown', enter);

function enter(e) {
    if (e.keyCode === 13) {
        getInfo(city.value);
    }
}

async function getInfo(data) {
    const res = await fetch(`${api.endpoint}weather?q=${data}&units=metric&appID=${api.key}`);
    const result = await res.json();
    displayResult(result);
}

function displayResult(result) {
    if (result.cod !== '404' && result.cod !== '400') {
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${result.weather[0].id}`);
        weatherIcon.style.display = 'block';
        temperature.textContent = `${Math.round(result.main.temp)}°C`;
        weatherDescription.textContent = result.weather[0].description;
        wind.textContent = `Wind speed: ${Math.round(result.wind.speed)} m/s`;
        humidity.textContent = `Humidity: ${result.main.humidity}%`;
        error.textContent = '';
    }
    else {
        error.innerHTML = `Error! City not found for '${city.value}'!`;
        weatherIcon.style.display = 'none';
        temperature.textContent = '';
        weatherDescription.textContent = '';
        wind.textContent = '';
        humidity.textContent = '';
    }
}

document.addEventListener('DOMContentLoaded', getWeather);

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Bangkok&lang=en&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
    const res = await fetch(url);
    const result = await res.json();
    
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${result.weather[0].id}`);
    temperature.textContent = `${Math.round(result.main.temp)}°C`;
    weatherDescription.textContent = result.weather[0].description;
    wind.textContent = `Wind speed: ${Math.round(result.wind.speed)} m/s`;
    humidity.textContent = `Humidity: ${result.main.humidity}%`;
    error.textContent = '';
    }


// Виджет "цитата дня"
const apiUrl = 'https://type.fit/api/quotes';

const changeQuote = document.querySelector('.change-quote');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');

document.addEventListener('DOMContentLoaded', getQuotesApi);
changeQuote.addEventListener('click', getQuotesApi);

async function getQuotesApi() {
  const response = await fetch(apiUrl);
  const data = await response.json();
  displayQuote(getRandomQuote(data));
}


function displayQuote(data) {
  quote.textContent = data.text;
  author.textContent = getAuthor(data);
}

function getRandomQuote(result) {
    const int = getRandomInt(result.length);
    return result[int];
}

function getRandomInt(length) {
    return Math.floor(Math.random() * length);
}

function getAuthor(data) {
      return data.author ? data.author : 'Unknown';
}


// Аудиоплеер
import playList from './playList.js';

const playPrev = document.querySelector('.play-prev');
const play = document.querySelector('.play');
const playNext = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');

const audio = new Audio();
let songIndex = 0;
let audioCurrentTime;
audio.src = playList[songIndex].src;

playList.forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('play-item');
    li.textContent = el.title;
    playListContainer.append(li);
});

let playing = true;
const playItem = document.querySelectorAll('.play-item');

playItem.forEach((item, index) => {
  item.addEventListener('click', () => {
    if(songIndex === index) {
      if(audio.paused) {
        playMusic();
      } else {
        pauseMusic();
      }
    } else {
      songIndex = index;
      playMusic();
    }
  })
})

play.addEventListener('click', () => {
  if(audio.paused) {
    playMusic();
  } else {
    pauseMusic();
  }
});

function playMusic() {
  audio.src = playList[songIndex].src; 
  audioCurrentTime = 0; 
  play.classList.add('pause');
  audio.play();
  updateMusicItem();
  playing = true;
}

function pauseMusic() {
  audio.pause();
  play.classList.remove('pause');
  playing = false;
}

function updateMusicItem() {
  playItem.forEach(item => item.classList.remove('item-active'));
  playItem[songIndex].classList.add('item-active');
}

audio.addEventListener('ended', () => {
    nextSong()
});

playNext.addEventListener('click', nextSong);

function nextSong() {
    songIndex++;
    if (songIndex > 3) {
        songIndex = 0;
    };
    audio.src = playList[songIndex].src;
    playing = true;
    playMusic();
}

playPrev.addEventListener('click', previousSong);

function previousSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = 3;
    }
    audio.src = playList[songIndex].src;
    playing = true;
    playMusic();
}

























