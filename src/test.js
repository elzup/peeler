import m from '.'

test('works', () => {
  expect(m('before(hit)after')).toMatchSnapshot('single')
  expect(m('aa(bb(cc(dd)cc)bb)aa')).toMatchSnapshot('three nest')
})

test('complex', () => {
  expect(m('')).toMatchSnapshot('empty')
  expect(m('()')).toMatchSnapshot('sub empty')
  expect(m('(())')).toMatchSnapshot('sub sub empty')
  expect(m('({}fuga{})')).toMatchSnapshot('nest side')
  expect(m('aa({cc}bb{c2(dd)c2}b)aa(b2)aa')).toMatchSnapshot('gata gata')
  expect(m('[({})]')).toMatchSnapshot('any bracket')
})

test('error', () => {
  // '('
  // 'hog{e(b}c)d'
})
