#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>
#include <unordered_map>
using namespace std;

int largestElement(vector<int> a)
{
    int r = INT_MIN;
    for (int i : a)
        r = max(r, i);
    return r;
}

int sle(vector<int> a)
{
    int gr = a[0], sgr = INT_MIN;
    for (int i = 0; i < a.size(); i++)
    {
        if (a[i] > gr)
        {
            sgr = gr;
            gr = a[i];
        }
        if (a[i] > sgr && a[i] != gr)
            sgr = a[i];
    }
    return sgr;
}

bool check(vector<int> a)
{
    int count = 0;
    for (int i = 0; i < a.size() - 1; i++)
    {
        if (a[i] > a[i + 1])
            count++;
    }
    return count == 1 || count == 0;
}

vector<int> remove(vector<int> a)
{
    vector<int> r;
    r.push_back(a[0]);
    for (int i = 1; i < a.size(); i++)
    {
        if (a[i] != r.back())
            r.push_back(a[i]);
    }
    return r;
}

vector<int> rotate(vector<int> a)
{
    int temp = a[0];
    for (int i = 0; i < a.size() - 1; i++)
    {
        a[i] = a[i + 1];
    }
    a[a.size() - 1] = temp;
}

// void rotateleftK(vector<int> a, int k)
// {
//     reverse(a, a + k);
//     reverse(a + k, a + n);
//     reverse(a, a + n);
// }

// void rotaterightK(vector<int> a, int k)
// {
//     reverse(a, a + (n - k));
//     reverse(a + (n - k), a + n);
//     reverse(a, a + n);
// }

void moveZeros(vector<int> &a)
{
    int j = 0;
    for (int i = 0; i < a.size(); i++)
    {
        if (a[i] != 0)
            a[j++] = a[i];
    }
    while (j < a.size())
        a[j++] = 0;
}

int linearSearch(vector<int> a, int k)
{
    for (int i = 0; i < a.size(); i++)
    {
        if (a[i] == k)
            return i;
    }
    return -1;
}

vector<int> unionof(vector<int> a, vector<int> b)
{
}

int missing(vector<int> a)
{
    int n = a.size(), sum = 0;
    int total = (n * (n + 1)) / 2;
    for (int i : a)
        sum += i;
    return total - sum;
}

int maxones(vector<int> a)
{
    int count = 0, r = 0;
    for (int i = 0; i < a.size(); i++)
    {
        count = 0;
        if (a[i] == 1)
        {
            while (a[i] == 1 && i < a.size())
            {
                count++;
                i++;
            }
        }
        r = max(r, count);
    }
    return r;
}

int longest(vector<int> a, int sum)
{
    int r = 0, res = 0;
    unordered_map<int, int> x;
    for (int i = 0; i < a.size(); i++)
    {
        if (x.find(sum) != x.end())
            res = max(res, i - x[sum]);
        r += a[i];
        x[r] = i;
    }
    return res;
}

int once(vector<int> a)
{
    int ans = 0;
    for (int i = 0; i < a.size(); i++)
    {
        ans = ans ^ a[i];
    }
    return ans;
}

int main()
{
    vector<int> a = {1, 4, 2, 4, 7, 6, 6, 7};
    cout << largestElement(a) << endl;
    cout << sle(a) << endl;
    cout << check(a);
    a = {1, 2, 1, 1, 4, 5, 1, 1, 1, 7};
    cout << maxones(a);
}