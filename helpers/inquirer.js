import 'colors'
import inquirer from 'inquirer'

const preguntas = [
  {
    type: 'list',
    name: 'opcion',
    message: '¿Que desea hacer?',
    choices: [
      {
        value: '1',
        name: `${'1.'.green} Buscar ciudad`
      },
      {
        value: '2',
        name: `${'2.'.green} Historial`
      },
      {
        value: '0',
        name: `${'0.'.green} Salir`
      }
    ]
  }
]

const enter = [
  {
    type: 'input',
    name: 'entrada',
    message: `Por favor presione ${'ENTER'.green} para continuar`
  }
]

// mostrar menu | devuelve la opcion seleccionada (string)
export const inquirerMenu = async () => {
  console.clear()
  console.log('==========================='.green)
  console.log('   Seleccione una opción'.yellow)
  console.log('===========================\n'.green)

  const { opcion } = await inquirer.prompt(preguntas)

  return opcion
}

// pausar aplicacion antes de ir al menu principal
export const pausa = async () => {
  await inquirer.prompt(enter)
}

// leer lo que se ingresa | devuelve el mensaje puesto
export const leerInput = async message => {
  const question = [
    {
      type: 'input',
      name: 'desc',
      message,
      validate(value) {
        if (value.length === 0) {
          return 'Por favor ingrese un valor'
        }
        return true
      }
    }
  ]

  const { desc } = await inquirer.prompt(question)
  return desc
}


export const listarLugares = async (lugares = []) => {
  const choices = lugares.map((dato, i) => {
    const idx = `${i + 1}.`.green

    return {
      value: dato.id,
      name: `${idx} ${dato.nombre}`
    }
  })

  choices.push({
    value: '0',
    name: `${'0.'.green} Cancelar`
  })

  const preguntas = [{ type: 'list', name: 'id', message: 'Seleccione lugar', choices }]

  const { id } = await inquirer.prompt(preguntas)
  // choices= [{}{}{}]
  return id
}

export const confirmar = async message => {
  const question = [
    {
      type: 'confirm',
      name: 'ok',
      message
    }
  ]

  const { ok } = await inquirer.prompt(question)

  return ok
}

export const mostrarListadoChecklist = async (tareas = []) => {
  const choices = tareas.map((dato, i) => {
    const idx = `${i + 1}.`.green

    return {
      value: dato.id,
      name: `${idx} ${dato.desc}`,
      checked: dato.completadoEn !== null ? true : false
    }
  })

  const pregunta = [
    { type: 'checkbox', name: 'ids', message: 'Selecciones', choices }
  ]

  const { ids } = await inquirer.prompt(pregunta)
  // choices= [{}{}{}]
  return ids
}
