#include <iostream>
#include <vector>

using namespace std;

// Recursion
int fibonacci(int n)
{
    if (n == 0 || n == 1)
        return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

// Memorization
int fibonacci(int n, vector<int> &dp)
{
    if (n == 0 || n == 1)
        return n;
    if (dp[n] != -1)
        return dp[n];
    dp[n] = fibonacci(n - 1, dp) + fibonacci(n - 2, dp);
    return dp[n];
}

// Tabulation
int fibonacci(int n)
{
    vector<int> dp(n + 1);
    dp[0] = 0;
    dp[1] = 1;
    for (int i = 2; i < n; i++)
    {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n - 1];
}

// Space Optimisation
int fibonacci(int n)
{
    int prev1 = 0, prev2 = 1;
    for (int i = 2; i < n; i++)
    {
        prev2 = prev1 + prev2;
        prev1 = prev2;
    }
    return prev2;
}

int main()
{
    vector<int> dp(6, -1);
    cout << fibonacci(5, dp) << endl;
}