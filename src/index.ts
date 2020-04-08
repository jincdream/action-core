/**
 * JSON type
 * https://github.com/microsoft/TypeScript/issues/27930
 */
import { JSON, json } from 'ts-brand-json'
type Types<T, D> = { [type in keyof T]: Trigger<T, D> }
type Trigger<T, D> = (param: { target: string; data: D }) => T[keyof T]
export default class ActionCore<AllTypes> {
  private handles: Types<AllTypes, {}> = {} as Types<AllTypes, {}>
  install<D>(type: keyof AllTypes, actionTrigger: Trigger<AllTypes, D>) {
    Object.defineProperty(this.handles, type, {
      value: actionTrigger,
    })
  }
  uninstall(type: keyof AllTypes) {
    Object.defineProperty(this.handles, type, {
      value: void 0,
    })
    delete this.handles[type]
  }
  run<Param extends { [key: string]: any }>(action: {
    type: keyof AllTypes
    target: string
    param?: json<Param>
    data?: Param
    [key: string]: any
  }) {
    let { type, param, data, target, ...option } = action
    let handle = this.handles[type]
    let paramData: Param = {} as Param
    if (param) {
      try {
        paramData = JSON.parse<Param>(param)
      } catch (error) {
        console.error(
          `[Action-Core Error]: action param parse error ↓\n`,
          error
        )
      }
    }
    let [_target, urlParams = ''] = target.split('?')
    let urlData: { [key: string]: any } = {}
    urlParams.split('&').map((v) => {
      let [key, value] = v.split('=')
      urlData[key] = value
    })

    return handle({
      target: _target,
      data: { ...paramData, ...data, ...option, ...urlData },
    })
  }
}
