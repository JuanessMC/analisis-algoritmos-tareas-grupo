# Taller final · Análisis de algoritmos · ITM 2026-2

## Autoría

| Integrante | Usuario de git | Ejercicios |
| --- | --- | --- |
| … | … | … |
| Jalvi Humberto Villegas Taborda | `JVillegasT` | 215,179 |
|Ricardo Amortegui Espinosa | `RicardoAmortegui` | 743, 1584 |
| David Prada Quintero | `DavidP03` | 72, 300 |
| … | … | … |

## 72. Edit Distance

Enlace: https://leetcode.com/problems/edit-distance/  
Autor: David Prada Quintero (DavidP03)  
Código: [edit-distance/solution.py](edit-distance/solution.py)  
Familia: programación dinámica  
Idea: estado `dp[i][j]` = número mínimo de ediciones para convertir `word1[0..i)` en `word2[0..j)`. Base: `dp[i][0] = i` (borrar `i` letras) y `dp[0][j] = j` (insertar `j` letras). Recurrencia: si `word1[i-1] == word2[j-1]`, `dp[i][j] = dp[i-1][j-1]`; si no, `dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])` (borrar, insertar, sustituir). La respuesta es `dp[n][m]`.  
Complejidad: tiempo `Θ(n·m)` y espacio `Θ(n·m)`, con `n = word1.length` y `m = word2.length`.

![Accepted — Edit Distance](Evidencias/edit-distance.png)

## 300. Longest Increasing Subsequence

Enlace: https://leetcode.com/problems/longest-increasing-subsequence/  
Autor: David Prada Quintero (DavidP03)  
Código: [longest-increasing-subsequence/solution.py](longest-increasing-subsequence/solution.py)  
Familia: programación dinámica  
Idea: estado `dp[i]` = longitud de la subsecuencia estrictamente creciente más larga que termina en el índice `i`. Base: `dp[i] = 1` (el elemento solo). Recurrencia: `dp[i] = max(dp[i], dp[j] + 1)` para todo `j < i` con `nums[j] < nums[i]`. La respuesta es `max(dp)`, porque la LIS puede no terminar en el último elemento.  
Complejidad: tiempo `Θ(n²)` y espacio `Θ(n)`, con `n = nums.length`.

![Accepted — Longest Increasing Subsequence](Evidencias/longest-increasing-subsequence.png)

## 215. kth-largest-element-in-an-array
Enlace: https://leetcode.com/problems/kth-largest-element-in-an-array/description/

Autor: Jalvi Villegas (JVillegasT)

Código:[kth-largest/heap.py](kth-largest/heap.py)   


Familia: montículos / colas de prioridad (Heaps)

Idea: Usar un min-heap de tamaño $k$ para almacenar los elementos más grandes encontrados. Se inicializa el heap con los primeros $k$ elementos del arreglo y se recorre el resto; si un elemento es mayor que la raíz del heap (`min_heap[0]`), se reemplaza usando `heappushpop`. Al finalizar, la raíz del heap contiene el k-ésimo elemento más grande sin necesidad de ordenar todo el arreglo.

Complejidad: tiempo $O(N \log k)$ y espacio $O(k)$, con $N = \text{nums.length}$.

![Accepted — kth-largest](Evidencias/kth-largest-accepted.png)


##   179. Largest Number
Enlace: https://leetcode.com/problems/largest-number/description/

Autor: Jalvi Villegas (JVillegasT)

Código:[ largest-number/clave_de_ordenamiento.py]( largest-number/clave_de_ordenamiento.py)   

Familia: ordenamiento personalizado (Sorting / Custom Comparator)

Idea: Convertir todos los números enteros a cadenas de texto y ordenarlos mediante un comparador personalizado basado en la concatenación (`a + b` vs `b + a`). Si la combinación de `a` seguido de `b` es mayor, `a` tiene mayor prioridad. Se utiliza `functools.cmp_to_key` para aplicar este orden y finalmente se unen las cadenas, manejando el caso especial donde el resultado es solo ceros.

Complejidad: tiempo $O(N \log N \cdot L)$ y espacio $O(N \cdot L)$, con $N = \text{nums.length}$ y $L$ la longitud promedio de las cadenas.


![Accepted — Largest Number](Evidencias/Largest_Number.png)

## 743. Network Delay Time

Enlace: https://leetcode.com/problems/network-delay-time/

Autor: Ricardo Amortegui Espinosa (`RicardoAmortegui`)

Código: [network-delay-time/solution.py](network-delay-time/solution.py)

Familia: grafos (Dijkstra)

Idea: grafo dirigido y ponderado (arco `u → v` con peso `w ≥ 0`). Dijkstra desde `k` con un min-heap de (distancia tentativa, nodo): se fija el nodo más cercano y se relajan sus arcos. La respuesta es la mayor distancia final, porque hay que esperar al nodo que más tarda; si alguno queda en infinito, se devuelve `-1`.

Complejidad: tiempo `O((n + m) log n)` y espacio `O(n + m)`, con `n` nodos y `m = times.length`.

![Accepted — Network Delay Time](Evidencias/network-delay-time-accepted.png)

## 1584. Min Cost to Connect All Points

Enlace: https://leetcode.com/problems/min-cost-to-connect-all-points/

Autor: Ricardo Amortegui Espinosa (`RicardoAmortegui`)

Código: [min-cost-to-connect-all-points/solution.py](min-cost-to-connect-all-points/solution.py)

Familia: grafos (árbol de recubrimiento mínimo), Kruskal

Idea: grafo completo no dirigido; vértices = puntos, peso = distancia de Manhattan. Se ordenan las `n(n−1)/2` aristas de menor a mayor y se toma cada una solo si une componentes distintas (Union-Find con compresión de camino y unión por rango); la que cerraría un ciclo se rechaza. Se para al tener `n − 1` aristas.

Complejidad: tiempo `O(n² log n)` (domina el sort de las Θ(n²) aristas) y espacio `O(n²)`, con `n = points.length`.

![Accepted — Min Cost to Connect All Points](Evidencias/min-cost-to-connect-all-points-accepted.png)
