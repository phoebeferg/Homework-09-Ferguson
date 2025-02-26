import dayjs, {type Dayjs} from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string,
    
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
    
  }
}
  


// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string;
  private city: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
    this.city = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    try{
      if (!this.baseURL || !this.apiKey){
        throw new Error('API URL or API key is missing');
      }
      const response: Coordinates[] = await fetch(query)
      .then((res) => res.json());
      return response[0]
    }
    catch (error){
    console.error(error);
  } return;
}
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    if (!locationData) {
      throw new Error('Location data is missing');
    }
    const { name, lat, lon, country, state } = locationData;

    const coordinates: Coordinates = { name, lat, lon, country, state }
    return coordinates;
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const url = `${this.baseURL}/geo/1.0/direct?q=${this.city}&limit=1&appid=${this.apiKey}`;
    console.log(url)
    return url;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // 
  // 
  // 
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    if (!locationData) {
      throw new Error('Failed to fetch location data');
    }
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates))
      .then((res) => res.json());
      if (!response) {
      throw new Error('Failed to fetch weather data');
    }

    const currentWeather: Weather = this.parseCurrentWeather(response.list[0]);

    const forecastData: Weather[] = this.buildForecastArray(currentWeather, response.list);

    return forecastData;
  } catch (error) {
    console.error(error);
    return error;
  }
}
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const parsedDate = dayjs.unix(response.dt).format('dddd, MMMM D, YYYY');

    const weather = new Weather(
      this.city,
      parsedDate,
      response.main.temp,
      response.wind.speed,
      response.main.humidity,
      response.weather[0].icon,
      response.weather[0].description || response.weather[0].main
    );
    return weather
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecast: Weather[] = [currentWeather];

    const filteredWeatherData = weatherData.filter((data:any) => {
      return data.dt_txt.includes('12:00:00');
    });

    for (const day of filteredWeatherData) {
      forecast.push(
        new Weather(
          this.city,
          dayjs.unix(day.dt).format('dddd, MMMM D, YYYY'),
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    }
    return forecast

  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    try{
    this.city = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    if (coordinates) {
      const weather = await this.fetchWeatherData(coordinates);
      return weather;
    }
    throw new Error('Failed to fetch weather data');
  } catch (error) {
    console.error(error);
    throw error;
  }
}
}
export default new WeatherService();
