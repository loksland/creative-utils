import gsap from 'gsap'; // GSAP 3
import { stringMatchesWildcardBlob } from './str';

// All arguments are optional and can be in any order. Assumes:
// - If function is callback
// - If number is delay
// - If object is scope
// - If array is params
// - If string is id
export default function wait(
  delay = null,
  scope = null,
  callback = null,
  params = null,
  id = null,
) {
  for (let arg of arguments) {
    if (arg) {
      if (typeof arg === 'number') {
        delay = arg;
      } else if (typeof arg === 'function') {
        callback = arg;
      } else if (Array.isArray(arg)) {
        params = arg;
      } else if (typeof arg === 'object') {
        scope = arg;
      } else if (typeof arg === 'string') {
        id = arg;
      }
    }
  }

  if (!delay) {
    delay = 0;
  }

  let props = {
    immediateRender: false,
    lazy: false,
    overwrite: false,
    delay,
    onComplete: callback,
    onReverseComplete: callback,
    onCompleteParams: params,
    onReverseCompleteParams: params,
    callbackScope: scope,
  };

  if (id) {
    props.id = id;
  }

  return gsap.to(callback, 0, props);
}

// |ref| can be an id, tween object or callback function, an array of these or supplied as arguments
// - ids can include wild cards: eg. 'mytween*' would match 'mytween0', 'mytween', 'mytween6' etc.
export function cancelWaits(ref) {
  if (arguments.length > 1) {
    for (let arg of arguments) {
      cancelWaits(arg);
    }
    return;
  }

  if (Array.isArray(ref)) {
    for (let _ref of ref) {
      cancelWaits(_ref);
    }
    return;
  }

  if (typeof ref === 'function') {
    // Callback
    gsap.killTweensOf(ref);
  } else if (typeof ref.kill === 'function') {
    // Tween object
    ref.kill();
  } else if (typeof ref === 'string') {
    // id assumed
    // ref = String(ref);
    if (ref.includes('*')) {
      let tws = gsap.globalTimeline.getChildren(true, true, true);
      for (let tw of tws) {
        if (
          ref === '*' ||
          (tw.vars.id && stringMatchesWildcardBlob(tw.vars.id, ref))
        ) {
          tw.kill();
        }
      }
    } else {
      gsap.getById(ref)?.kill();
    }
  }
}

/*
Usage:
```js
  this.idPool = createIDPool();
  wait(1.0, this, this.callbackFn, ['ARG'], this.idPool.next);
  wait(1.0, this, this.callbackFn, ['ARG'], this.idPool.next);
  wait(1.0, this, this.callbackFn, ['ARG'], this.idPool.next);
  gsap.to(ele, 3.0, {x:200.0, id: this.idPool.next})
  cancelWait(this.idPool.all);
```
*/
const ALPHANUMS =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890';
export function createIDPool(uid = null) {
  uid = uid && uid.length ? uid : makeUID();

  function makeUID() {
    let uid = '';
    while (uid.length < 5) {
      uid += ALPHANUMS.charAt(Math.floor(Math.random() * ALPHANUMS.length));
    }
    return uid;
  }

  let index = -1;
  const allPattern = `${uid}.*`;

  return {
    get next() {
      index++;
      return `${uid}.${index}`;
    },
    all: allPattern,
    get last() {
      return `${uid}.${index}`;
    },
  };
}
