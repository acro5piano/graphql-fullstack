import { GraphQLDirective, GraphQLField } from '@app/parser/interfaces'
import { db } from '@app/database/mongodb'
import { mapId, getCollectionNameFromTypeName } from '@app/database/utils'
import { getDirectiveArgument } from '@app/directives/_utils'

async function resolveField(field: GraphQLField, directive: GraphQLDirective) {
  field.__resolver = async () => {
    const typeName = getDirectiveArgument(directive, 'type')
    const collectionName = getCollectionNameFromTypeName(typeName)
    return db
      .collection(collectionName)
      .find()
      .map(mapId)
      .toArray()
  }

  return field
}

export default resolveField
