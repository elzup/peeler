# peeler [![Build Status](https://travis-ci.org/elzup/peeler.svg?branch=master)](https://travis-ci.org/elzup/peeler)

> parser for only bracket.

## Install

```
$ npm install peeler
$ yarn add peeler
```

## Usage

```js
> import peeler from 'peeler'
> peeler('before(hit)after')
[ { nodeType: 'text',
    pos: { start: 0, end: 6, depth: 0 },
    content: 'before' },
  { nodeType: 'bracket',
    pos: { start: 6, end: 10, depth: 0 },
    open: '(',
    close: ')',
    nodes:
     [ { nodeType: 'text',
         pos: { start: 7, end: 10, depth: 1 },
         content: 'hit' } ] },
  { nodeType: 'text',
    pos: { start: 11, end: 16, depth: 0 },
    content: 'after' } ]

> peeler('aa(bb{cc}bb)aa')
[ { nodeType: 'text',
    pos: { start: 0, end: 2, depth: 0 },
    content: 'aa' },
  { nodeType: 'bracket',
    pos: { start: 2, end: 11, depth: 0 },
    open: '(',
    close: ')',
    nodes:
     [ { nodeType: 'text',
         pos: { start: 3, end: 5, depth: 1 },
         content: 'bb' },
       { nodeType: 'bracket',
         pos: { start: 5, end: 8, depth: 1 },
         open: '{',
         close: '}',
         nodes:
          [ { nodeType: 'text',
              pos: { start: 6, end: 8, depth: 2 },
              content: 'cc' } ] },
       { nodeType: 'text',
         pos: { start: 9, end: 11, depth: 1 },
         content: 'bb' } ] },
  { nodeType: 'text',
    pos: { start: 12, end: 14, depth: 0 },
    content: 'aa' } ]

> peeler('[(__)]', { pairs: ['[]', '<>'] }) // skip '(' bracket
[ { nodeType: 'bracket',
    pos: { start: 0, end: 5, depth: 0 },
    open: '[',
    close: ']',
    nodes:
     [ { nodeType: 'text',
         pos: { start: 1, end: 5, depth: 1 },
         content: '(__)' } ] } ]
```

## API

### peeler(name)

#### input

Type: `string`

text to parse.

#### return

Type: PNode[]

```
type PNode = PNodeText | PNodeBracket
type PNodeText = {
  nodeType: 'text',     // plain text part
  content: string,  // innerText
  pos: {
    start: number,    // position of text
    end: number,
    depth: number,    // nest count
  }
}

type PNodeBracket = {
  nodeType: 'bracket',
  open: string,     // bracket charactor
  close: string,
  nodes: PNode[],   // children nodes
  pos: {
    start: number,
    end: number,
    depth: number,
  },
}
```

## License

MIT © [elzup](https://elzup.com)
