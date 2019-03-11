/**
 * Defines the type of the object
 */
export enum GraphQLType {
  SCALAR,
  INLINE_FRAGMENT,
  FRAGMENT,
}

/**
 * The parameters type.
 */
export interface Params {
  [key: string]: string | boolean | number | Params
}

/**
 * The symbol to use to store the object GQL type
 */
export const typeSymbol = Symbol('GraphQL Type')

/**
 * The symbol to use to store the object parameters.
 */
export const paramsSymbol = Symbol('GraphQL Params')

/**
 * A GQL scalar object.
 * Stores the params of the scalar if any were given.
 */
export interface GraphQLScalar {
  [typeSymbol]: GraphQLType.SCALAR
  [paramsSymbol]?: Params
}

function scalarType(): any {
  const scalar: GraphQLScalar = {
    [typeSymbol]: GraphQLType.SCALAR,
  }
  return scalar
}

export class types {
  static get number(): number {
    return scalarType()
  }

  static get string(): string {
    return scalarType()
  }

  static get boolean(): boolean {
    return scalarType()
  }

  static constant<T extends string>(_c: T): T {
    return scalarType()
  }

  static oneOf<T extends {}>(_e: T): keyof T {
    return scalarType()
  }

  static custom<T>(): T {
    return scalarType()
  }

  static optional: {
    number?: number
    string?: string
    boolean?: boolean
    constant: <T extends string>(_c: T) => T | undefined
    oneOf: <T extends {}>(_e: T) => (keyof T) | undefined
    custom: <T>() => T | undefined
  } = types
}
