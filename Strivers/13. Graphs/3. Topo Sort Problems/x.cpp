#include <iostream>
#include <unordered_map>
#include <vector>
#include <queue>
#include <algorithm>

using namespace std;

class Graph
{
public:
    unordered_map<int, vector<int>> a;
    void add(int u, int v)
    {
        a[u].push_back(v);
    }
};

bool kahns(unordered_map<int, vector<int>> a)
{
    vector<int> id(5, 0);
    for (int i = 0; i < 5; i++)
    {
        for (int j : a[i])
            id[j]++;
    }
    queue<int> q;
    for (int i = 0; i < 5; i++)
    {
        if (id[i] == 0)
            q.push(i);
    }
    int count = 0;
    while (!q.empty())
    {
        int x = q.front();
        q.pop();
        count++;
        for (int i : a[x])
        {
            id[i]--;
            if (id[i] == 0)
                q.push(i);
        }
    }
    if (count == 5)
        return true;
    else
        return false;
}

void dfs(int i, unordered_map<int, vector<int>> a, vector<int> &visited, vector<int> &r)
{
    visited[i] = true;
    for (int j : a[i])
    {
        if (!visited[j])
            dfs(j, a, visited, r);
    }
    r.push_back(i);
}

vector<int> toposort(unordered_map<int, vector<int>> a)
{
    vector<int> visited(5, false), r;
    for (int i = 0; i < 5; i++)
    {
        if (!visited[i])
            dfs(i, a, r, visited);
    }
    reverse(r.begin(), r.end());
    return r;
}

bool canFinish(int numCourses, vector<vector<int>> &prerequisites)
{
    unordered_map<int, vector<int>> a;
    vector<int> id(numCourses, 0);
    for (int i = 0; i < prerequisites.size(); i++)
    {
        id[prerequisites[i][0]]++;
        a[prerequisites[i][1]].push_back(prerequisites[i][0]);
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++)
    {
        if (id[i] == 0)
            q.push(i);
    }
    int count = 0;
    while (!q.empty())
    {
        int x = q.front();
        q.pop();
        count++;
        for (int i : a[x])
        {
            id[i]--;
            if (id[i] == 0)
                q.push(i);
        }
    }
    if (count == numCourses)
        return true;
    else
        return false;
}

vector<int> findOrder(int numCourses, vector<vector<int>> &prerequisites)
{
    unordered_map<int, vector<int>> a;
    vector<int> id(numCourses, 0);
    for (auto i : prerequisites)
    {
        id[i[0]]++;
        a[i[1]].push_back(i[0]);
    }
    queue<int> q;
    for (int i = 0; i < numCourses; i++)
        if (id[i] == 0)
            q.push(i);
    vector<int> r;
    while (!q.empty())
    {
        int x = q.front();
        q.pop();
        r.push_back(x);
        for (int i : a[x])
        {
            id[i]--;
            if (id[i] == 0)
                q.push(i);
        }
    }
    if (r.size() != numCourses)
        return {};
    else
        return r;
}

int main()
{
    Graph g;
    g.add(1, 2);
    g.add(2, 4);
    g.add(1, 3);
    g.add(3, 5);
}