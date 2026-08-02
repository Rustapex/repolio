const utf8Decoder = new TextDecoder('utf-8')
const utf16LeDecoder = new TextDecoder('utf-16le')
const utf16BeDecoder = new TextDecoder('utf-16be')

function hasUtf16LeByteOrderMark(bytes) {
  return bytes[0] === 0xff && bytes[1] === 0xfe
}

function hasUtf16BeByteOrderMark(bytes) {
  return bytes[0] === 0xfe && bytes[1] === 0xff
}

function detectUtf16Encoding(bytes) {
  const sampleLength = Math.min(bytes.length, 512)
  let evenNullBytes = 0
  let oddNullBytes = 0

  for (let index = 0; index < sampleLength; index += 1) {
    if (bytes[index] !== 0) continue
    if (index % 2 === 0) evenNullBytes += 1
    else oddNullBytes += 1
  }

  if (oddNullBytes >= 4 && oddNullBytes > evenNullBytes * 2) return utf16LeDecoder
  if (evenNullBytes >= 4 && evenNullBytes > oddNullBytes * 2) return utf16BeDecoder
  return null
}

export function decodeReadme(bytes) {
  if (hasUtf16LeByteOrderMark(bytes)) return utf16LeDecoder.decode(bytes.subarray(2))
  if (hasUtf16BeByteOrderMark(bytes)) return utf16BeDecoder.decode(bytes.subarray(2))

  const utf16Decoder = detectUtf16Encoding(bytes)
  return utf16Decoder ? utf16Decoder.decode(bytes) : utf8Decoder.decode(bytes)
}

export function normalizeBranchNames(branches, defaultBranch) {
  return [...new Set([
    ...branches.map(({name}) => name).filter(Boolean),
    defaultBranch,
  ].filter(Boolean))].sort((left, right) => left.localeCompare(right))
}
