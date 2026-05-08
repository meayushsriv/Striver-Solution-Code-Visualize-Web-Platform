#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int search(vector<int> &nums, int target)
{
    int low = 0, high = nums.size() - 1;
    while (low <= high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target)
            return mid;
        else if (nums[mid] > target)
            high = mid - 1;
        else
            low = mid + 1;
    }
    return -1;
}

int lowerbound(vector<int> nums, int x)
{
    int low = 0, high = nums.size() - 1;
    int r = -1;
    while (low <= high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] <= x)
        {
            r = mid;
            low = mid + 1;
        }
        else
            high = mid - 1;
    }
    return r;
}

int upperbound(vector<int> nums, int x)
{
    int low = 0, high = nums.size() - 1, r = -1;
    while (low <= high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] >= x)
        {
            r = mid;
            high = mid - 1;
        }
        else
            low = mid + 1;
    }
    return r;
}

int searchInsert(vector<int> &nums, int target)
{
    return lower_bound(nums.begin(), nums.end(), target) - nums.begin();
}

bool solve(vector<int> arr, int low, int high)
{
    if (low >= high)
        return true;
    int mid = low + (high - low) / 2;
    if (arr[mid] <= arr[mid + 1] && solve(arr, mid + 1, high) && solve(arr, low, mid))
        return true;
    return false;
}

vector<int> searchRange(vector<int> &nums, int target)
{
    int low = 0, high = nums.size() - 1, right = -1, left = -1;
    while (low <= high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target)
        {
            right = mid;
            low = mid + 1;
        }
        else if (nums[mid] > target)
        {
            high = mid - 1;
        }
        else
            low = mid + 1;
    }
    low = 0, high = nums.size() - 1;
    while (low <= high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target)
        {
            left = mid;
            high = mid - 1;
        }
        else if (nums[mid] > target)
        {
            high = mid - 1;
        }
        else
            low = mid + 1;
    }
    return {left, right};
}

int countOccurrences(vector<int> a, int target)
{
    int x = lower_bound(a.begin(), a.end(), target) - a.begin();
    int y = upper_bound(a.begin(), a.end(), target) - a.begin();
    return y - x;
}

int findPeakElement(vector<int> &nums)
{
    int low = 0, high = nums.size() - 1;
    while (low < high)
    {
        int mid = low + (high - low) / 2;
        if (nums[mid] < nums[mid + 1])
            low = mid + 1;
        else
            high = mid;
    }
    return low;
}

int kthElement(vector<int> a1, vector<int> a2, int k)
{
    int i = 0, j = 0, ans = -1, count = 0;
    while (i < a1.size() && j < a2.size())
    {
        if (a1[i] < a2[j])
            ans = a1[i++];
        else
            ans = a2[j++];
        count++;
        if (count == k)
            return ans;
    }
    while (i < a1.size())
    {
        ans = a1[i++];
        count++;
        if (count == k)
            return ans;
    }
    while (j < a2.size())
    {
        ans = a2[j++];
        count++;
        if (count == k)
            return ans;
    }
    return -1;
}

int main()
{
    vector<int> a = {1, 2, 3, 5, 6, 7};
    cout << search(a, 4) << endl;
    cout << lowerbound(a, 4) << endl;
    cout << upperbound(a, 4) << endl;
    a = {5, 7, 7, 8, 8, 8, 10};
    vector<int> r = searchRange(a, 8);
    for (int i : r)
        cout << i << " ";
    cout << endl;
    cout << countOccurrences(a, 8) << endl;
    if (solve(a, 0, a.size() - 1))
        cout << "true" << endl;
    else
        cout << "false" << endl;
    a = {1, 2, 1, 3, 5, 6, 4};
    cout << findPeakElement(a);
}