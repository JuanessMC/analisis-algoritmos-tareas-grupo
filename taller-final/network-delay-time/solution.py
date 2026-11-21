# 743. Network Delay Time
# https://leetcode.com/problems/network-delay-time/
# Autor: Ricardo Amortegui Espinosa
# Familia: grafos (Dijkstra)
#
# Modelo: grafo dirigido y ponderado. Arco u -> v con peso w (tiempo, w >= 0).
# Dijkstra desde k con un min-heap de (distancia tentativa, nodo).
# Respuesta: la mayor distancia final (hay que esperar al nodo que más tarda);
# si algún nodo quedó en infinito, no es alcanzable y se devuelve -1.
#
# Tiempo:  O((n + m) log n)   n = nodos, m = len(times)
# Espacio: O(n + m)

import heapq
from typing import List


class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        # Lista de adyacencia: grafo[u] = [(v, w), ...]  (nodos numerados 1..n)
        grafo = [[] for _ in range(n + 1)]
        for u, v, w in times:
            grafo[u].append((v, w))

        INF = float("inf")
        dist = [INF] * (n + 1)
        dist[k] = 0
        heap = [(0, k)]  # (distancia tentativa, nodo)

        while heap:
            d, u = heapq.heappop(heap)  # el no fijado más cercano a k
            if d > dist[u]:
                continue  # entrada vieja: u ya se fijó con una distancia menor
            for v, w in grafo[u]:
                nueva = d + w
                if nueva < dist[v]:  # relajación del arco u -> v
                    dist[v] = nueva
                    heapq.heappush(heap, (nueva, v))

        mayor = max(dist[1:])
        return -1 if mayor == INF else mayor