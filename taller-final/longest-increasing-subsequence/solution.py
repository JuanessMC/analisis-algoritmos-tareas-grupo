class Solution(object):
    def lengthOfLIS(self, nums):
        n = len(nums)
        dp = [1] * n                      # base: cada elemento solo

        for i in range(n):
            for j in range(i):
                if nums[j] < nums[i]:     # estrictamente creciente
                    dp[i] = max(dp[i], dp[j] + 1)

        return max(dp)
