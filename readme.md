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

### default Options

```
const defaultOptions: Options = {
  pairs: ['()', '{}', '[]'],
  nestMax: 100,
  escape: '\\',
  includeEmpty: false,
}
```

## more example

```js
// @flow

import peeler from '.'
import type { PNode } from './types'

const print = (node: PNode) => {
  const nest = '- '.repeat(node.pos.depth)
  if (node.nodeType === 'text') {
    console.log(nest + node.content)
    return
  } else {
    console.log(nest + node.open)
    node.nodes.map(print)
    console.log(nest + node.close)
  }
}

peeler(`(hello(world(\\\\('ω'\\)/){[A](B)}))`).map(print)
```

```
(
- hello
- (
- - world
- - (
- - - \('ω')/
- - )
- - {
- - - [
- - - - A
- - - ]
- - - (
- - - - B
- - - )
- - }
- )
)
```

## Related works

* [texter](https://github.com/elzup/texter)

## License

MIT © [elzup](https://elzup.com)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars3.githubusercontent.com/u/2284908?v=4" width="100px;"/><br /><sub><b>elzup</b></sub>](https://elzup.com)<br />[💻](https://github.com/elzup/peeler/commits?author=elzup "Code") [⚠️](https://github.com/elzup/peeler/commits?author=elzup "Tests") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!
