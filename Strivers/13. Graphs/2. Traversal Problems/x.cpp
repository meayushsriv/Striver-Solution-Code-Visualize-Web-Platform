#include <iostream>
#include <unordered_map>
#include <math.h>
#include <vector>
#include <queue>
using namespace std;

int findCircleNum(vector<vector<int>> &graph)
{
    unordered_map<int, vector<int>> a;
    int m = graph.size(), n = graph[0].size();
    for (int i = 0; i < graph.size(); i++)
    {
        for (int j = 0; j < graph[i].size(); j++)
        {
            if (graph[i][j] == 1)
                a[i].push_back(j);
        }
    }
    int count = 0;
    queue<pair<int, int>> q;
    vector<pair<int, int>> d = {{1, 0}, {0, 1}, {-1, 0}, {0, -1}};
    vector<vector<bool>> visited(m, vector<bool>(n, false));
    for (auto i : a)
    {
        for (int j : i.second)
        {
            int x = i.first, y = j;
            if (!visited[x][y])
            {
                while (!q.empty())
                {
                    auto [x, y] = q.front();
                    q.pop();
                    visited[x][y] = true;
                    for (auto [dx, dy] : d)
                    {
                        int nx = x + dx, ny = y + dy;
                        if (nx >= 0 && nx < m && ny >= 0 && ny < n)
                            q.push({nx, ny});
                    }
                }
                count++;
            }
        }
    }
    return count;
}

int orangesRotting(vector<vector<int>> &grid)
{
    int fresh = 0;
    queue<pair<int, int>> q;
    int m = grid.size();
    int n = grid[0].size();
    for (int i = 0; i < grid.size(); i++)
    {
        for (int j = 0; j < grid[0].size(); j++)
        {
            if (grid[i][j] == 2)
                q.push({i, j});
            if (grid[i][j] == 1)
                fresh++;
        }
    }
    if (fresh == 0)
        return 0;
    int time = 0;
    vector<pair<int, int>> d = {{0, 1}, {1, 0}, {-1, 0}, {0, -1}};
    while (!q.empty())
    {
        int k = q.size();
        while (k--)
        {
            auto [x, y] = q.front();
            q.pop();
            for (auto [dx, dy] : d)
            {
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && nx < m && ny >= 0 && ny < n && grid[nx][ny] == 1)
                {
                    grid[nx][ny] = 2;
                    q.push({nx, ny});
                    fresh--;
                }
            }
        }
        time++;
    }
    return (fresh > 0) ? -1 : time;
}



int main()
{
    vector<vector<int>> graph = {{0, 1}, {0, 2}, {1, 3}, {2, 4}, {3, 5}, {4, 6}};
    cout << findCircleNum(graph) << endl;
}
