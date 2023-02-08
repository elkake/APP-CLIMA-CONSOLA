import axios from 'axios'
import fs from 'fs'

class Busquedas {
  dbPath = './db/database.json'

  constructor() {
    this.leerDB()
    this.historial = []
  }

  get historialCapitalizado() {
    return this.historial.map(lugar => {
      let palabras = lugar.split(' ')
      // convierte la primera letra en mayuscula y une lo demas de la palabra
      palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))
      return palabras.join(' ')
    })
  }
  //   retorna los params para la busqueda
  get paramsOpenWeather() {
    return {
      appid: process.env.OPENW_KEY,
      lang: 'es',
      units: 'metric'
    }
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 3,
      language: 'es'
    }
  }

  //   llama a la API de mapbox para obtener la ubicacion del lugar
  async ciudad(lugar = '') {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox
      })

      const { data } = await instance.get()

      return data.features.map(lugar => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1]
      }))
    } catch (error) {
      console.log('no se encontro nada'.red)
    }
  }

  buscarDatos(ciudades, id) {
    const datos = ciudades.find(e => e.id === id)
    return datos
  }

  async climaLugar(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: { ...this.paramsOpenWeather, lat, lon }
      })
      const { data } = await instance.get()
      // respuesta
      return {
        desc: data.weather[0].description,
        temp: data.main.temp,
        max: data.main.temp_max,
        min: data.main.temp_min
      }
    } catch (e) {
      console.log(e)
    }
  }

  // metodo de grabacion del historial
  agregarHistorial(lugar = '') {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return
    }

    // mantener una cierta cantidad en el historial

    this.historial = this.historial.splice(0, 5)
    console.log("aqui",this.historial)
    // prevenir resultadors
    this.historial.unshift(lugar.toLocaleLowerCase())

    // grabar en DB
  }

  guardarDB() {
    const payload = {
      historial: this.historial
    }
    fs.writeFileSync(this.dbPath, JSON.stringify(payload))
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) return

    const info = fs.readFileSync(this.dbPath, 'utf-8')
    const data = JSON.parse(info)
    this.historial = data.historial
  }
}

export default Busquedas
