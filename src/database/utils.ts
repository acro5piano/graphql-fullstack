export function mapId(record: any) {
  record.id = String(record._id)
  delete record._id
  return record
}

export function getCollectionNameFromTypeName(typeName: string) {
  // TODO
  return `${typeName.toLowerCase()}s`
}
