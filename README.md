# Mapa procedural a pila

Esta es la segunda práctica del grupo Compañia Letal para Lenguajes y Paradigmas de tercer año de Ingeniería Informática UCJC.
#### Compuesto por:
                

+ Nielsen Casado García
+ Vittorio Ferone
+ Javier Langa Subirón
+ Marcos Sánchez Morales
                
----
Se creará un mapa procedural basado en instrucciones de pila, creando un entorno de máquina virtual. Para la creación de este mapa hemos utilizado una técnica de suavizado, la cual consiste en rellenar el mapa de números aleatorios dentro de un intervalo. después de haber rellenado el mapa, se utilizará la técnica de suavizado. Esta consiste en seleccionar un bloque y compararlo con los vecinos, realizando un promedio de todos los valores.

Este proyecto genera mapas procedurales en una cuadrícula de 200x200 bloques, permitiendo seleccionar entre seis tipos diferentes de mapas: mapa desde cero, mapa suavizado, relieve, temperatura, precipitación y biomas. El usuario puede interactuar con la aplicación seleccionando el tipo de mapa a través de un menú desplegable y generándolo con un botón.

Los mapas que serán generados son:
- Mapa 1: Mapa desde 0
- Mapa 2: Mapa de suavizado
- Mapa 3: Maoa de relieve
- Mapa 4: Mapa de temperatura
- Mapa 5: Mapa de precipitación
- Mapa 6: Mapa de biomas

----

Esta práctica utiliza principalmente JavaScript, HTML y CSS.


## Requisitos:
Para ejecutar este proyecto, necesitarás los siguientes requisitos:

- Un servidor local o cualquier servidor HTTP.
- Navegador compatible con HTML5, CSS y JavaScript.
- Tener descargada la carpeta que proporciona todos archivos necesarios para su ejecución (proporcionados en el repositorio).

## Uso:
1. Abre la aplicación en tu navegador.
2. Selecciona el tipo de mapa que deseas generar desde el menú desplegable.
3. Haz clic en el botón "Generar Mapa" para crear el mapa seleccionado.
----
### Descripción de los mapas:
#### Mapa 1: Mapa desde 0

Este mapa 200x200 mostrará de forma aleatoria los 3 elementos principales: agua, tierra y piedra. Se le asignará a cada bloque un valor de -100000 a 10000 y dependiendo de cual sea, se determina su elemento:
- Agua: Valores de -100000 a -1
- Tierra: Valores de 0 a 30000
- Piedra: Valores de 30001 a 100000

#### Mapa 2: Mapa suavizado

Este mapa tomará los datos iniciales de los elementos para poder formar un mapa más estandarizado.
Se realizará el suavizado que consiste en coger cada bloque uno por uno, comparando con sus vecinos para sacar el promedio de todos. Esta técnica se realizará 70 veces para así poder dar resultados más realistas.

Se seguirá usando las mismos elementos (agua, tierra y piedra).

#### Mapa 3: Mapa de relieve

Tras tener un mapa realista, se realizará la profundidad del mapa, en la que determinará por colores, siendo lo más profundo de color azul oscuro y lo más alto de color marrón.

Intervalos de asignación de alturas:
- Azul oscuro: Valor de -100000 a -3501
- Azul claro: Valor de -3500 a -501
- Cian: Valor de -500 a -1
- Verde claro: Valor de 0 a 249
- Verde: Valor de 250 a 1499
- Amarillo: Valor de 1500 a 2999 
- Naranja: Valor de 3000 a 3999
- Rojo: Valor de 4000 a 5499
- Púrpura: Valor de 5500 a 6999
- Marrón: Valor de 7000 a 100000

#### Mapa 4: Mapa de temperatura

Para definir el mapa de temperatura, utilizamos una asignación aleatoria a los bloques, que sería la temperatura en grados Celsius:

Intervalos de los grados de la temperatura:
- Azul oscuro: Temperatura menor a -31 °C
- Azul claro: Temperaturas entre -30°C a -1°C
- Verde: Temperaturas entre 0°C a 24°C
- Amarillo: Temperaturas entre 25°C a 39°C
- Naranja: Temperaturas entre 40°C a 59°C
- Rojo: Temperaturas mayores a 60°C

#### Mapa 5: Mapa de precipitación

Para definir el mapa de temperatura, utilizamos una asignación aleatoria entre (0 a 1750) a los bloques. Los valores superiores a 1750 serían para muchas precipitaciones:

Intervalos para definir la precipitación:
Blanco: Valor menor que 0, pero se quedaría en 0, osea que no llueve
Amarillo: Valores de 0 a 499
Verde claro: Valores de 500 a 1249
Azul claro: Valores de 1250 a 1749
Azul oscuro: Valores 1750 en adelante

#### Mapa 6: Mapa de biomas

Este mapa forma biomas dependiendo de su relieve, temperatura y precipitación.Las asignaciones 3 variables, que se resume en un número de 3 cifras (relieve, temperatura y precipitación)

###### Relieve
- 0 – Agua profunda
- 1 – Agua media
- 2 – Aguas bajas
- 3 – Costa
- 4 – Bajo relieve
- 5 – Casi montañas
- 6 - Montañas

###### Temperatura
- 0 – Gélido
- 1 – Frío
- 2 – Normal
- 3 – Caliente
- 4 – Calor extremo

###### Precipitación
- 0 – Sin precipitaciones
- 1 – Pocas precipitaciones
- 2 – Normal
- 3 – Bastantes precipitaciones
- 4 – Muchas precipitaciones

##### Biomas

Los biomas utilizados y su asignación de claves:

    oceano_polar: ["000", "001", "002", "003", "004"]
    oceano_templado: ["010", "011", "012", "013", "014", "020", "021", "022", "023", "024"]
    oceano_tropical: ["030", "031", "032", "033", "034", "040", "041", "042", "043", "044"]
    mar_polar: ["100", "101", "102", "103", "104", "200", "201", "202", "203", "204"]
    mar_templado: ["110", "111", "112", "113", "114", "120", "121", "122", "123", "124"]
    mar_tropical: ["130", "131", "132", "133", "134", "140", "141", "142", "143", "144"]
    costa_templado: ["210", "211", "212", "220", "221", "222"]
    corales: ["213", "214", "223", "224"]
    costa_tropical: ["230", "231", "232", "233", "240", "241", "242", "243"]
    pantano: ["234", "244", "333", "334"]
    zona_muerta: ["400", "440", "500", "540", "600"]
    tundra: ["300", "301", "302", "303", "304", "310", "311", "312"]
    playa: ["340", "320", "321", "322", "330", "331", "332", "341", "342", "343"]
    acantilado: ["313", "314", "323", "324"]
    selva: ["344", "433", "434", "443", "444", "543", "544", "633", "634", "644"]
    estepa_fria: ["401", "402", "410", "411", "412", "501", "502", "510", "511"]
    taiga: ["403", "404", "413", "414", "503", "504", "512", "513", "514", "614"]
    pradera: ["420", "421", "422", "520", "521"]
    bosque: ["423", "424", "624", "522", "523", "524"]
    desierto: ["430", "441", "530", "531", "541", "542"]
    sabana: ["431", "432", "442", "532", "533", "534"]
    montaña_glaciar: ["601", "602", "603", "604"]
    montaña_nevada: ["611", "612", "613", "614", "622", "623"]
    montaña: ["610", "620", "621"]
    meseta: ["630", "631", "632", "641", "642", "643"]
    volcan: ["640"]

