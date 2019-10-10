import m from './'

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
  expect(
    m(`hel(lo
go)od by`)
  ).toMatchSnapshot('with newline')
})

test('escape works', () => {
  expect(m('\\')).toMatchSnapshot()
  expect(m('(\\(OK\\)\\[GOOD\\])')).toMatchSnapshot()
})

test('bracket options', () => {
  expect(
    m('aaa(bbb{})ccc[ddd]', {
      pairs: ['()'],
    })
  ).toMatchSnapshot('() only')
  expect(
    m('tOshinO kyoko', {
      pairs: ['Oo'],
    })
  ).toMatchSnapshot('rare option')
})

test('nestMax options', () => {
  expect(
    () =>
      m('((()))', {
        nestMax: 2,
      })
    // @ts-ignore: Test
  ).toThrowErrorMatchingSnapshot('stop nest 2')
  expect(
    () =>
      m('((()))', {
        nestMax: 1,
      })
    // @ts-ignore: Test
  ).toThrowErrorMatchingSnapshot('stop nest 1')
})

test('bracket parse error', () => {
  // @ts-ignore:
  expect(() => m('hog{e(b}c)d')).toThrowErrorMatchingSnapshot('entwined')
  // @ts-ignore:
  expect(() => m('(')).toThrowErrorMatchingSnapshot('no finish')
})

test('argument error', () => {
  // @ts-ignore:
  expect(() => m(10)).toThrowErrorMatchingSnapshot()
  expect(() => m('hoge()', { pairs: ['a'] })).toThrowErrorMatchingSnapshot()
})
