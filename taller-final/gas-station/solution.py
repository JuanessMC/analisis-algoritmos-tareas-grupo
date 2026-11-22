# 134. Gas Station
# https://leetcode.com/problems/gas-station/
# Autor: Juan Esteban Moreno Cuadros
# Familia: greedy
#
# Si la suma de gas es menor que la suma de cost, no hay vuelta posible: -1.
# Si alcanza, una sola pasada: se suma gas[i] - cost[i] al tanque; cuando el
# tanque queda negativo en i, se descarta todo el tramo desde el inicio
# candidato hasta i, el nuevo candidato es i + 1 y el tanque vuelve a 0.
# No se vuelve atrás: a cada estación del tramo se llegaba con tanque >= 0,
# así que empezar ahí con tanque 0 es igual o peor y tampoco pasaría de i.
#
# Tiempo:  Θ(n)   n = len(gas)
# Espacio: Θ(1) extra
 
from typing import List
 
 
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if sum(gas) < sum(cost):
            return -1  # no alcanza el combustible para dar la vuelta
 
        inicio = 0  # estación candidata para salir
        tanque = 0  # combustible acumulado desde 'inicio'
        for i in range(len(gas)):
            tanque += gas[i] - cost[i]
            if tanque < 0:
                # Desde 'inicio' no se llega a i + 1: se descarta el tramo
                inicio = i + 1
                tanque = 0
 
        return inicio
