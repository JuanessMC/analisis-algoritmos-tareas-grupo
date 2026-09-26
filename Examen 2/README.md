# Rutas óptimas entre aeropuertos 

Examen 2 – Análisis de Algoritmos

# Integrantes

- DAVID PRADA QUINTERO
- RICARDO AMORTEGUI ESPINOSA
- JALVI HUMBERTO VILLEGAS TABORDA
- JUAN ESTEBAN MORENO CUADROS


# Video de sustentación:

https://correoitmedu-my.sharepoint.com/:v:/g/personal/davidprada318624_correo_itm_edu_co/IQDdHHCoMT5uTKa_Wh83QDIBAXikizkoICGin08-DRCGBqw?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=4R2JnC

# Problema

Una aerolínea de carga debe enviar medicamentos de Ciudad de México (A) a Buenos Aires (F). Por norma sanitaria, la carga debe pasar por el hub de Bogotá (C) para inspección. ¿Qué ruta entre los aeropuertos disponibles recorre la menor distancia total?

# Solución

Se modela la red de vuelos como un grafo no dirigido y ponderado y se aplica el algoritmo de Dijkstra. Como la escala en C es obligatoria, el problema se divide en dos tramos: la mejor ruta de A a C y la mejor ruta de C a F, que luego se unen.

Con la aplicación web se puede:

* Ver el grafo sobre un mapa de América, con los kilómetros de cada vuelo.
* Arrastrar los aeropuertos: las distancias y la ruta óptima se recalculan al instante.
* Elegir origen, escala obligatoria y destino.
* Ver a un avión recorrer la ruta calculada.
* Ver el avión volar y, en tiempo real, hacia qué aeropuerto va, cuántos km tiene el tramo y cuántos faltan (panel *Dijkstra paso a paso*: cada paso es una arista de la ruta elegida).

# El grafo

|Elemento|En el problema|
|-|-|
|Nodo (vértice)|Un aeropuerto: A MEX, B HAV, C BOG, D LIM, E SCL, F EZE, G GRU|
|Arista|Un vuelo directo entre dos aeropuertos (12 aristas)|
|Peso|Distancia del vuelo en km|

Las distancias se calculan a partir de la posición de los puntos en el mapa (1 píxel ≈ 15 km), por eso son aproximadas y cambian cuando se mueven los aeropuertos.

# Resultados (configuración inicial)

|Tramo|Ruta|Distancia|
|-|-|-|
|A → C|A → C|3.219 km|
|C → F|C → F|4.714 km|
|Total con escala en C||7.933 km|
|Directa A → F (sin escala)|A → D → F|7.521 km|

La escala obligatoria en Bogotá agrega 412 km (5.5 %) respecto a la mejor ruta directa.
