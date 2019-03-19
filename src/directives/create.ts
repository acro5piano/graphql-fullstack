import { GraphQLDirective, GraphQLField } from '@app/parser/interfaces'
import { db } from '@app/database/mongodb'
import { mapId, getCollectionNameFromTypeName } from '@app/database/utils'
import { getDirectiveArgument } from '@app/directives/_utils'

async function resolveField(field: GraphQLField, directive: GraphQLDirective) {
  field.__resolver = async (_root: any, args: any) => {
    const typeName = getDirectiveArgument(directive, 'type')
    const collectionName = getCollectionNameFromTypeName(typeName)
    const res = await db.collection(collectionName).insert(args.input)
    return res.ops.map(mapId)[0]
  }

  return field
}

export default resolveField
