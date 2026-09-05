# Selección de actividades — Sala 4B

## Integrantes

- DAVID PRADA QUINTERO
- RICARDO AMORTEGUI ESPINOSA
- JALVI HUMBERTO VILLEGAS TABORDA
- JUAN ESTEBAN MORENO CUADROS

 ## Integrantes
 link:

## Descripción del problema

La Sala 4B recibe varias solicitudes de reuniones. Cada solicitud tiene una hora de inicio y una hora de finalización. Debido a que solo hay una sala disponible, no es posible aceptar dos reuniones que se crucen en el tiempo.

El objetivo es seleccionar la mayor cantidad posible de reuniones compatibles, es decir, que no se superpongan entre sí.

## Solución propuesta

Se desarrolló una aplicación web que simula la selección de reuniones para la Sala 4B. La aplicación genera ocho solicitudes de reserva, las organiza y evalúa cuáles pueden realizarse sin producir cruces de horario.

La solución permite visualizar el proceso paso a paso, de forma automática o manual, e informa cuáles solicitudes fueron aceptadas y cuáles fueron rechazadas.

## Algoritmo utilizado

Se utilizó un algoritmo voraz de selección de actividades.

El algoritmo sigue estos pasos:

1. Ordenar las reuniones por hora de finalización, de menor a mayor.
2. Aceptar la primera reunión.
3. Evaluar las reuniones restantes en el mismo orden.
4. Aceptar una reunión si su hora de inicio es mayor o igual a la hora de finalización de la última reunión aceptada.
5. Rechazar una reunión si se cruza con una reunión previamente aceptada.

Este algoritmo permite obtener la máxima cantidad de reuniones que pueden realizarse en la sala sin conflictos de horario.

### Complejidad del algoritmo

- Ordenamiento de las reuniones: `O(n log n)`
- Recorrido y selección de reuniones: `O(n)`
- Complejidad total: `O(n log n)`

## Implementación

El proyecto fue implementado con HTML, CSS y JavaScript.

- `index.html`: contiene la estructura de la interfaz, los botones, el tablero, los indicadores y la bitácora.
- `styles.css`: contiene los estilos, el diseño responsivo y mejoras de accesibilidad.
- `script.js`: genera las reuniones, las ordena por hora de finalización y aplica el algoritmo voraz.

La aplicación permite:

- Avanzar una reunión a la vez.
- Reproducir y pausar la simulación.
- Reiniciar el mismo caso.
- Generar un nuevo conjunto de reuniones.
- Ver las reuniones aceptadas y rechazadas.
- Consultar una bitácora con cada decisión tomada.

## Resultados obtenidos

La aplicación selecciona un conjunto de reuniones compatibles sin cruces de horario. Las solicitudes se evalúan en orden de finalización y cada decisión queda registrada en la bitácora.

El resultado muestra:

- Número de solicitudes evaluadas.
- Número de reuniones aceptadas.
- Número de reuniones rechazadas por cruce.
- Hora en la que la sala queda disponible después de cada reunión aceptada.

Al generar un nuevo caso, el resultado puede cambiar porque los horarios de las solicitudes se crean de forma aleatoria.



