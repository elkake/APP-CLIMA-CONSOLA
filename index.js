import 'colors'
import * as dotenv from 'dotenv'
import {
  inquirerMenu,
  leerInput,
  listarLugares,
  pausa
} from './helpers/inquirer.js'
import Busquedas from './models/busquedas.js'

// permite a acceder a la variable de entorno, en este caso se accede a el a traves de procces.env.nombreDeVariable
dotenv.config({ path: './tokens.env' })

const main = async () => {
  let opt = ''
  const busquedas = new Busquedas()
  busquedas.leerDB()
  do {
    opt = await inquirerMenu()

    switch (opt) {
      case '1':
        // mostrar el mensaje
        const lugar = await leerInput('Ciudad: ')
        // Buscar los lugares
        const lugares = await busquedas.ciudad(lugar)

        // Seleccionar el lugar
        const id = await listarLugares(lugares)
        if (id === '0') {
          continue
        }

        // extraer datos de ciudad para console
        const { nombre, lng, lat } = busquedas.buscarDatos(lugares, id)

        // Guardar en db
        busquedas.agregarHistorial(nombre)
        busquedas.guardarDB()
        // extraer datos de clima para console
        const { temp, desc, max, min } = await busquedas.climaLugar(lat, lng)

        console.log('\nInformacion de la ciudad\n'.green)
        console.log('Ciudad: ', nombre)
        console.log('Lat: ', lat)
        console.log('Lng: ', lng)
        console.log('Tiempo: ', desc)
        console.log('Temperatura: ', temp)
        console.log('Minima: ', min)
        console.log('Maxima: ', max)
        break
      case '2':
        busquedas.historialCapitalizado.forEach((lugar, id) => {
          const idx = `${id + 1}.`.green
          console.log(`${idx} ${lugar}`)
        })
        break
    }
    if (opt !== '0') await pausa()
  } while (opt !== '0')
}

main()
