import {useState, useEffect} from 'react'
import countryService from './services/countries'
import axios from 'axios'
import weatherCodes from './services/descriptions'


const ShowCountries = ({countries, handleClick}) => {
  if (countries.length === 1) {
    return null
  }
  if (countries.length > 10) {
    return (
    <div>Too many matching countries, specify filter!</div>
    )
  } else {
    return (
    countries.map(country => <CountryLine key={country} country={country} handleClick={() => handleClick(country)} />)
    )
  }
}

const ShowCountryInfo = ({country}) => {
  if (country === null) {
    return null
  }
  return (
    <>
    <h2>{country.name.common}</h2>
    <p>capital {country.capital}</p>
    <p>area {country.area}</p>

    <ul>
      {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
    </ul>
    <br></br>
    <img src={country.flags.png} alt={'flag of the country'}></img>
    </>
  )
}

const CountryLine = ({country, handleClick}) => {
  return (
  <div key={country}>
    {country} <button onClick={handleClick}>show</button>
  </div> 
  )
}

const WeatherInfo = ({weather}) => {
  if (weather === null) {
    return null
  }

  //console.log(weatherCodes.getImageLink(weather.is_day, weather.weathercode))
  return (
    <div>
      <h2>Weather</h2>
      <p>temperature: {weather.temperature} (celsius)</p>
      <p>wind: {weather.winddirection} / {weather.windspeed} (direction / velocity (m/s))</p>
      <img src={weatherCodes.getImageLink(weather.is_day, weather.weathercode)} />
      <div>
      <p>Weather data provided by <a href='https://open-meteo.com/'>open-meteo.com</a> free API</p>
      <p>Weather images are linked from <a href='https://openweathermap.org/'>openweathermap.org</a> server</p>
      <p>WMO codes to image links conversion <a href='https://gist.github.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c'>object</a> originally by <a href='https://gist.github.com/stellasphere'>stellasphere</a> on github</p>
     </div>
    </div>
  )
}


function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState("")
  const [countriesToShow, setCountriesToShow] = useState([])
  const [countryInfo, setCountryInfo] = useState(null)
  const [weather, setWeather] = useState(null)
  const [coordinates, setCoordinates] = useState([])

  //Tää effekti ajetaan vain ekalla kerralla kun haetaan maalistaan kaikki maat
  useEffect(() => {
      countryService
      .getAll().then(response => {
        setCountries(response.data.map(country => country.name.common)) 
        setCountriesToShow(countries)
      })
    }, [])

  //Ajetaan joka kerta kun countriesToshow muuttuu, eli käyttäjä kirjoittaa jotain kenttään  
  useEffect(() => {  
    if (countriesToShow.length === 1) {  
    countryService
    .getCountry(countriesToShow[0])
    .then(response => {
      setCountryInfo(response)
    })
    }
    }, [countriesToShow])

  useEffect(() =>  {
    if (countryInfo) {
      axios
      .get(`https://geocoding-api.open-meteo.com/v1/search?name=${countryInfo.capital}&count=1&language=en&format=json`)
      .then(response => {
        setCoordinates([response.data.results[0].latitude, response.data.results[0].longitude])
        }).catch(() => {
          setCoordinates([])
        })
      //console.log(coordinates)
    }
  }, [countryInfo])

  useEffect(() => {
    //console.log('koordinaatit muuttui', coordinates[0], coordinates[1])
    if (coordinates.length > 0) {
    axios
    .get(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates[0]}&longitude=${coordinates[1]}&windspeed_unit=ms&current_weather=True`)
    .then(response => setWeather(response.data.current_weather)).catch(() => {
      setWeather(null)
    })
  }
  }, [coordinates])

  //console.log(coordinates.length)

  const handleChange = (event) => {
    setSearch(event.target.value)
    if (event.target.value.length === 0) {
      setCountriesToShow([])
    } else {
    setCountriesToShow(countries.filter(country => country.toLowerCase().includes(event.target.value.toLowerCase())))
    }
    setCountryInfo(null)
    setWeather(null)
  }

  const handleClick = (country) => {
    setCountriesToShow([country])
  }
  

  

  return (
    <>
      <form>
        find countries <input value={search} onChange={handleChange}></input>
     </form>
     <ShowCountries countries={countriesToShow} handleClick={handleClick}/>
     <ShowCountryInfo country={countryInfo} />
     <WeatherInfo weather={weather} />

     </>

  )
}

export default App
