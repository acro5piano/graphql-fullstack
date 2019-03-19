export function mapId(record: any) {
  return { ...record, id: String(record._id), _id: undefined }
}

export function getCollectionNameFromTypeName(typeName: string) {
  // TODO
  return `${typeName.toLowerCase()}s`
}
