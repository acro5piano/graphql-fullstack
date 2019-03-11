type Resolver<T> = (root: any, args: any, context: any) => T

export function withResolver<T>(resolve: Resolver<T>) {
  return function(higherOrderArgs: any) {
    return {
      ...higherOrderArgs,
      resolve,
    }
  }
}

export function withArgs(args: object) {
  return function(higherOrderArgs: any) {
    return {
      ...higherOrderArgs,
      args,
    }
  }
}

export function decorate(typeName: string, ...fns: Function[]) {
  if (fns.length === 0) {
    return { typeName }
  }
  const composed = fns.reduce((f, g) => (...args: any) => f(g(...args)))
  return composed({ typeName })
}
