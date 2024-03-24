import { z } from 'zod'

type Ok<T> = { ok: true; val: T; err: null }
type Err<E> = { ok: false; val: null; err: E }
export type Result<T, E> = Ok<T> | Err<E>
type OkTuple<T> = [T, null, true]
type ErrTuple<E> = [null, E, false]
export type ResultTuple<T, E> = OkTuple<T> | ErrTuple<E>

export function ok<T>(val: T): Ok<T> {
  // return [val, null, true]
  return {
    ok: true,
    val,
    err: null,
  }
}

export function err<E>(err: E): Err<E> {
  // return [null, err, false]
  return {
    ok: false,
    val: null,
    err,
  }
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  // return result[2]
  return result.ok
}

export function asVal<T>(result: Ok<T>): T {
  // return result[0]
  return result.val
}

export function asErr<E>(result: Err<E>): E {
  // return result[1]
  return result.err
}

export function unwrap<T, E>(result: Result<T, E>): T | null {
  return isOk(result) ? asVal(result) : null
}

export function unwrapOr<T, E>(result: Result<T, E>, t: T): T {
  return isOk(result) ? asVal(result) : t
}

export function unwrapOrElse<T, E>(result: Result<T, E>, func: (e: E) => T): T {
  return isOk(result) ? asVal(result) : func(asErr(result))
}

export function unwrapErr<T, E>(result: Result<T, E>): E | null {
  return isOk(result) ? null : asErr(result)
}

export function intoTuple<T, E>(result: Result<T, E>): ResultTuple<T, E> {
  // return result.ok ? [result.val, null, true] : [null, result.err, false]
  return result.ok ? [result.val, null, true] : [null, result.err, false]
}

export function intoValue<T, E>(result: Result<T, E>): Result<T, E> {
  return isOk(result)
    ? { ok: true, val: asVal(result), err: null }
    : { ok: false, val: null, err: asErr(result) }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safe<T, A extends any[]>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (args: A) => T extends PromiseLike<any> ? never : T,
  ...args: A
): Result<T, Error>
export function safe<T>(promise: Promise<T>): Promise<Result<T, Error>>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safe<T, A extends any[]>(
  fn: ((args: A) => T) | Promise<T>,
  ...args: A
): Result<T, Error> | Promise<Result<T, Error>> {
  if (fn instanceof Promise) {
    return fn.then(ok, toError)
  }

  try {
    return ok(fn(args))
  } catch (error) {
    return toError(error)
  }
}

function toError(error: unknown): Err<Error> {
  if (error instanceof Error) return err(error)
  return err(new Error('something went wrong'))
}

export function all<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const okList = []
  for (const result of results) {
    if (isOk(result)) {
      okList.push(asVal(result))
    } else {
      return result
    }
  }

  return ok(okList)
}

export function map<T, U, E>(
  result: Result<T, E>,
  func: (t: T) => U,
): Result<U, E> {
  if (isOk(result)) {
    return ok(func(asVal(result)))
  }
  return err(asErr(result))
}

export function fromZodResult<Output>(
  zodResult: z.SafeParseReturnType<Output, Output>,
): Result<Output, z.ZodError<Output>> {
  if (zodResult.success) {
    return ok(zodResult.data)
  }
  return err(zodResult.error)
}
