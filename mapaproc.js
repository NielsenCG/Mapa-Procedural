class StackVM {
  constructor() {
    this.stack = [];         // La pila donde se almacenan los valores
    this.programCounter = 0; // Puntero de instrucciones
    this.program = [];       // El programa (una lista de instrucciones)
    this.mapsin = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
    this.mapsmo = Array(200).fill(null).map(() => Array(200).fill(0));
    this.maprel = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
    this.maptem = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
    this.mappre = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
    this.mapbio = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
    this.mapcor = Array(200).fill(null).map(() => Array(200).fill(0));
    this.currentRow = 0;     // Controla la fila actual del mapa
    this.currentCol = 0;     // Controla la columna actual del mapa
    //this.outputElement = document.getElementById('output'); // Elemento HTML para la salida
  }

  // Método para cargar un programa en la máquina virtual
  loadProgram(program) {
    this.program = program;
    this.programCounter = 0;
  }

  // Método para ejecutar el programa cargado
  run() {
    while (this.programCounter < this.program.length) {
      const instruction = this.program[this.programCounter];
      this.execute(instruction);
      this.programCounter++;  // Avanzamos al siguiente comando
    }
  }

  // Ejecuta una instrucción basada en el tipo
  execute(instruction) {
    const [op, arg] = instruction;

    switch(op) {
      case 'PUSH':
        this.stack.push(arg); // Empuja un valor en la pila
        break;
      case 'POP':
        this.stack.pop();     // Saca el valor de la pila
        break;
      case 'ADD':
        this.binaryOp((a, b) => a + b); // Suma dos elementos
        break;
      case 'SUB':
        this.binaryOp((a, b) => b - a); // Resta dos elementos
        break;
      case 'MUL':
        this.binaryOp((a, b) => a * b); // Multiplica dos elementos
        break;
      case 'DIV':
        this.binaryOp((a, b) => b / a); // Divide dos elementos
        break;
      case 'PRINT':
        console.log(this.stack[this.stack.length - 1]); // Imprime el valor de la cima de la pila
        break;
      case 'FILLRELIEVE':
        this.fillMapAndPushRelieve(arg); // Llenar el mapa con números aleatorios y luego hacer POP
        break;
      case 'FILLTEMPERATURA':
        this.fillMapAndPushTemperature(arg);
        break;
      case 'FILLPRECIPITACION':
        this.fillMapAndPushPrecipitation(arg);
        break;
      case 'SMOOTHRELIEVE':
        this.smoothMapRelieve(arg); // Aplica el suavizado al mapa
        break;
      case 'SMOOTHTEMPERATURA':
        this.smoothMapTemperatura(arg); // Aplica el suavizado al mapa
        break;
      case 'SMOOTHPRECIPITACION':
        this.smoothMapPrecipitacion(arg); // Aplica el suavizado al mapa
        break;
      case 'COORDSGENERATOR':
        this.cordsGenerator();
        break;
      case 'BIOMAGENERATOR':
        this.generateBiomeMap();
        break
      default:
        throw new Error(`Instrucción desconocida: ${op}`);
    }
  }

  // Función auxiliar para operaciones binarias como ADD, SUB, MUL, DIV
  binaryOp(operation) {
    const a = this.stack.pop();
    const b = this.stack.pop();
    this.stack.push(operation(a, b));
  }

  // Función para llenar el mapa y empujar números aleatorios a la pila
  fillMapAndPushRelieve(count) {
    for (let i = 0; i < count; i++) {
      // Generar un número aleatorio entre -100000 y 100000
      const randomNum = Math.floor(Math.random() * 200001) - 100000;
      
      // Empuja el número a la pila
      this.stack.push(randomNum);

      // Insertar el número en el mapa en la posición actual
      this.mapsin[this.currentRow][this.currentCol] = this.stack[this.stack.length - 1];

      this.stack.pop();

      // Avanzar al siguiente punto del mapa
      this.currentCol++;
      if (this.currentCol >= 200) {
        this.currentCol = 0; // Volver a la primera columna
        this.currentRow++;   // Avanzar a la siguiente fila
      }

      // Si el mapa está lleno, parar
      if (this.currentRow >= 200) {
        this.printToOutput("El mapa está lleno. no continuar");
        this.mapsmo = this.mapsin
        return;
      }
    }
  }

  // Función para llenar el mapa y empujar números aleatorios a la pila
  fillMapAndPushTemperature(count) {
    this.currentRow = 0;
    this.currentCol = 0;
    for (let i = 0; i < count; i++) {
      // Generar un número aleatorio entre -100000 y 100000
      const randomNum = Math.floor(Math.random() * 1501) - 745;
      
      // Empuja el número a la pila
      this.stack.push(randomNum);

      // Insertar el número en el mapa en la posición actual
      this.maptem[this.currentRow][this.currentCol] = this.stack[this.stack.length - 1];

      this.stack.pop();

      // Avanzar al siguiente punto del mapa
      this.currentCol++;
      if (this.currentCol >= 200) {
        this.currentCol = 0; // Volver a la primera columna
        this.currentRow++;   // Avanzar a la siguiente fila
      }

      // Si el mapa está lleno, parar
      if (this.currentRow >= 200) {
        this.printToOutput("El mapa está lleno. no continuar");
        return;
      }
    }
  }

  // Función para llenar el mapa y empujar números aleatorios a la pila
  fillMapAndPushPrecipitation(count) {
    this.currentRow = 0;
    this.currentCol = 0;
    for (let i = 0; i < count; i++) {
      // Generar un número aleatorio entre -100000 y 100000
      const randomNum = Math.floor(Math.random() * 50001) - 24000;
      
      // Empuja el número a la pila
      this.stack.push(randomNum);

      // Insertar el número en el mapa en la posición actual
      this.mappre[this.currentRow][this.currentCol] = this.stack[this.stack.length - 1];

      this.stack.pop();

      // Avanzar al siguiente punto del mapa
      this.currentCol++;
      if (this.currentCol >= 200) {
        this.currentCol = 0; // Volver a la primera columna
        this.currentRow++;   // Avanzar a la siguiente fila
      }

      // Si el mapa está lleno, parar
      if (this.currentRow >= 200) {
        this.printToOutput("El mapa está lleno. no continuar");
        return;
      }
    }
  }


  // Método para suavizar el mapa con envoltura toroidal
  smoothMapRelieve(iterations) {
    const numRows = this.mapsmo.length;
    const numCols = this.mapsmo[0].length;
  
    for (let iter = 0; iter < iterations; iter++) {
      const newMap = [];
      for (let row = 0; row < numRows; row++) {
        newMap[row] = [];
        for (let col = 0; col < numCols; col++) {
          this.stack = []; // Reinicia la pila para cada celda
  
          // Recorre los vecinos incluyendo la celda actual
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              // Envoltura toroidal
              const newRow = (row + i + numRows) % numRows;
              const newCol = (col + j + numCols) % numCols;
  
              // Empuja el valor de la celda vecina a la pila
              this.stack.push(this.mapsmo[newRow][newCol]);
            }
          }
  
          // Suma los valores de la pila mientras los elimina
          while (this.stack.length > 1) {
            // Sumar el último valor al penúltimo, y luego hacer pop
            this.stack[this.stack.length - 2] += this.stack.pop();
          }
  
          // El último valor en la pila es la suma total, así que calculamos el promedio
          const sum = this.stack.pop(); // Saca el último valor que es la suma
          const count = 9; // Siempre tenemos 9 vecinos (3x3)
          newMap[row][col] = sum / count; // Calcula el promedio
        }
      }
      // Actualiza el mapa con los valores suavizados
      this.mapsmo = newMap;
      this.maprel = newMap;
    }
  }

  // Método para suavizar el mapa con envoltura toroidal
  smoothMapTemperatura(iterations) {
    const numRows = this.maptem.length;
    const numCols = this.maptem[0].length;
  
    for (let iter = 0; iter < iterations; iter++) {
      const newMap = [];
      for (let row = 0; row < numRows; row++) {
        newMap[row] = [];
        for (let col = 0; col < numCols; col++) {
          this.stack = []; // Reinicia la pila para cada celda
  
          // Recorre los vecinos incluyendo la celda actual
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              // Envoltura toroidal
              const newRow = (row + i + numRows) % numRows;
              const newCol = (col + j + numCols) % numCols;
  
              // Empuja el valor de la celda vecina a la pila
              this.stack.push(this.maptem[newRow][newCol]);
            }
          }
  
          // Suma los valores de la pila mientras los elimina
          while (this.stack.length > 1) {
            // Sumar el último valor al penúltimo, y luego hacer pop
            this.stack[this.stack.length - 2] += this.stack.pop();
          }
  
          // El último valor en la pila es la suma total, así que calculamos el promedio
          const sum = this.stack.pop(); // Saca el último valor que es la suma
          const count = 9; // Siempre tenemos 9 vecinos (3x3)
          newMap[row][col] = sum / count; // Calcula el promedio
        }
      }
      // Actualiza el mapa con los valores suavizados
      this.maptem = newMap;
    }
  }

  // Método para suavizar el mapa con envoltura toroidal
  smoothMapPrecipitacion(iterations) {
    const numRows = this.mappre.length;
    const numCols = this.mappre[0].length;
  
    for (let iter = 0; iter < iterations; iter++) {
      const newMap = [];
      for (let row = 0; row < numRows; row++) {
        newMap[row] = [];
        for (let col = 0; col < numCols; col++) {
          this.stack = []; // Reinicia la pila para cada celda
  
          // Recorre los vecinos incluyendo la celda actual
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              // Envoltura toroidal
              const newRow = (row + i + numRows) % numRows;
              const newCol = (col + j + numCols) % numCols;
  
              // Empuja el valor de la celda vecina a la pila
              this.stack.push(this.mappre[newRow][newCol]);
            }
          }
  
          // Suma los valores de la pila mientras los elimina
          while (this.stack.length > 1) {
            // Sumar el último valor al penúltimo, y luego hacer pop
            this.stack[this.stack.length - 2] += this.stack.pop();
          }
  
          // El último valor en la pila es la suma total, así que calculamos el promedio
          const sum = this.stack.pop(); // Saca el último valor que es la suma
          const count = 9; // Siempre tenemos 9 vecinos (3x3)
          newMap[row][col] = sum / count; // Calcula el promedio
        }
      }
      // Actualiza el mapa con los valores suavizados
      this.mappre = newMap;
    }
  }

  // Método para expandir las coordenadas desde el centro en espiral
cordsGenerator() {
  const directions = [
    [0, 1],  // Derecha
    [1, 0],  // Abajo
    [0, -1], // Izquierda
    [-1, 0]  // Arriba
  ];

  let x = 0;  // Centro de la cuadrícula
  let y = 0;
  let steps = 1;           // Cuántos pasos en una dirección antes de girar
  let currentDir = 0;      // Índice de la dirección actual en 'directions'

  this.stack.push([x, y]); // Empieza desde el centro

  // Usamos un objeto para mapear las coordenadas en este caso
  this.mapcor[`${x},${y}`] = this.stack[this.stack.length - 1]; // Marca el punto central

  while (this.stack.length < (201 * 201)) { // Hasta llenar toda la cuadrícula (-100, -100) a (100, 100)
    for (let i = 0; i < 2; i++) { // Dos segmentos de la misma longitud (derecha y abajo, luego izquierda y arriba)
      for (let j = 0; j < steps; j++) {
        // Mover en la dirección actual
        x += directions[currentDir][0];
        y += directions[currentDir][1];

        // Asegurarse de que las coordenadas estén dentro del rango -100 a 100
        if (x >= -100 && x <= 100 && y >= -100 && y <= 100) {
          this.stack.push([x, y]);   // Añadir las coordenadas a la pila
          this.mapcor[`${x},${y}`] = this.stack[this.stack.length - 1]; // Marca la posición
        }
      }
      // Cambiar de dirección (en el orden derecha, abajo, izquierda, arriba)
      currentDir = (currentDir + 1) % 4;
    }
    steps++; // Aumentar la cantidad de pasos en cada dirección después de dos giros
  }

    // Limpiar la pila si es necesario
    while (this.stack.length > 0) {
      this.stack.pop();
    }
  }
  // Método para asignar el estado del relieve
  getReliefState(valor) {
    if (valor <= -3500) {
      return 0; // Agua profunda
    } else if (valor <= -500) {
      return 1; // Agua media
    } else if (valor <= 0) {
      return 2; // Aguas bajas
    } else if (valor <= 250) {
      return 3; // Costa
    } else if (valor <= 2500) {
      return 4; // Bajo relieve
    } else if (valor <= 4000) {
      return 5; // Casi montañas
    } else {
      return 6; // Montañas
    }
  }

  // Método para asignar el estado de la temperatura
  getTemperatureState(valor) {
    if (valor <= -30) {
      return 0; // Gélido
    } else if (valor <= 0) {
      return 1; // Frío
    } else if (valor <= 25) {
      return 2; // Normal
    } else if (valor <= 40) {
      return 3; // Caliente
    } else {
      return 4; // Calor extremo
    }
  }

  // Método para asignar el estado de las precipitaciones
  getPrecipitationState(valor) {
    if (valor <= 0) {
      return 0; // Sin precipitaciones
    } else if (valor <= 500) {
      return 1; // Pocas precipitaciones
    } else if (valor <= 1250) {
      return 2; // Precipitaciones normales
    } else if (valor <= 1750) {
      return 3; // Bastantes precipitaciones
    } else {
      return 4; // Muchas precipitaciones
    }
  }

  // Método para procesar las coordenadas y asignar biomas usando una pila
  generateBiomeMap() {
    for (let x = 0; x < this.maprel.length; x++) {
      for (let y = 0; y < this.maprel[0].length; y++) {
        // Obtener el estado de relieve, temperatura y precipitaciones
        let reliefState = this.getReliefState(this.maprel[x][y]);
        let tempState = this.getTemperatureState(this.maptem[x][y]);
        let precipState = this.getPrecipitationState(this.mappre[x][y]);

        // Concatenar los tres estados como un código de bioma
        this.stack.push(`${reliefState}${tempState}${precipState}`);

        // Guardar el código de bioma en el mapa de biomas
        this.mapbio[x][y] = this.stack[this.stack.length - 1];
        this.stack.pop();
      }
    }
  }



  

  // Método para imprimir en el elemento HTML de salida
  printToOutput(message) {
    if (this.outputElement) {
      this.outputElement.textContent += message + '\n'; // Agrega al <pre> con salto de línea
    } else {
      console.log(message);
    }
  }

}

// Crear una instancia de la máquina virtual
const vm = new StackVM();

// Cargar un programa en la máquina virtual que utiliza FILLRELIEVE y SMOOTH
vm.loadProgram([
  ['PUSH', 5],             // Empuja el número 5 en la pila
  ['PUSH', 3],             // Empuja el número 3 en la pila
  ['ADD'],                 // Suma los dos valores en la cima de la pila (5 + 3)
  ['FILLRELIEVE', 40000],  // Llena el mapa con 40,000 números aleatorios entre -100,000 y 100,000
  ['SMOOTHRELIEVE', 70],
  ['FILLTEMPERATURA', 40000], 
  ['SMOOTHTEMPERATURA', 70], 
  ['FILLPRECIPITACION', 40000], 
  ['SMOOTHPRECIPITACION', 70],
  ['COORDSGENERATOR'], 
  ['BIOMAGENERATOR'],     // Aplica el suavizado 3 veces
  ['PUSH', 2],             // Empuja el número 2 en la pila
  ['MUL'],                 // Multiplica el número en la cima de la pila por 2
  ['PRINT']                // Imprime el resultado
]);

// Ejecutar el programa
vm.run();

// Opcional: Imprimir el mapa suavizado (por consola)
console.log("Mapa 200x200 de números suavizados:");
console.log(vm.mapbio)


// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
  
  // Evento para ejecutar el programa VM cuando se presiona el botón "Generar Mapa"
  document.getElementById('generarMapa').addEventListener('click', function() {
      vm.run(); // Ejecutar el programa VM (esto debería generar el mapa base)
      actualizarMapaBloques();


      // Evento para seleccionar y activar el tipo de mapa cuando se presiona el botón "Activar Mapa"
      document.getElementById('generarMapa').addEventListener('click', function() {
        const tipoMapaSeleccionado = document.getElementById('tipoMapa').value;

        // Usamos un switch para seleccionar el mapa correcto
        switch (tipoMapaSeleccionado) {
          case 'inicial':
            actualizarMapaBloques(); // Mapa 1: Mapa desde cero
            break;
          case 'suavizar':
            actualizarMapaSuavizado(); // Mapa 2: Mapa de suavizado
            break;
          case 'relieve':
            actualizarMapaRelieve(); // Mapa 3: Mapa de relieve
            break;
          case 'temperatura':
            actualizarMapaTemperatura(); // Mapa 4: Mapa de temperatura
            break;
          case 'precipitacion':
            actualizarMapaPrecipitacion(); // Mapa 5: Mapa de precipitación
            break;
          case 'biomas':
            actualizarMapaBiomas(); // Mapa 6: Mapa de biomas (deberás crear la función)
            break;
          default:
            console.log('Tipo de mapa no reconocido');
        }
      });
  
    });


});
  

  // Función que actualiza el mapa en el HTML
  function actualizarMapaBloques() {
    const mapaDiv = document.getElementById('mapa');
    let bloquesHTML = '';

    for (let i = 0; i < vm.mapsin.length; i++) {
        for (let j = 0; j < vm.mapsin[i].length; j++) {
            let tipo = '';

            if (vm.mapsin[i][j] < 0) {
                tipo = 'agua'; // Valor negativo es agua
            } else if (vm.mapsin[i][j] <= 3000) {
                tipo = 'tierra'; // Valor entre 0 y 3000 es tierra   
            } else {
                tipo = 'piedra'; // Valor mayor que 3000 es piedra
            }
            bloquesHTML += `<div class="bloque ${tipo}"></div>`;
        }
    }

    // Actualizamos el contenido del contenedor "mapa"
    mapaDiv.innerHTML = bloquesHTML;
  }

  // Función que actualiza el mapa en el HTML
  function actualizarMapaSuavizado() {
    const mapaDiv = document.getElementById('mapa');
    let bloquesHTML = '';

    for (let i = 0; i < vm.mapsmo.length; i++) {
        for (let j = 0; j < vm.mapsmo[i].length; j++) {
            let tipo = '';
 
            if (vm.mapsmo[i][j] < 0) {
                tipo = 'agua'; // Valor negativo es agua
            } else if (vm.mapsmo[i][j] <= 3000) {
                tipo = 'tierra'; // Valor entre 0 y 3000 es tierra   
            } else {
                tipo = 'piedra'; // Valor mayor que 3000 es piedra
            }
            bloquesHTML += `<div class="bloque ${tipo}"></div>`;
        }
    }

    // Actualizamos el contenido del contenedor "mapa"
    mapaDiv.innerHTML = bloquesHTML;
  }

  // Función que actualiza el mapa en el HTML
function actualizarMapaRelieve() {
  const mapaDiv = document.getElementById('mapa');
  let bloquesHTML = '';

  for (let i = 0; i < vm.mapsmo.length; i++) {
      for (let j = 0; j < vm.mapsmo[i].length; j++) {
          let valor = vm.mapsmo[i][j];
          let colorFondo;

          // Determinar color de fondo basado en el valor
          if (valor < -3500) {
              colorFondo = '#00008b'; // Azul oscuro
          } else if (valor < -500) {
              colorFondo = '#00bfff'; // Azul claro
          } else if (valor < 0) {
              colorFondo = '#00ffff'; // Cian
          } else if (valor < 250) {
            colorFondo = '#90ee90'; // Verde Claro
          }else if (valor < 1500) {
              colorFondo = '#00ff00'; // Verde
          } else if (valor < 2500) {
              colorFondo = '#ffff00'; // Amarillo
          } else if (valor < 4000) {
              colorFondo = '#ff8c00'; // Naranja
          } else if (valor < 5500) {
              colorFondo = '#ff0000'; // Rojo
          } else if (valor < 7000) {
              colorFondo = '#800080'; // Púrpura
          } else {
              colorFondo = '#8b4513'; // Marrón
          }

          // Generar el HTML para el bloque con el color de fondo
          bloquesHTML += `<div class="bloque" style="background-color:${colorFondo};"></div>`;
      }
  }

  // Actualizamos el contenido del contenedor "mapa"
  mapaDiv.innerHTML = bloquesHTML;
}


// Función que actualiza el mapa de temperatura en el HTML
function actualizarMapaTemperatura() {
  const mapaDiv = document.getElementById('mapa');
  let bloquesHTML = '';

  for (let i = 0; i < vm.maptem.length; i++) {
      for (let j = 0; j < vm.maptem[i].length; j++) {
          let valor = vm.maptem[i][j]; // Valor de temperatura
          let colorFondo;

          // Determinar color de fondo basado en el valor de temperatura
          if (valor < -30) {
              colorFondo = '#00008b'; // Azul oscuro para temperaturas extremadamente bajas (< -30°C)
          } else if (valor < 0) {
              colorFondo = '#00bfff'; // Azul claro para temperaturas bajas (de -30°C a 0°C)
          } else if (valor < 25) {
              colorFondo = '#00ff00'; // Verde para temperaturas templadas (de 0°C a 15°C)
          } else if (valor < 40) {
              colorFondo = '#ffff00'; // Amarillo para temperaturas cálidas (de 15°C a 30°C)
          } else if (valor < 60) {
              colorFondo = '#ff8c00'; // Naranja para temperaturas muy cálidas (de 30°C a 40°C)
          } else{
              colorFondo = '#ff0000'; // Rojo para temperaturas extremas (de 40°C a 50°C)
          }

          // Generar el HTML para el bloque con el color de fondo
          bloquesHTML += `<div class="bloque" style="background-color:${colorFondo};"></div>`;
      }
  }

  // Actualizamos el contenido del contenedor "mapa"
  mapaDiv.innerHTML = bloquesHTML;
}

// Función que actualiza el mapa de precipitaciones en el HTML
function actualizarMapaPrecipitacion() {
  const mapaDiv = document.getElementById('mapa');
  let bloquesHTML = '';

  for (let i = 0; i < vm.mappre.length; i++) {
      for (let j = 0; j < vm.mappre[i].length; j++) {
          let valor = vm.mappre[i][j]; // Valor de precipitaciones (mm/año)
          let colorFondo;

          // Determinar color de fondo basado en el valor de precipitaciones
          if (valor <= 0) {
              colorFondo = '#ffffff'; // Blanco para "Sin Precipitaciones"
              vm.mappre[i][j] = 0;
          } else if (valor <= 500) {
              colorFondo = '#ffff00'; // Amarillo para "Pocas Precipitaciones"
          } else if (valor <= 1250) {
              colorFondo = '#adff2f'; // Verde claro para "Precipitaciones Normales"
          } else if (valor <= 1750) {
              colorFondo = '#00bfff'; // Azul claro para "Bastantes Precipitaciones"
          } else {
              colorFondo = '#00008b'; // Azul oscuro para "Muchas Precipitaciones"
          }

          // Generar el HTML para el bloque con el color de fondo
          bloquesHTML += `<div class="bloque" style="background-color:${colorFondo};"></div>`;
      }
  }

  // Actualizamos el contenido del contenedor "mapa"
  mapaDiv.innerHTML = bloquesHTML;
}

// Función que actualiza el mapa de precipitaciones en el HTML
function actualizarMapaBiomas() {
  const mapaDiv = document.getElementById('mapa');
  let bloquesHTML = '';

  const biomas = {
    oceano_polar: ["000", "001", "002", "003", "004"],
    oceano_templado: ["010", "011", "012", "013", "014", "020", "021", "022", "023", "024"],
    oceano_tropical: ["030", "031", "032", "033", "034", "040", "041", "042", "043", "044"],
    mar_polar: ["100", "101", "102", "103", "104",
        "200", "201", "202", "203", "204"],
    mar_templado: ["110", "111", "112", "113", "114", 
        "120", "121", "122", "123", "124"],
    mar_tropical: [ "130", "131", "132", "133", "134", 
      "140", "141", "142", "143", "144"],
    costa_templado: ["210", "211", "212", "220", "221", "222"],
    corales: ["213", "214", "223", "224"],
    costa_tropical: ["230", "231", "232", "233", "240", "241", "242", "243"],
    pantano: ["234", "244", "333", "334"],
    zona_muerta: ["300", "340","400", "440", "500","540", "600", ],
    tundra: ["301", "302", "303", "304", "310", "311", "312"],
    playa: ["320", "321", "322", "330", "331", "332", "341", "342", "343"],
    acantilado: ["313", "314", "323", "324"],
    selva: ["344", "433", "434", "443", "444",, "543", "544", "633", "634", "644"], 
    estepa_fria: ["401", "402","410", "411", "412", "501", "502", "510", "511"],
    taiga: ["403", "404","413", "414", "503", "504","512", "513", "514", "614"],
    pradera: ["420", "421", "422", "520", "521"],
    bosque: ["423", "424", "624", "522", "523", "524"],
    desierto: ["430", "441", "530", "531", "541", "542"],
    sabana: ["431", "432", "442", "532", "533", "534"],
    montaña_glaciar: ["601", "602", "603", "604" ],
    montaña_nevada: ["610", "611", "612", "613", "614", "622", "623"],
    montaña: ["620", "621"],
    meseta: ["630", "631", "632", "641", "642", "643"],
    volcan: ["640"],
};

  for (let i = 0; i < vm.mapbio.length; i++) {
      for (let j = 0; j < vm.mapbio[i].length; j++) {
          let biomaID = vm.mapbio[i][j]; // Valor de bioma (por ejemplo, "000", "001", etc.)
          let tipo = '';

          // Encontrar el bioma correspondiente en el diccionario
          for (const [bioma, ids] of Object.entries(biomas)) {
              if (ids.includes(biomaID)) {
                  tipo = bioma; // Asignar el nombre del bioma directamente
                  break; // Salir del bucle una vez que encontramos el bioma
              }
          }

          // Generar el HTML para el bloque con el tipo de bioma
          bloquesHTML += `<div class="bloque ${tipo}"></div>`;
      }
  }

  // Actualizamos el contenido del contenedor "mapa"
  mapaDiv.innerHTML = bloquesHTML;
}



