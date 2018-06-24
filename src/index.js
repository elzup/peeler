// @flow

// import type { JudgeWithResult } from './types'

function main(name: string): JudgeWithResult[] {
  if (typeof name !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof name}`)
  }
  if (name === '') {
    throw new TypeError(`Expected no empty string`)
  }

  const results = judges.all.map(judge => ({
    info: judge.info,
    result: judge.judge(name),
  }))
  return results
}

export default main
