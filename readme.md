# peeler [![Build Status](https://travis-ci.org/elzup/peeler.svg?branch=master)](https://travis-ci.org/elzup/peeler)

> parser for only bracket.

## Install

```
$ npm install peeler
$ yarn add peeler
```

## Usage

```js
> peeler('before(hit)after')
[ { type: 'text', start: 0, end: 6, depth: 0, content: 'before' },
  { type: 'bracket',
    start: 6,
    end: 10,
    depth: 0,
    open: '(',
    close: ')',
    nodes: [ { type: 'text', start: 7, end: 10, depth: 1, content: 'hit' } ] },
  { type: 'text', start: 0, end: 0, depth: 0, content: 'after' } ]
  
> peeler('aa(bb{cc}bb)aa')
[ { type: 'text', start: 0, end: 2, depth: 0, content: 'aa' },
  { type: 'bracket', start: 2, end: 11, depth: 0, open: '(', close: ')',
    nodes:
     [ { type: 'text', start: 3, end: 5, depth: 1, content: 'bb' },
       { type: 'bracket', start: 5, end: 8, depth: 1, open: '{', close: '}',
         nodes:
          [ { type: 'text', start: 6, end: 8, depth: 2, content: 'cc' } ] },
       { type: 'text', start: 9, end: 11, depth: 1, content: 'bb' } ] },
{ type: 'text', start: 0, end: 0, depth: 0, content: 'aa' } ]

> res = peeler('[(__)]', { pairs: ['[]', '<>'] }) # skip '(' bracket
[ { type: 'text', start: 0, end: 0, depth: 0, content: '' },
  { type: 'bracket',
    start: 0,
    end: 5,
    depth: 0,
    open: '[',
    close: ']',
    nodes: 
     [ { type: 'text', start: 1, end: 5, depth: 1, content: '(__)' } ] }},
  { type: 'text', start: 6, end: 6, depth: 0, content: '' } ]
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
  type: 'text',     // plain text part
  content: string,  // innerText
  start: number,    // position of text
  end: number,
  depth: number,    // nest count
}

type PNodeBracket = {
  type: 'bracket',
  open: string,     // bracket charactor
  close: string,
  nodes: PNode[],   // children nodes
  start: number,
  end: number,
  depth: number,
}

```

## License

MIT © [elzup](https://elzup.com)
