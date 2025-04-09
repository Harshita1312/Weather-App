import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import humidity_icon from '../assets/humidity.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import moon_icon from '../assets/MOON.png'
import refresh_icon from '../assets/refresh.png'

const Weather = () => {

    const inputRef = useRef()
    const [weatherData, setWeatherData]=useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [currentCity, setCurrentCity] = useState("New York");

    const allIcons ={
        "01d":clear_icon,
        "01n":clear_icon,
        "02d":cloud_icon,
        "02n":cloud_icon,
        "03d":cloud_icon,
        "03n":cloud_icon,
        "04d":drizzle_icon,
        "04n":drizzle_icon,
        "09d":rain_icon,
        "09n":rain_icon,
        "10d":rain_icon,
        "10n":rain_icon,
        "13d":snow_icon,
        "13n":snow_icon,        
    }

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("weatherTheme") || "light";
    });
      
    
    const search = async (city)=>{
        if(!city){
            alert("Enter City Name");
            return;
        }
        setCurrentCity(city);
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

            const response = await fetch(url);
            const data = await response.json();

            if(!response.ok){
                alert(data.message);
                return;
            }

            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
            setSearchHistory(prev => {
                const updated = [data.name, ...prev.filter(c => c !== data.name)].slice(0, 5);
                localStorage.setItem("weatherSearchHistory", JSON.stringify(updated));
                return updated;
            });
        } catch(error){
            setWeatherData(false);
            console.error("Error in fetching weather data");
        }
    }
    // useEffect(()=>{
    //     search("New York")
    // },[])

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
        setSearchHistory(history);
        search("New York");
    }, []);

    useEffect(() => {
        document.body.classList.remove("light", "dark");
        document.body.classList.add(theme);
        localStorage.setItem("weatherTheme", theme);
    }, [theme]);
      
      
      

  return (
    <div className='weather'>
      <div className="search-bar">
        <input ref={inputRef} type='text' placeholder='Search City'/>
        
        <img src={search_icon} onClick={()=>search(inputRef.current.value)} alt="magnifing glass for searching"/>
        
        <button className="refresh-btn" onClick={() => search(currentCity)}>Refresh</button>
        
        {/* <button className="toggle-theme-btn" onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}> */}
            {/* <img
                src={theme === "light" ? moon_icon : clear_icon}
                alt="Toggle Theme"
                className="theme-icon"
            /> */}
            {/* <img src="/src/assets/clear.png" class="clear-icon"/> */}
            {/* </button>  */}
            <button className="toggle-theme-btn" onClick={() => setTheme(prev => prev === "light" ? "dark" : "light")}>
                <span className="theme-icon" style={{ fontSize: "24px" }}>
                    {theme === "light" ? "🌙" : "☀️"}
                </span>
            </button>


        {searchHistory.length > 0 && (
        <div className="search-history">
            <p>Recent Searches:</p>
            <ul>
                {searchHistory.map((city, idx) => (
                    <li key={idx} onClick={() => search(city)}>
                        {city}
                    </li>
                ))}
            </ul>
        </div>
        )}

      </div>
      {weatherData?<>
      <img src={weatherData.icon} className='weather-icon' />
      <p className='temperature'>{weatherData.temperature}°c</p>
      <p className='location'>{weatherData.location}</p>
      <div className='weather-data'>
        <div className='col'>
            <img src={humidity_icon} />
            <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
            </div>
        </div>
        <div className='col'>
            <img src={wind_icon} />
            <div>
                <p>{weatherData.windSpeed} Km/h</p>
                <span>Wind Speed</span>
            </div>
        </div>
      </div>
      </>:<></>}

      
    </div>
  )
}

export default Weather
