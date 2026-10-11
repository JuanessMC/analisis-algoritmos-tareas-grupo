# Rutas turísticas óptimas mediante Programación Dinámica

**Examen 3 – Análisis de Algoritmos**

# Integrantes

- DAVID PRADA QUINTERO
- RICARDO AMORTEGUI ESPINOSA
- JALVI HUMBERTO VILLEGAS TABORDA
- JUAN ESTEBAN MORENO CUADROS

<br>
<br>
<br>

# Video de sustentación

https://correoitmedu-my.sharepoint.com/:v:/g/personal/ricardoamortegui323267_correo_itm_edu_co/IQDwjMNr36zCS5_CJLyy3gX0AZps-uGhTOuoYLTYr56PvmQ?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D&e=2KmrVz

# Problema

Un turista desea visitar varios lugares de interés de la ciudad de Medellín recorriendo la menor distancia posible.

El recorrido debe comenzar en un punto de origen, visitar una sola vez cada uno de los lugares seleccionados y, finalmente, regresar al punto inicial.

Este problema corresponde al **Problema del Viajante de Comercio**, conocido como **Traveling Salesman Problem (TSP)**, uno de los problemas clásicos de optimización combinatoria.

La pregunta que se desea responder es:

**¿Cuál es la ruta de menor distancia que permite visitar todos los lugares turísticos seleccionados y regresar al punto de origen?**

# Solución

Los lugares turísticos se modelan como un grafo completo, no dirigido y ponderado.

Cada lugar representa un nodo del grafo. Las conexiones entre los lugares representan las aristas y sus pesos corresponden a las distancias de conducción en kilómetros.

Para encontrar el recorrido de menor distancia se utiliza el algoritmo de **Held-Karp**, una solución basada en **Programación Dinámica** y máscaras de bits, también conocidas como *bitmasks*.

El algoritmo almacena los resultados de los subproblemas calculados previamente. De esta manera, evita repetir operaciones y reduce la complejidad respecto a una solución por fuerza bruta.

Con la aplicación web se puede:

* Visualizar los lugares turísticos sobre un mapa interactivo.
* Seleccionar los lugares que se desean visitar.
* Elegir el punto de inicio del recorrido.
* Calcular la ruta óptima automáticamente.
* Visualizar la ruta utilizando caminos reales de la ciudad.
* Consultar la distancia total del recorrido.
* Ver el orden en el que deben visitarse los lugares.
* Observar un vehículo recorriendo la ruta calculada.
* Agregar puntos personalizados haciendo clic sobre el mapa.
* Comparar la complejidad de la fuerza bruta con la del algoritmo Held-Karp.

# El grafo

| Elemento | En el problema |
|---|---|
| Nodo o vértice | Un lugar turístico |
| Arista | Una conexión entre dos lugares |
| Peso | Distancia de conducción entre dos lugares, medida en kilómetros |
| Grafo completo | Cada lugar puede conectarse con todos los demás |
| Ciclo hamiltoniano | Recorrido que visita cada lugar una vez y regresa al origen |
| Solución óptima | Ciclo con la menor distancia total |

Las distancias se obtienen mediante rutas de conducción. Por esta razón, la distancia entre dos lugares corresponde al recorrido por las calles y no únicamente a la distancia en línea recta.

# Algoritmo Held-Karp

El algoritmo Held-Karp resuelve el TSP utilizando Programación Dinámica.

En lugar de evaluar todas las permutaciones posibles de los lugares, divide el problema en subproblemas más pequeños y almacena sus resultados para reutilizarlos posteriormente.

