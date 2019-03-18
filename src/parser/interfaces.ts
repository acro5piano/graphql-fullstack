export interface GraphQLName {
  kind: 'Name'
  value: string
}

export interface Argument {
  name: GraphQLName
  value: {
    value: string
  }
}

export interface GraphQLDirective {
  kind: 'Directive'
  name: GraphQLName
  arguments: Argument[]
}

export interface GraphQLInterface {}

export interface GraphQLType {
  kind: 'NamedType' | 'NonNullType' | 'TypedName' | 'Name' | 'ListType'
  name?: string | GraphQLName
  type?: GraphQLType
}

export type GraphQLKind = 'Document' | 'ObjectTypeDefinition' | 'FieldDefinition'

export interface GraphQLField {
  type: GraphQLType
  directives: GraphQLDirective[]
  name: GraphQLName
  __resolver: Function
}

export interface GraphQLTree {
  kind: GraphQLKind
  name: GraphQLName
  interfaces: GraphQLInterface[]
  directives: GraphQLDirective[]
  fields: GraphQLField[]
  type: GraphQLType
  arguments?: any[]
  definitions?: GraphQLTree[]
}
