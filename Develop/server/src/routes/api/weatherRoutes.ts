import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  // TODO: GET weather data from city name
  try{
  const city = req.body.cityName;
  const weatherData = await WeatherService.getWeatherForCity(city);
  res.json(weatherData);
  res.status(200).send('Weather data received');

  // TODO: save city to search history
  await HistoryService.addCity(city);
  res.status(200).send('City added to search history');
  }
  catch (error){
    res.status(500).send('Error retrieving weather data or saving a city to search history');
  }
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try{
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error){
    res.status(500).send('Error retrieving search history');
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.status(200).send('City removed from search history');
  } catch (error){
    res.status(500).send('Error removing city from search history');
  }
});

export default router;
