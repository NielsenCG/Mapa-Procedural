class StackVM {
  constructor() {
    this.stack = [];         // La pila donde se almacenan los valores
    this.programCounter = 0; // Puntero de instrucciones
    this.program = [];       // El programa (una lista de instrucciones)
    this.map = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
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
        this.fillMapAndPushNumbers(arg); // Llenar el mapa con números aleatorios y luego hacer POP
        break;
      case 'SMOOTH':
        this.smoothMap(arg); // Aplica el suavizado al mapa
        break;
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
  fillMapAndPushNumbers(count) {
    for (let i = 0; i < count; i++) {
      // Generar un número aleatorio entre -100000 y 100000
      const randomNum = Math.floor(Math.random() * 200001) - 100000;
      
      // Empuja el número a la pila
      this.stack.push(randomNum);

      // Insertar el número en el mapa en la posición actual
      this.map[this.currentRow][this.currentCol] = this.stack[this.stack.length - 1];

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
  smoothMap(iterations) {
    const numRows = this.map.length;
    const numCols = this.map[0].length;
  
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
              this.stack.push(this.map[newRow][newCol]);
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
      this.map = newMap;
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
  ['SMOOTH', 70],           // Aplica el suavizado 3 veces
  ['PUSH', 2],             // Empuja el número 2 en la pila
  ['MUL'],                 // Multiplica el número en la cima de la pila por 2
  ['PRINT']                // Imprime el resultado
]);

// Ejecutar el programa
vm.run();

// Opcional: Imprimir el mapa suavizado (por consola)
console.log("Mapa 200x200 de números suavizados:");
console.table(vm.map);

// Esperamos a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function() {
  // Seleccionamos el botón y le agregamos un evento al hacer clic
  document.getElementById('generarMapa').addEventListener('click', function() {
      vm.run(); // Ejecutar el programa VM
      actualizarMapa(); // Función que dibuja el mapa en el HTML
  });

  // Función que actualiza el mapa en el HTML
  function actualizarMapa() {
      const mapaDiv = document.getElementById('mapa');
      let bloquesHTML = '';

      // Definimos las imágenes para los diferentes tipos de terreno
      const AGUA = '../public/assets/agua.png';   // Ruta de la imagen de agua
      const TIERRA = '../public/assets/tierra.png'; // Ruta de la imagen de tierra
      const PIEDRA = '../public/assets/piedra.png'; // Ruta de la imagen de piedra

      for (let i = 0; i < vm.map.length; i++) {
          for (let j = 0; j < vm.map[i].length; j++) {
              let tipo = '';
              let imagenSrc = ''; 

              if (vm.map[i][j] < 0) {
                  tipo = 'agua'; // Valor negativo es agua
                  imagenSrc = AGUA; 
              } else if (vm.map[i][j] <= 3000) {
                  tipo = 'tierra'; // Valor entre 0 y 3000 es tierra
                  imagenSrc = TIERRA;
              } else {
                  tipo = 'piedra'; // Valor mayor que 3000 es piedra
                  imagenSrc = PIEDRA;
              }
              bloquesHTML += `<div class="${tipo}"><img src="${imagenSrc}" alt="${tipo}" class="bloque"></div>`;
          }
      }

      // Actualizamos el contenido del contenedor "mapa"
      mapaDiv.innerHTML = bloquesHTML;
  }
});

