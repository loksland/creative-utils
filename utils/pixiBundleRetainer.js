/*

Manages a retain count for each bundle identifier. 
If retain could is 0 then will allow the unload, otherwise will return null and cancel the unload.

USAGE:
import { retain, unretain,  clearRetains } from '@/game/utils/bundleRetainer'; 
await PIXI.Assets.loadBundle(retain('level1'));
await PIXI.Assets.unloadBundle(unretain('level1'));
*/

//import { log } from '@/game/utils/debug.js';

// Only need to use this class if you wish to purge scene assets on exit

export const bundleRetainCounts = {};

export function retain(bundleID) {
  retainBundle(bundleID, true);
  return bundleID;
}

export function unretain(bundleID) {
  if (retainBundle(bundleID, false) === 0) {
    delete bundleRetainCounts[bundleID];
    return bundleID;
  } else {
    return null;
  }
}

// export function clearRetains(bundleID) {
//   for (let bundleID in bundleRetainCounts) {
//     delete bundleRetainCounts[bundleID];
//   }
// }

function retainBundle(bundleID, retain) {
  if (!bundleRetainCounts[bundleID]) {
    bundleRetainCounts[bundleID] = 0;
  }
  bundleRetainCounts[bundleID] += retain ? 1 : -1;
  return bundleRetainCounts[bundleID];
}
