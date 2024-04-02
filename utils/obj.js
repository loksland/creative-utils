
export function toPrettyPrint(obj) {
  return JSON.stringify(obj, 0, 2);
}

export function deepClone(obj){
  return JSON.parse(JSON.stringify(obj))
}
 
export function keyCount(obj){
  return Object.keys(obj).length;
}
