import { GraphQLDirective, GraphQLField } from '@app/parser/interfaces'
import { db } from '@app/database/mongodb'

function mapId(record: any) {
  return { ...record, id: String(record._id) }
}

function getTypeName(_directive: GraphQLDirective) {
  const type = _directive.arguments.find(a => a.name.value === 'type')
  if (!type) {
    throw new Error('directive argument `type` not found')
  }
  return type.value.value
}

function getCollectionNameFromTypeName(typeName: string) {
  // TODO
  return `${typeName.toLowerCase()}s`
}

async function resolveField(field: GraphQLField, _directive: GraphQLDirective) {
  field.__resolver = async () => {
    const collectionName = getCollectionNameFromTypeName(getTypeName(_directive))
    return db
      .collection(collectionName)
      .find()
      .map(mapId)
      .toArray()
  }

  return field
}

export default resolveField
