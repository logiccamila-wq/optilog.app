/**
 * Performance Benchmarks
 * 
 * This file contains benchmarks demonstrating the performance improvements
 * from optimizing array operations.
 */

// Simulate tax data
const generateTaxData = (count: number) => {
  const statuses = ['pending', 'calculated', 'paid', 'overdue'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: `TAX-${i}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    taxValue: Math.random() * 10000,
  }));
};

// OLD APPROACH: Multiple filter operations (SLOW)
function calculateTotalsOld(taxes: any[]) {
  const calculated = taxes.filter(i => i.status === 'calculated').reduce((acc, i) => acc + i.taxValue, 0);
  const paid = taxes.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.taxValue, 0);
  const pending = taxes.filter(i => i.status === 'pending').reduce((acc, i) => acc + i.taxValue, 0);
  const overdue = taxes.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.taxValue, 0);
  
  const calculatedCount = taxes.filter(i => i.status === 'calculated').length;
  const paidCount = taxes.filter(i => i.status === 'paid').length;
  const pendingCount = taxes.filter(i => i.status === 'pending').length;
  const overdueCount = taxes.filter(i => i.status === 'overdue').length;
  
  return {
    totals: { calculated, paid, pending, overdue },
    counts: { calculated: calculatedCount, paid: paidCount, pending: pendingCount, overdue: overdueCount }
  };
}

// NEW APPROACH: Single pass reduce (FAST)
function calculateTotalsNew(taxes: any[]) {
  return taxes.reduce((acc, tax) => {
    acc.totals[tax.status] = (acc.totals[tax.status] || 0) + tax.taxValue;
    acc.counts[tax.status] = (acc.counts[tax.status] || 0) + 1;
    return acc;
  }, {
    totals: {} as Record<string, number>,
    counts: {} as Record<string, number>
  });
}

// Benchmark function
function benchmark(name: string, fn: () => void, iterations: number = 1000): number {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;
  
  console.log(`\n${name}:`);
  console.log(`  Total time: ${totalTime.toFixed(2)}ms`);
  console.log(`  Average time: ${avgTime.toFixed(4)}ms`);
  console.log(`  Iterations: ${iterations}`);
  
  return avgTime;
}

// Run benchmarks
console.log('=== Performance Benchmark: Array Operations ===\n');

const sizes = [10, 100, 1000];

sizes.forEach(size => {
  console.log(`\n📊 Testing with ${size} items:`);
  console.log('─'.repeat(50));
  
  const data = generateTaxData(size);
  
  const oldTime = benchmark(
    '❌ OLD: Multiple filter operations',
    () => calculateTotalsOld(data),
    1000
  );
  
  const newTime = benchmark(
    '✅ NEW: Single pass reduce',
    () => calculateTotalsNew(data),
    1000
  );
  
  const improvement = ((oldTime - newTime) / oldTime * 100);
  const speedup = (oldTime / newTime);
  
  console.log(`\n🎯 Performance improvement: ${improvement.toFixed(1)}%`);
  console.log(`⚡ Speed multiplier: ${speedup.toFixed(2)}x faster`);
});

console.log('\n' + '='.repeat(50));
console.log('✅ Benchmark complete!');
console.log('='.repeat(50) + '\n');

// Verify results are identical
const testData = generateTaxData(100);
const oldResult = calculateTotalsOld(testData);
const newResult = calculateTotalsNew(testData);

console.log('🔍 Verifying correctness:');
console.log('Old totals:', oldResult.totals);
console.log('New totals:', newResult.totals);
console.log('Old counts:', oldResult.counts);
console.log('New counts:', newResult.counts);

// Compare values, not order
const totalsMatch = Object.keys(oldResult.totals).every(
  key => Math.abs(oldResult.totals[key] - (newResult.totals[key] || 0)) < 0.001
);
const countsMatch = Object.keys(oldResult.counts).every(
  key => oldResult.counts[key] === (newResult.counts[key] || 0)
);

if (totalsMatch && countsMatch) {
  console.log('\n✅ Results match! Optimization is correct.');
} else {
  console.log('\n❌ Results do not match! Check implementation.');
}
