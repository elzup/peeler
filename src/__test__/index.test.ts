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
  expect(m('\\')).toMatchSnapshot('escape char')
  expect(m('(\\(OK\\)\\[GOOD\\])')).toMatchSnapshot('escape bracket cahr')
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

describe('quoting', () => {
  it('inside quote escape', () => {
    expect(
      m(
        `( " ignored (() " )
      `,
        {
          quotes: [`"`],
        }
      )
    ).toMatchInlineSnapshot(`
      [
        {
          "close": ")",
          "content": "( " ignored (() " )",
          "innerContent": " " ignored (() " ",
          "nodeType": "bracket",
          "nodes": [
            {
              "content": " " ignored (() " ",
              "nodeType": "text",
              "pos": {
                "depth": 1,
                "end": 18,
                "start": 1,
              },
            },
          ],
          "open": "(",
          "pos": {
            "depth": 0,
            "end": 18,
            "start": 0,
          },
        },
        {
          "content": "
            ",
          "nodeType": "text",
          "pos": {
            "depth": 0,
            "end": 26,
            "start": 19,
          },
        },
      ]
    `)
  })

  it('another quote is not close quote', () => {
    expect(
      m(`( " '( " )`, {
        quotes: [`"`, `'`],
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "close": ")",
          "content": "( " '( " )",
          "innerContent": " " '( " ",
          "nodeType": "bracket",
          "nodes": [
            {
              "content": " " '( " ",
              "nodeType": "text",
              "pos": {
                "depth": 1,
                "end": 9,
                "start": 1,
              },
            },
          ],
          "open": "(",
          "pos": {
            "depth": 0,
            "end": 9,
            "start": 0,
          },
        },
      ]
    `)
  })
  it('quote pair', () => {
    expect(
      m(`( [escape [[( ] )`, {
        quotes: [`[]`],
      })
    ).toMatchInlineSnapshot(`
      [
        {
          "close": ")",
          "content": "( [escape [[( ] )",
          "innerContent": " [escape [[( ] ",
          "nodeType": "bracket",
          "nodes": [
            {
              "content": " [escape [[( ] ",
              "nodeType": "text",
              "pos": {
                "depth": 1,
                "end": 16,
                "start": 1,
              },
            },
          ],
          "open": "(",
          "pos": {
            "depth": 0,
            "end": 16,
            "start": 0,
          },
        },
      ]
    `)
  })

  it('quote parse error', () => {
    expect(() =>
      m('( "(" ) ")', { quotes: [`"`] })
    ).toThrowErrorMatchingInlineSnapshot(`"ParseError: 404 quote close " :8"`)
  })
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
    `"Option error, pairs expected ['[]', '()'...], got ["a"]"`
  )
})
