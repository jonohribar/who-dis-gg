// Test for shared-game intersection logic
// Run with: node tests/intersection.test.js

function findIntersection(arrA, arrB) {
    const setB = new Set(arrB);
    return arrA.filter(id => setB.has(id));
}

// Test 1: Basic intersection
function testBasicIntersection() {
    const matchesA = ['NA1_1', 'NA1_2', 'NA1_3', 'NA1_4'];
    const matchesB = ['NA1_3', 'NA1_4', 'NA1_5', 'NA1_6'];
    const result = findIntersection(matchesA, matchesB);
    const expected = ['NA1_3', 'NA1_4'];
    if (JSON.stringify(result) !== JSON.stringify(expected)) {
        throw new Error(`testBasicIntersection failed: expected ${JSON.stringify(expected)}, got ${JSON.stringify(result)}`);
    }
    console.log('✓ testBasicIntersection passed');
}

// Test 2: No intersection
function testNoIntersection() {
    const matchesA = ['NA1_1', 'NA1_2'];
    const matchesB = ['EUW1_3', 'EUW1_4'];
    const result = findIntersection(matchesA, matchesB);
    if (result.length !== 0) {
        throw new Error(`testNoIntersection failed: expected [], got ${JSON.stringify(result)}`);
    }
    console.log('✓ testNoIntersection passed');
}

// Test 3: Empty arrays
function testEmptyArrays() {
    const result1 = findIntersection([], ['NA1_1']);
    const result2 = findIntersection(['NA1_1'], []);
    const result3 = findIntersection([], []);
    if (result1.length !== 0 || result2.length !== 0 || result3.length !== 0) {
        throw new Error(`testEmptyArrays failed`);
    }
    console.log('✓ testEmptyArrays passed');
}

// Test 4: Duplicate handling (match IDs should be unique per player)
function testDuplicates() {
    const matchesA = ['NA1_1', 'NA1_2', 'NA1_2']; // duplicate
    const matchesB = ['NA1_2', 'NA1_3'];
    const result = findIntersection(matchesA, matchesB);
    // Should include duplicate from A if present in B
    if (result.length !== 2 || result[0] !== 'NA1_2' || result[1] !== 'NA1_2') {
        throw new Error(`testDuplicates failed: expected ['NA1_2','NA1_2'], got ${JSON.stringify(result)}`);
    }
    console.log('✓ testDuplicates passed');
}

// Test 5: Preserves order from first array
function testOrderPreserved() {
    const matchesA = ['NA1_3', 'NA1_1', 'NA1_2'];
    const matchesB = ['NA1_1', 'NA1_2', 'NA1_3'];
    const result = findIntersection(matchesA, matchesB);
    if (JSON.stringify(result) !== JSON.stringify(['NA1_3', 'NA1_1', 'NA1_2'])) {
        throw new Error(`testOrderPreserved failed: got ${JSON.stringify(result)}`);
    }
    console.log('✓ testOrderPreserved passed');
}

// Run all tests
console.log('Running intersection tests...\n');
testBasicIntersection();
testNoIntersection();
testEmptyArrays();
testDuplicates();
testOrderPreserved();
console.log('\n✓ All tests passed!');