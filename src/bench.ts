import m from './index'

const ITERATIONS = 100_000

const cases: [string, Parameters<typeof m>][] = [
  ['simple', ['before(hit)after']],
  ['nested', ['aa(bb(cc(dd)cc)bb)aa']],
  ['complex', ['aa({cc}bb{c2(dd)c2}b)aa(b2)aa']],
  ['escape', ['(\\(OK\\)\\[GOOD\\])']],
  ['quotes', ['( " ignored (() " )', { quotes: ['"'] }]],
  ['custom_pairs', ['tOshinO kyoko', { pairs: ['Oo'] }]],
  ['deeply_nested', ['((((((((((x))))))))))']],
  [
    'large_input',
    ['abc(def{ghi[jkl(mno)pqr]stu}vwx)yz'.repeat(50)],
  ],
]

function bench(label: string) {
  console.log(`\n=== ${label} ===`)
  for (const [name, args] of cases) {
    const start = performance.now()
    for (let i = 0; i < ITERATIONS; i++) {
      m(...args)
    }
    const elapsed = performance.now() - start
    const opsPerSec = Math.round(ITERATIONS / (elapsed / 1000))
    console.log(
      `  ${name.padEnd(16)} ${elapsed.toFixed(2).padStart(8)}ms  (${opsPerSec.toLocaleString()} ops/s)`
    )
  }
}

bench('peeler benchmark')
