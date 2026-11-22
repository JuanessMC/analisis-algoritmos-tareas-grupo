# 79. Word Search
# https://leetcode.com/problems/word-search/
# Autor: Juan Esteban Moreno Cuadros
# Familia: backtracking
#
# Estado: (fila, columna, k) = celda actual e índice de la letra de word que toca.
# Elegir: una celda vecina (arriba, abajo, izquierda, derecha) que tenga word[k].
# Marcar la celda con '#' para no usarla dos veces en el mismo camino, bajar con
# k + 1 y, al volver, deshacer: devolverle su letra para que otro camino la use.
# La diagonal no es vecina.
#
# Poda antes de buscar: si word pide una letra más veces de las que hay en la
# grilla, no puede estar. Y si la última letra es más rara que la primera, se
# busca la palabra al revés (es la misma respuesta y se abren menos ramas).
#
# Tiempo:  O(m · n · 4^L)  m × n = grilla, L = len(word)
# Espacio: O(L)            profundidad de la pila de recursión
 
from collections import Counter
from typing import List
 
 
class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        filas, cols = len(board), len(board[0])
 
        # Poda: si falta alguna letra en la grilla, la palabra no puede estar
        en_grilla = Counter(letra for fila in board for letra in fila)
        en_palabra = Counter(word)
        for letra, veces in en_palabra.items():
            if en_grilla[letra] < veces:
                return False
        if en_grilla[word[0]] > en_grilla[word[-1]]:
            word = word[::-1]  # empezar por la letra más rara
 
        def buscar(f: int, c: int, k: int) -> bool:
            if k == len(word):
                return True  # se completó la palabra
            if f < 0 or f >= filas or c < 0 or c >= cols or board[f][c] != word[k]:
                return False  # fuera de la grilla, ya usada o letra distinta
 
            letra = board[f][c]
            board[f][c] = "#"  # elegir: marcar la celda como usada
 
            encontrado = (
                buscar(f + 1, c, k + 1)
                or buscar(f - 1, c, k + 1)
                or buscar(f, c + 1, k + 1)
                or buscar(f, c - 1, k + 1)
            )
 
            board[f][c] = letra  # deshacer: quitar la marca al volver
            return encontrado
 
        for f in range(filas):
            for c in range(cols):
                if buscar(f, c, 0):
                    return True
        return False
