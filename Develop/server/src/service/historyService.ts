import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';

// TODO: Define a City class with name and id properties
class City{
  name: string;
  id: string;
  constructor(name: string, id: string){
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
  //   try {
  //     const data = await fs.readFile('searchHistory.json', 'utf-8');
  //     return JSON.parse(data);
  //   } catch (error) {
  //     return [];
    
  // }
  return await fs.readFile('searchHistory.json', {
    flag: 'a+',
    encoding: 'utf-8',
  })
}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    // await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2));
    return await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, '\t'));

  }
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    // const cities = await this.read();
    // return cities.map((city: City) => new City(city.name, city.id));
    return await this.read().then((cities) => {
      let parsedCities: City[];

      // If states isn't an array or can't be turned into one, send back a new empty array
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (err) {
        parsedCities = [];
      }

      return parsedCities;
    });
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    // const cities = await this.read();
    // const newCity = new City(city, uuidv4());
    // cities.push(newCity);
    // await this.write(cities);
    if (!city) {
      throw new Error('City cannot be blank');
    }
    const newCity: City = {name: city, id: uuidv4() };
    return await this.getCities()
    .then((cities) => {
      if (cities.find((index) => index.name === city)){
        return cities;
      }
      return [...cities, newCity];
    })
    .then((updatedCities) => this.write(updatedCities))
    .then(() => newCity);
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    // let cities = await this.read();
    // cities = cities.filter((city: City) => city.id !== id);
    // await this.write(cities);
    return await this.getCities()
    .then((cities) => cities.filter((city) => city.id !== id))
    .then((filteredCities) => this.write(filteredCities));
  }
}

export default new HistoryService();
