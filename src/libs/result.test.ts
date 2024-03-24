import { asErr, asVal, isOk, safe } from 'libs/result'

describe('safe', (): void => {
  it('returns resolved promise to a success result', async (): Promise<void> => {
    const value = 'Success!'
    const result = await safe(Promise.resolve(value))
    expect(isOk(result)).toBeTruthy()
    if (isOk(result)) {
      expect(asVal(result)).toEqual(value)
    } else {
      throw new Error('result should be a success')
    }
  })

  it('catches rejected promise to a failure result', async (): Promise<void> => {
    const error = new Error('Hi')
    const result = await safe(Promise.reject(error))
    expect(isOk(result)).toBeFalsy()
    if (!isOk(result)) {
      expect(asErr(result)).toEqual(new Error('Hi'))
    } else {
      throw new Error('result should be a failure')
    }
  })

  it('catches rejected promise to a failure result', async (): Promise<void> => {
    const error = 'HelloError in string'
    const result = await safe(Promise.reject(error))
    expect(isOk(result)).toBeFalsy()
    if (!isOk(result)) {
      expect(asErr(result)).toEqual(new Error('something went wrong'))
    } else {
      throw new Error('result should be a failure')
    }
  })
})
