// @flow
export type NodeBase = {
  start: number,
  end: number,
  depth: number,
}

export type PNodeText = {
  type: 'text',
  content: string,
} & NodeBase

export type PNodeBracket = {
  type: 'bracket',
  open: string,
  close: string,
  nodes: PNode[],
} & NodeBase

export type PNode = PNodeText | PNodeBracket

export type PairLib = { [key: string]: string }
export type Options = {
  pairs: string[],
  nestMax: number,
  escape: string,
  includeEmpty: boolean,
}
