export const normalizeString = (string: string) => {
  return string.replace(/ /g, '_')
}

export const unnormalizeString = (string: string) => {
  return string.replace(/_/g, ' ')
}
