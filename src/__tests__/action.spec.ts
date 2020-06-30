import ActionCore from '../index'
import { JSON } from 'ts-brand-json'

describe(`ActionCore`, () => {
  // let greeter: Greeter
  type Res = { a: number; f: number; ping: string; q: string }
  type ActionType = {
    mtop: Promise<Res>
  }

  let actionCore = new ActionCore<ActionType>()

  actionCore.install<Res>('mtop', async ({ data, target }) => {
    console.log(data.a, target)
    return {
      ...data,
      a: 123,
    }
  })

  beforeEach(() => {
    // greeter = new Greeter('World')
    console.log(JSON, 'JSON')
  })

  it(`DEMO`, async () => {
    let data = await actionCore.run<{ ping: string }>({
      type: 'mtop',
      target: 'mtop.a.b.c?q=123',
      param: JSON.stringify({
        ping: 'pong',
      }),
      data: { ping: 'ss' },
      f: 321,
    })
    expect(data).toEqual({
      a: 123,
      f: 321,
      ping: 'ss',
      q: '123',
    })
  })
  it(`urlParam`, async () => {
    let data = await actionCore.run<{ ping: string }>({
      type: 'mtop',
      target: 'mtop.a.b.c',
      data: { ping: 'ss' },
    })
    expect(data).toEqual({ ping: 'ss', a: 123 })
  })
})
