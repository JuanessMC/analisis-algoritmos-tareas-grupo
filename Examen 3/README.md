# 🗺️ Ruta Turística Optimizada con Programación Dinámica

Una aplicación web interactiva que resuelve el Problema del Viajante de Comercio (TSP) usando el algoritmo de Held-Karp con Programación Dinámica y Bitmask DP para encontrar la ruta óptima que visita múltiples lugares de interés en una ciudad.

## 🎯 Objetivo del Proyecto

Demostrar cómo la Programación Dinámica puede reducir dramáticamente la complejidad computacional de problemas NP-hard como el TSP, pasando de O(N!) por fuerza bruta a O(N²·2ᴺ) usando memoización.

## 🚀 Características

- **Interfaz tipo Google Maps** usando Leaflet.js y OpenStreetMap
- **Selección interactiva** de lugares de interés desde una lista predefinida
- **Algoritmo Held-Karp** implementado con Programación Dinámica y Bitmask
- **Distancias reales de conducción** usando OSRM (Open Source Routing Machine)
- **Visualización de rutas reales** que siguen las calles de la ciudad
- **Animación dinámica** de un vehículo recorriendo la ruta óptima
- **Comparación de complejidad** entre fuerza bruta y DP
- **Responsive design** para móvil y escritorio

## 📐 Algoritmo Held-Karp (TSP con Bitmask DP)

### Representación del Estado
- **State**: `(mask, u)` donde:
  - `mask`: Número entero cuya representación binaria indica qué lugares han sido visitados
    - Ejemplo: Para 4 lugares, `mask = 0101₂ = 5₁₀` significa que los lugares 0 y 2 fueron visitados
  - `u`: Lugar actual donde se encuentra el viajero

### Ecuación de Recurrencia
```
DP(mask, u) = min(v ∉ mask) [ dist(u, v) + DP(mask ∪ {v}, v) ]
```

### Caso Base
Cuando todos los lugares han sido visitados (mask == (1 << N) - 1), retornar la distancia desde u hasta el punto de inicio.

### Complejidad
- **Fuerza bruta**: O(N!) - Impráctico para N > 15
- **Held-Karp con memoización**: O(N²·2ᴺ) - Maneja N ≈ 20-25 en la práctica

## 🏗️ Estructura del Proyecto

```
tourist-route-dp/
├── index.html          # Estructura principal
├── style.css           # Estilos visuales
├── script.js           # Lógica del algoritmo y UI
├── places.js           # Base de datos de lugares (La Candelaria, Bogotá)
└── README.md           # Este archivo
```

## 🛠️ Tecnologías Utilizadas

- **HTML5/CSS3/JavaScript Vanilla** - Sin frameworks externos
- **Leaflet.js** - Biblioteca para mapas interactivos
- **OpenStreetMap** - Servicio gratuito de mapas
- **Algoritmo Held-Karp** - Implementación pura de Programación Dinámica

## 📝 Cómo Usarlo

1. **Abrir el mapa**: La aplicación se centra en Medellín, Colombia
2. **Seleccionar lugares**: Marque los lugares que desea visitar desde la barra lateral
3. **Calcular ruta**: Haga clic en "Calcular Ruta Óptima"
4. **Ver resultados**: 
   - Aparecerá la distancia mínima en km
   - Se mostrará la secuencia óptima de visita
   - La ruta se dibujará en el mapa con marcadores numerados
5. **Explorar**: Puede hacer clic en cualquier punto del mapa para agregar marcadores personalizados

## 🎓 Value Educativo

Este proyecto demuestra claramente:
1. **Problema NP-hard real** con aplicaciones prácticas (turismo, logística)
2. **Impacto de la Programación Dinámica**: Reducción exponencial de complejidad
3. **Técnica de memoization**: Almacenamiento de resultados intermedios
4. **Representación compacta de estado**: Uso eficiente de bitmasks
5. **Visualización de resultados**: Hace tangible un concepto abstracto

## 📊 Complejidad Comparativa

| N (lugares) | Fuerza Bruta O(N!) | Held-Karp O(N²·2ᴺ) |
|-------------|-------------------|-------------------|
| 5           | 120 operaciones   | 800 operaciones   |
| 8           | 40,320 operaciones| 16,384 operaciones|
| 10          | 3,628,800 operaciones| 184,320 operaciones|
| 12          | 479M operaciones  | 2M operaciones    |
| 15          | 1.3B operaciones  | 73M operaciones   |

*Note: Los valores son aproximados y muestran la tendencia*

## 🔧 Personalización

Para usar esta aplicación con otras ciudades:
1. Modificar `places.js` con coordenadas de lugares de interés
2. Ajustar el centro inicial del mapa en `script.js`
3. Opcional: Integrar con OSRM para distancias de camino real en lugar de Haversine

## 📚 Referencias

- Held, M., & Karp, R. M. (1962). A dynamic programming approach to sequencing problems. *Journal of the Society for Industrial and Applied Mathematics*, 10(1), 196-210.
- Bellman, R. (1957). Dynamic Programming. Princeton University Press.

## 👨‍💻 Desarrollado para

Análisis de Algoritmos - Entrega sobre Programación Dinámica y su aplicación a problemas reales.
