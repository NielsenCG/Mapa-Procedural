import random

# Definimos los emojis para los diferentes tipos de terreno
AGUA = '🟦'  # Azul para agua
TIERRA = '🟫'  # Marrón para tierra
PIEDRA = '⬛'  # Negro para piedra

# Definimos los colores para el relieve
def obtener_color_relievo(valor):
    if valor < -3500:
        return '\033[38;5;30m'  # Azul oscuro
    elif valor < -500:
        return '\033[38;5;12m'  # Azul claro
    elif valor < 0:
        return '\033[38;5;14m'  # Cian
    elif valor < 1000:
        return '\033[38;5;10m'  # Verde
    elif valor < 2500:
        return '\033[38;5;11m'  # Amarillo
    elif valor < 4000:
        return '\033[38;5;208m'  # Naranja
    elif valor < 5500:
        return '\033[38;5;196m'  # Rojo
    elif valor < 7000:
        return '\033[38;5;125m'  # Púrpura
    else:
        return '\033[38;5;130m'  # Marrón

# Reseteo de color
RESET = '\033[0m'

# Generamos un mapa vacío de 100x100
def generar_mapa_vacio(tamaño):
    return [[0 for _ in range(tamaño)] for _ in range(tamaño)]

# Inicializamos el mapa con valores aleatorios entre -14000 y 10000
def inicializar_mapa_aleatorio(mapa, tamaño):
    for y in range(tamaño):
        for x in range(tamaño):
            mapa[y][x] = random.randint(-100000, 100000)

# Modificar el mapa sumando o restando un valor fijo
def modificar_mapa(mapa, tamaño, valor_modificacion=500):
    for y in range(tamaño):
        for x in range(tamaño):
            if random.choice([True, False]):
                mapa[y][x] = min(100000, mapa[y][x] + valor_modificacion)  # Sumar
            else:
                mapa[y][x] = max(-100000, mapa[y][x] - valor_modificacion)  # Restar

# Suavizamos el mapa promediando los valores con los de sus vecinos, con bordes esféricos
def suavizar_mapa(mapa, tamaño, iteraciones=1):
    for _ in range(iteraciones):
        nuevo_mapa = generar_mapa_vacio(tamaño)
        for y in range(tamaño):
            for x in range(tamaño):
                # Calculamos el promedio de los vecinos con bordes esféricos
                total = 0
                cuenta = 0
                for dy in [-1, 0, 1]:
                    for dx in [-1, 0, 1]:
                        nx = (x + dx) % tamaño  # Borde esférico (envuelve en X)
                        ny = (y + dy) % tamaño  # Borde esférico (envuelve en Y)
                        total += mapa[ny][nx]
                        cuenta += 1
                nuevo_mapa[y][x] = total / cuenta
        mapa = nuevo_mapa
    return mapa

# Convertimos los valores en tipos de terreno (agua, tierra, piedra)
def asignar_terreno(mapa, tamaño):
    mapa_terreno = []
    for y in range(tamaño):
        fila = []
        for x in range(tamaño):
            if mapa[y][x] < 0:
                fila.append(AGUA)  # Agua
            elif mapa[y][x] < 3000:
                fila.append(TIERRA)  # Tierra
            else:
                fila.append(PIEDRA)  # Piedra
        mapa_terreno.append(fila)
    return mapa_terreno

# Imprimimos el mapa de terreno
def imprimir_mapa_terreno(mapa_terreno):
    for fila in mapa_terreno:
        print("".join(fila))

# Imprimimos el mapa de relieve con colores
def imprimir_mapa_relievo_colores(mapa):
    for fila in mapa:
        for valor in fila:
            color = obtener_color_relievo(valor)
            print(f"{color}█{RESET}", end=' ')  # Imprime un cuadrado de color
        print()  # Nueva línea después de cada fila

# Parámetros del mapa
tamaño_mapa = 200  # Cambiar a 200 para un mapa más grande

# Paso 1: Crear el mapa vacío
mapa = generar_mapa_vacio(tamaño_mapa)

# Paso 2: Inicializar el mapa con valores aleatorios
inicializar_mapa_aleatorio(mapa, tamaño_mapa)

# Paso 3: Modificar el mapa con suma/resta de 500
modificar_mapa(mapa, tamaño_mapa)

# Paso 4: Suavizar el mapa tres veces
mapa = suavizar_mapa(mapa, tamaño_mapa, iteraciones=70)

# Paso 5: Asignar los emojis de terrenos según los valores suavizados
mapa_terreno = asignar_terreno(mapa, tamaño_mapa)

# Paso 6: Imprimir el mapa de terreno
print("Mapa de Terreno:")
imprimir_mapa_terreno(mapa_terreno)

print("\nMapa de Relieve con Colores:")
imprimir_mapa_relievo_colores(mapa)
