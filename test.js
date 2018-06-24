import m from './src'

function findById(res, id) {
  return res.find(jr => jr.info.id === id)
}

test('length_short', () => {
  const id = 'length_short'
  const s = findById(m('ssssss'), id)
  const a = findById(m('aaaa'), id)
  const c = findById(m('ccc'), id)
  expect([s, a, c]).toMatchSnapshot()
  expect([s, a, c].map(v => v.result.rank)).toEqual(['S', 'A', 'C'])
})

test('length_long', () => {
  const id = 'length_long'
  const s = findById(m('ssssss'), id)
  const a = findById(m('aaaaaaaaaa'), id)
  const b = findById(m('b'.repeat(20)), id)
  const c = findById(m('c'.repeat(21)), id)
  expect([s, a, b, c]).toMatchSnapshot()
  expect([s, a, b, c].map(v => v.result.rank)).toEqual(['S', 'A', 'B', 'C'])
})

test('string_order', () => {
  const id = 'string_order'
  const s = findById(m('_zzz'), id)
  const a = findById(m('elzup'), id)
  const b = findById(m('ooo'), id)
  const c = findById(m('zombie'), id)
  expect([s, a, b, c]).toMatchSnapshot()
  expect([s, a, b, c].map(v => v.result.rank)).toEqual(['S', 'A', 'B', 'C'])
})
test('string_order uppercase', () => {
  const id = 'string_order'
  const a = findById(m('Elzup'), id)
  expect(a.result.rank).toEqual('A')
  const b = findById(m('Oct'), id)
  expect(b.result.rank).toEqual('B')
})

test('sign_count', () => {
  const id = 'sign_count'
  const s = findById(m('toshino'), id)
  const a = findById(m('n_zap'), id)
  const b = findById(m('el-zu-p'), id)
  const c = findById(m('z...ombie'), id)
  expect([s, a, b, c]).toMatchSnapshot()
  expect([s, a, b, c].map(v => v.result.rank)).toEqual(['S', 'A', 'B', 'C'])
})

test('ambiguity', () => {
  const id = 'ambiguity'
  const s = findById(m('elzup'), id)
  const a = findById(m('toshino'), id)
  expect([s, a]).toMatchSnapshot()
  expect([s, a].map(v => v.result.rank)).toEqual(['S', 'A'])
})

test('argument error', () => {
  expect(() => m(0)).toThrowError(/string/)
  expect(() => m(null)).toThrowError(/string/)
  expect(() => m(false)).toThrowError(/string/)
  expect(() => m(undefined)).toThrowError(/string/)
  expect(() => m()).toThrowError(/string/)

  expect(() => m('')).toThrowError(/empty/)
})
