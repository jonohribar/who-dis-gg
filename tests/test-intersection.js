// Basic test for shared-game intersection logic (whodis_gg-d70)
// Uses Node assert module (no external dependencies needed)

const assert = require('assert');

// Minimal mock: test that we can create sets and find intersections
function findSharedMatches(matchesA, matchesB) {
    const setB = new Set(matchesB);
    return matchesA.filter(id => setB.has(id));
}

// Test 1: Basic intersection
const A = ['NA1_001', 'NA1_002', 'NA1_003'];
const B = ['NA1_002', 'NA1_003', 'NA1_004'];
const shared = findSharedMatches(A, B);
assert.deepStrictEqual(shared.sort(), ['NA1_002', 'NA1_003']);

// Test 2: No shared matches
const C = ['NA1_100'];
const D = ['NA1_200'];
assert.deepStrictEqual(findSharedMatches(C, D), []);

console.log('All basic tests passed.');
