class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        minimo_heap = nums[:k]
        heapq.heapify(minimo_heap)
        
        for numero in nums[k:]:
            if numero > minimo_heap[0]:
                heapq.heappushpop(minimo_heap, numero)
                
        return minimo_heap[0]
