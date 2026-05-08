#include <iostream>
#include <unordered_map>
#include <math.h>
#include <vector>
#include <queue>
using namespace std;

int numberCount(int vertices)
{
    int edges = (vertices * (vertices - 1)) / 2;
    return pow(2, edges);
}

unordered_map<int, vector<int>> adjacencyMatrix(vector<vector<int>> graph)
{
    unordered_map<int, vector<int>> a;
    for (auto i : graph)
    {
        a[i[0]].push_back(i[1]);
        a[i[1]].push_back(i[0]);
    }
    for (auto i : a)
    {
        int x = i.first;
        cout << x << " : ";
        for (int j : a[x])
            cout << j << " ";
        cout << endl;
    }
    return a;
}

void BFS(int start, unordered_map<int, vector<int>> a)
{
    queue<int> q;
    q.push(start);
    vector<bool> visited(a.size(), false);
    while (!q.empty())
    {
        int x = q.front();
        visited[x] = true;
        cout << x << " ";
        q.pop();
        for (int i : a[x])
        {
            if (!visited[i])
                q.push(i);
        }
    }
    cout << endl;
}

void dfs(int start, vector<bool> &visited, unordered_map<int, vector<int>> a)
{
    visited[start] = true;
    cout << start << " ";
    for (int i : a[start])
        if (!visited[i])
            dfs(i, visited, a);
}

void DFS(int start, unordered_map<int, vector<int>> a)
{
    vector<bool> visited(a.size(), false);
    for (auto i : a)
    {
        if (!visited[i.first])
            dfs(i.first, visited, a);
    }
}

int main()
{
    vector<vector<int>> graph = {{0, 1}, {0, 2}, {1, 3}, {2, 4}, {3, 5}, {4, 6}};
    unordered_map<int, vector<int>> a = adjacencyMatrix(graph);
    BFS(0, a);
    DFS(0, a);
}