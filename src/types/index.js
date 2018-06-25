// @flow

export type PNodeText = {
  type: 'text',
  content: string,
}

export type PNodeBracket = {
  type: 'bracket',
  open: string,
  close: string,
  nodes: PNode[],
}

export type PNode = PNodeText | PNodeBracket

export type PairLib = { [key: string]: string }
export type Options = {
  pairs: string[],
  nestMax: number,
}
