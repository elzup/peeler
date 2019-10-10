import m from '../index'

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
  expect(() =>
    m('((()))', {
      nestMax: 2,
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"NestError: over nest max limit. options: { nestMax: '2' }"`
  )
  expect(() =>
    m('((()))', {
      nestMax: 1,
    })
  ).toThrowErrorMatchingInlineSnapshot(
    `"NestError: over nest max limit. options: { nestMax: '1' }"`
  )
})

test('bracket parse error', () => {
  expect(() => m('hog{e(b}c)d')).toThrowErrorMatchingInlineSnapshot(
    `"ParseError: 404 pair '{' :7"`
  )
  expect(() => m('(')).toThrowErrorMatchingInlineSnapshot(
    `"ParseError: 404 pair '(' :0"`
  )
})

test('argument error', () => {
  // @ts-ignore: argument test
  expect(() => m(10)).toThrowErrorMatchingInlineSnapshot(
    `"Expected a string, got number"`
  )
  expect(() =>
    m('hoge()', { pairs: ['a'] })
  ).toThrowErrorMatchingInlineSnapshot(
    `"Option error, pairs expected ['[]', '()'...], got [\\"a\\"]"`
  )
})
