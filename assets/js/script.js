// TODO
// 1. When user search for a city in the input, call weather API and show the result in the HTML
//    - Add event listener to form submit
//    - Get the user input value
//    - Build the API query URL based on the user input value
//    - Call the API and render the result in the HTML
//        - Get the city name and show it in the main weather forecast card
//        - Get the first weather forecast item and get the following values
//            - date
//            - temperature
//            - wind speed
//            - humidity
//            - icon
//        - render those values to the main card
//        - Loop through all weathers array and get the following values
//            - date
//            - temperature
//            - wind speed
//            - humidity
//            - icon
//        - render those values to the smaller card
// 2. When user search for a city, store it in local storage
// 3. On initial page load load the search history and show it as a list in the HTML
//    - ....
//    - Build the API query URL based on the history stored in local storage
//    - Call the API and render the result in the HTML
// 4. When user click on the search history, call weather API and show the result in the HTML
// 5. CSS


const apiKey = "4691032df8d1c150d279bf0141595f60";

const searchForm = $('#search-form')
const inputFormCity = $('#search-input') //found dom elem by id
var todayCity = $('#today-city')
var todayIcon = $('#today-icon')
var todayDate = $('#date')
var todayTemp = $('#today-temperature')
var todayWind = $('#today-wind')
var todayHum = $('#today-humidity')
var forecastCards = $('#forecast')
var listCity = $('#history')

var localStorageKey = 'search-list'
var historyLimit=5
 
function saveItems(items){
  var rezultItems=[]
  if(items.length>historyLimit){
    rezultItems=items.slice(0,historyLimit)
  }else{
    rezultItems=items
  }
  localStorage.setItem(localStorageKey, JSON.stringify(rezultItems))
}

function unshift(cityName) {
    var items = getHistoryItems()
    items.unshift(cityName)

    saveItems(items)
}

function getHistoryItems() {
    var historyItems = localStorage.getItem(localStorageKey)
    if (historyItems === null) {
        return []
    } else {
        return JSON.parse(historyItems)
    }
}

function removeDuplicateCity(cityName) {
    var items = getHistoryItems()
    var rezultDuplicateCity = []
    for (i = 0; i < items.length; i++) {
        var itemsResult = items[i]
        if (itemsResult.toLowerCase() != cityName.toLowerCase()) {
            rezultDuplicateCity.push(itemsResult)
        }
    }
    saveItems(rezultDuplicateCity)
}

function getDate(forecastEntry) {
    return forecastEntry.dt_txt
}
function getTemp(forecastEntry) {
    var tempCelsius = forecastEntry.main.temp - 273.15
    return Math.round(tempCelsius * 100) / 100
}
function getWind(forecastEntry) {
    return forecastEntry.wind.speed
}
function getHum(forecastEntry) {
    return forecastEntry.main.humidity
}
function getIcon(forecastEntry) {
    return forecastEntry.weather[0]
}

function setDate(element, text) {
    element.text("Date: " + text)
}
function setTemp(element, text) {
    element.text("Temperature: " + text + '℃')
}
function setWind(element, text) {
    element.text("Wind: " + text + 'KPH')
}
function setHum(element, text) {
    element.text("Humidity: " + text + '%')
}
function setIcon(element, icon) {
    var iconUrl = 'https://openweathermap.org/img/w/' + icon.icon + '.png'
    element.attr('src', iconUrl)
    element.attr('alt', icon.descrption)
}

function showNowWeather(today) {
    var date = getDate(today)
    setDate(todayDate, date)

    var temp = getTemp(today)
    setTemp(todayTemp, temp)

    var wind = getWind(today)
    setWind(todayWind, wind)

    var humidity = getHum(today)
    setHum(todayHum, humidity)

    var icon = getIcon(today)
    setIcon(todayIcon, icon)
}

/*<div class="card mt-3 me-3">
<div class="card-body">
<h5 class="card-title">Date</h5>
<p class="card-text">time </p>
<img>
<p class="card-text">temp</p>
<p class="card-text">wind</p>
<p class="card-text">humidity</p>
</div>
</div> */

function createCard(forecastEntry) {
    var cardDate = getDate(forecastEntry)
    var cardTemp = getTemp(forecastEntry)
    var cardWind = getWind(forecastEntry)
    var cardHumidity = getHum(forecastEntry)
    var cardIcon = getIcon(forecastEntry)
    var card = $('<div class="card mt-3 me-3">')
    var cardBody = $('<div class="card-body">')
    var cardTitle = $('<h5 class="card-title">')
    cardTitle.text(cardDate)
    cardBody.append(cardTitle)
    var cardImg = $('<img>')
    setIcon(cardImg, cardIcon)
    cardBody.append(cardImg)
    var cardTemperature = $('<p class="card-text">')
    setTemp(cardTemperature, cardTemp)
    cardBody.append(cardTemperature)
    var cardwindP = $('<p class="card-text">')
    setWind(cardwindP, cardWind)
    cardBody.append(cardwindP)
    var cardHumid = $('<p class="card-text">')
    setHum(cardHumid, cardHumidity)
    cardBody.append(cardHumid)
    card.append(cardBody)
    forecastCards.append(card)
}

function renderHistory() {
    listCity.empty()
    var searchList = getHistoryItems()
    for (i = 0; i < searchList.length; i++) {
        var searchItem = searchList[i]
        var buttonList = $('<button class="btn btn-secondary mb-3">')
        buttonList.text(searchItem)
        listCity.append(buttonList)
    }
}

renderHistory()

function search(cityInput) {
    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    var geoUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput + '&limit=1&appid=' + apiKey
    fetch(geoUrl)
        .then(function (data) {
            return data.json()
        })
        .then(function (data) {
            // console.log(data)
            var lat = data[0].lat
            var lon = data[0].lon
            var cityName = data[0].name
            todayCity.text(cityName)
            unshift(cityName)
            renderHistory()
            // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
            var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey
            fetch(forecastUrl)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // console.log(data);
                    var today = data.list[0]

                    showNowWeather(today)
                    for (i = 1; i < data.list.length; i++) {
                        var forecast = data.list[i]
                        createCard(forecast)
                    }
                })
        })
}

listCity.on('click', '.btn-secondary', function () {
    var element = $(this)
    var textElement = element.text()

    removeDuplicateCity(textElement)
    search(textElement)
})

searchForm.on('submit', function (event) {
    event.preventDefault();
    var cityInput = inputFormCity.val().trim(); //reading input value
    inputFormCity.val('')
    if (cityInput === '') {
        return;
    }

    removeDuplicateCity(cityInput)
    search(cityInput)
}
)


