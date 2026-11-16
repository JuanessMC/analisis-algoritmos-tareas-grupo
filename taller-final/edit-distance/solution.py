class Solution(object):
    def minDistance(self, word1, word2):
        n, m = len(word1), len(word2)
        dp = [[0] * (m + 1) for _ in range(n + 1)]

        for i in range(n + 1):
            dp[i][0] = i          # borrar i letras
        for j in range(m + 1):
            dp[0][j] = j          # insertar j letras

        for i in range(1, n + 1):
            for j in range(1, m + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],      # borrar
                        dp[i][j - 1],      # insertar
                        dp[i - 1][j - 1],  # sustituir
                    )
        return dp[n][m]
