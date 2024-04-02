
// Simple hash: Not for secure purposes
export function hash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}


export function stringMatchesWildcardBlob(subject, pattern){

  const regexStr = pattern
        .split('*')
        .map((s) => escapeRegex(s))
        .join('.*');

  const regex = new RegExp(regexStr, 'i');

  return subject.match(regex)

}

export function escapeRegex(string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

