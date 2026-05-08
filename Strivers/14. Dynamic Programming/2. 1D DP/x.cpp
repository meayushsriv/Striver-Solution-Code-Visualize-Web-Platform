#include <iostream>
#include <vector>
#include <climits>
using namespace std;

int frogJump(int n, vector<int> &h)
{
    if (n == 0)
        return 0;
    int s1 = INT_MAX, s2 = INT_MAX;
    if (n - 1 >= 0)
        s1 = frogJump(n - 1, h) + (abs(h[n] - h[n - 1]));
    if (n - 2 >= 0)
        s2 = frogJump(n - 2, h) + (abs(h[n] - h[n - 2]));
    return min(s1, s2);
}

int frogJump(int n, vector<int> &h, vector<int> &dp)
{

    if (n == 0)
        return 0;
    if (dp[n] != -1)
        return dp[n];
    int s1 = INT_MAX, s2 = INT_MAX;
    if (n - 1 >= 0)
        dp[n] = frogJump(n - 1, h) + (abs(h[n] - h[n - 1]));
    if (n - 2 >= 0)
        dp[n] = frogJump(n - 2, h) + (abs(h[n] - h[n - 2]));
    return min(s1, s2);
}

int main()
{
    vector<int> height = {0, 1, 2, 3, 4, 5, 6};
    cout << frogJump(5, height) << endl;
}