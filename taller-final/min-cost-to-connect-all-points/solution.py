# 1584. Min Cost to Connect All Points
# https://leetcode.com/problems/min-cost-to-connect-all-points/
# Autor: Ricardo Amortegui Espinosa
# Familia: grafos (árbol de recubrimiento mínimo) - Kruskal con Union-Find
#
# Modelo: grafo completo no dirigido. Vértices = puntos,
# peso de la arista (i, j) = |xi - xj| + |yi - yj| (Manhattan).
# Kruskal: ordenar las aristas de menor a mayor peso y tomar cada una solo si
# une dos componentes distintas; la que cerraría un ciclo se rechaza.
# Se para cuando el árbol tiene n - 1 aristas (todos conectados).
#
# Tiempo:  O(n² log n)  hay n(n-1)/2 aristas y el sort domina
# Espacio: O(n²)        la lista de aristas
# n = len(points)

from typing import List


class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        n = len(points)

        # Todas las aristas del grafo completo: (peso, i, j)
        aristas = []
        for i in range(n):
            x1, y1 = points[i]
            for j in range(i + 1, n):
                x2, y2 = points[j]
                aristas.append((abs(x1 - x2) + abs(y1 - y2), i, j))
        aristas.sort()  # de la más barata a la más cara

        # Union-Find: padre[x] apunta hacia el representante de su componente
        padre = list(range(n))
        rango = [0] * n

        def find(x: int) -> int:
            while padre[x] != x:
                padre[x] = padre[padre[x]]  # compresión de camino
                x = padre[x]
            return x

        def union(a: int, b: int) -> bool:
            ra, rb = find(a), find(b)
            if ra == rb:
                return False  # ya están conectados: la arista cerraría un ciclo
            if rango[ra] < rango[rb]:  # unión por rango
                ra, rb = rb, ra
            padre[rb] = ra
            if rango[ra] == rango[rb]:
                rango[ra] += 1
            return True

        costo = 0
        usadas = 0
        for w, i, j in aristas:
            if union(i, j):
                costo += w
                usadas += 1
                if usadas == n - 1:  # el árbol ya conecta todos los puntos
                    break
        return costo