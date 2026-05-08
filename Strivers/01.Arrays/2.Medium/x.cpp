#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<int> twoSum(vector<int> &nums, int target)
{
    unordered_map<int, int> a;
    for (int i = 0; i < nums.size(); i++)
    {
        if (a.find(target - nums[i]) != a.end())
            return {i, a[target - nums[i]]};
        a[nums[i]] = i;
    }
    return {};
}

void sortColors(vector<int> &nums)
{
    int low = 0, high = nums.size() - 1, mid = 0;
    while (mid <= high)
    {
        if (nums[mid] == 0)
            swap(nums[mid++], nums[low++]);
        else if (nums[mid] == 1)
            mid++;
        else
            swap(nums[mid++], nums[high--]);
    }
}

int maxSubArray(vector<int> &nums)
{
    int cs = nums[0], ms = nums[0];
    for (int i = 2; i < nums.size(); i++)
    {
        cs += nums[i];
        ms = max(ms, cs);
        if (cs < 0)
            cs = 0;
    }
    return ms;
}

vector<int> rearrangeArray(vector<int> &nums)
{
    int i = 0, j = 1;
    vector<int> r(nums.size());
    for (int k = 0; k < nums.size(); k++)
    {
        if (nums[k] > 0)
        {
            r[i] = nums[k];
            i += 2;
        }
        else
        {
            r[j] = nums[k];
            j += 2;
        }
    }
    return r;
}

void nextPermutation(vector<int> &nums)
{
    int i = nums.size() - 1;
    for (int k = nums.size() - 2; k >= 0; k--)
    {
        if (nums[k] < nums[k + 1])
        {
            i = k;
            break;
        }
    }
    int j = nums.size() - 1;
    for (int k = nums.size() - 1; k >= 0; k--)
    {
        if (nums[k] > nums[i])
        {
            j = k;
            break;
        }
    }
    swap(nums[i], nums[j]);
    reverse(nums.begin() + i + 1, nums.end());
}

vector<int> leaders(vector<int> nums)
{
    vector<int> r;
    int x = nums[nums.size() - 1];
    for (int i = nums.size() - 1; i >= 0; i--)
    {
        if (nums[i] >= x)
        {
            r.push_back(nums[i]);
            x = nums[i];
        }
    }
    reverse(r.begin(), r.end());
    return r;
}

int longestConsecutive(vector<int> &nums)
{
    if (nums.empty())
        return 0;
    sort(nums.begin(), nums.end());
    int count = 1, r = 0;
    for (int i = 1; i < nums.size(); i++)
    {
        if (nums[i] - nums[i - 1] == 1)
            count++;
        else if (nums[i] == nums[i - 1])
            continue;
        else
        {
            r = max(count, r);
            count = 1;
        }
    }
    r = max(count, r);
    return r;
}

const int MARK = 1e9 + 7;

void change(vector<vector<int>> &matrix, int i, int j)
{
    for (int k = 0; k < matrix.size(); k++)
    {
        if (matrix[i][k] != 0)
            matrix[i][k] = MARK;
    }
    for (int k = 0; k < matrix[0].size(); k++)
    {
        if (matrix[k][j] != 0)
            matrix[k][j] = MARK;
    }
}

void setZeroes(vector<vector<int>> &matrix)
{
    int m = matrix.size(), n = matrix[0].size();
    vector<bool> rowMark(m), colMark(n);
    for (int i = 0; i < matrix.size(); i++)
    {
        for (int j = 0; j < matrix[0].size(); j++)
        {
            if (matrix[i][j] == 0)
            {
                rowMark[i] = true;
                colMark[j] = true;
            }
        }
    }
    for (int i = 0; i < matrix.size(); i++)
    {
        for (int j = 0; j < matrix[0].size(); j++)
        {
            if (rowMark[i] == true || colMark[j] == true)
                matrix[i][j] = 0;
        }
    }
}

void rotate(vector<vector<int>> &matrix)
{
    int m = matrix.size(), n = matrix[0].size();
    for (int i = 0; i < m; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    for (auto &a : matrix)
        reverse(a.begin(), a.end());
}

int main()
{
    vector<int> nums = {2, 7, 11, 15};
    vector<int> r = twoSum(nums, 9);
    for (int i : r)
        cout << i << " ";
    cout << endl;
    r = {2, 0, 2, 1, 1, 0};
    sortColors(r);
    for (int i : r)
        cout << i << " ";
    cout << endl;
    nums = {3, 1, -2, -5, 2, -4};
    r = rearrangeArray(nums);
    for (int i : r)
        cout << i << " ";
    cout << endl;
    nums = {1, 3, 2};
    nextPermutation(nums);
    for (int i : nums)
        cout << i << " ";
    cout << endl;
}