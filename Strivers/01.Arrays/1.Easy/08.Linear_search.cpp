/*
I don't think anyone needs it's solution. The idea is to traverse the array using loop and when the element
is equal to k return the same
*/

#include <iostream>
#include <vector>
using namespace std;

int linearSearch(vector<int> a, int k)
{
    for (int i = 0; i < a.size(); i++)
        if (a[i] == k)
            return k;
    return -1;
}