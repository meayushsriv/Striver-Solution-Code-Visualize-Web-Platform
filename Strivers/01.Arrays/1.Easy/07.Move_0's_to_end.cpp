/*
QUESTION:-
Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

Note that you must do this in-place without making a copy of the array.

Example 1:

Input: nums = [0,1,0,3,12]
Output: [1,3,12,0,0]
Example 2:

Input: nums = [0]
Output: [0]
*/

/*
APPROACH:-
-> The idea is while traversing the array forward each non-zero and then put zeros in end
*/

// CODE:-

#include <iostream>
#include <vector>
using namespace std;

void moveZeroes(vector<int> &nums)
{
    int a = 0;
    for (int i = 0; i < nums.size(); i++)
        if (nums[i] != 0)
            nums[a++] = nums[i];
    while (a < nums.size())
        nums[a++] = 0;
}

// TIME COMPLEXITY = O(N) (as we moving j throught the array only once)
// SPACE COMPLEXITY = O(0)