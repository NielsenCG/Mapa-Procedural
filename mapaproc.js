class StackVM {
  constructor() {
    this.stack = [];         // La pila donde se almacenan los valores
    this.programCounter = 0; // Puntero de instrucciones
    this.program = [];       // El programa (una lista de instrucciones)
    this.map = Array(200).fill(null).map(() => Array(200).fill(0)); // Matriz 200x200 (mapa) inicializada con ceros
    this.currentRow = 0;     // Controla la fila actual del mapa
    this.currentCol = 0;     // Controla la columna actual del mapa
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
        this.fillMapAndPushNumbers(arg); // Llenar el mapa con 100 números aleatorios y luego hacer POP
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

  // Función para llenar el mapa y empujar 100 números aleatorios a la pila
  fillMapAndPushNumbers(count) {
    const tempStack = []; // Pila temporal para almacenar los números aleatorios

    for (let i = 0; i < count; i++) {
      // Generar un número aleatorio entre -100000 y 100000
      const randomNum = Math.floor(Math.random() * 200001) - 100000;
      
      // Empuja el número a la pila temporal
      this.stack.push(randomNum);

      // Insertar el número en el mapa en la posición actual
      this.map[this.currentRow][this.currentCol] = this.stack[this.stack.length - 1];

      this.stack.pop()

      // Avanzar al siguiente punto del mapa
      this.currentCol++;
      if (this.currentCol >= 200) {
        this.currentCol = 0; // Volver a la primera columna
        this.currentRow++;   // Avanzar a la siguiente fila
      }

      // Si el mapa está lleno, parar
      if (this.currentRow >= 200) {
        console.log("El mapa está lleno.");
        return;
      }
    }


    // Realizar cualquier operación que se necesite con los números en la pila...

    // Limpiar la pila después de las operaciones con los 100 números
    while (tempStack.length > 0) {
      this.stack.pop();
      tempStack.pop(); // Vaciar la pila temporal para asegurarnos de que se eliminen todos los números
    }
  }
}

// Crear una instancia de la máquina virtual
const vm = new StackVM();

// Cargar un programa en la máquina virtual que utiliza FILLRELIEVE
vm.loadProgram([
  ['PUSH', 5],        // Empuja el número 5 en la pila
  ['PUSH', 3],        // Empuja el número 3 en la pila
  ['ADD'],            // Suma los dos valores en la cima de la pila (5 + 3)
  ['FILLRELIEVE', 1000000],    // Empuja 100 números aleatorios entre -100000 y 100000 y los guarda en el mapa
  ['PUSH', 2],        // Empuja el número 2 en la pila
  ['MUL'],            // Multiplica el número en la cima de la pila por 2
  ['PRINT']           // Imprime el resultado
]);

// Ejecutar el programa
vm.run();

// Imprimir el mapa generado por FILLRELIEVE (solo las primeras filas para simplificar)
console.log("Mapa 200x200 de números generados:");
console.table(vm.map); // Imprime solo las primeras 10 filas del mapa

