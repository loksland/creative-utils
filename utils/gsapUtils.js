import gsap from 'gsap';

// Usage: import * as gsapUtils from '/gsapUtils'

// GSAP 3
export function killChildTweensOf(parent, complete) {
  var parents = gsap.utils.toArray(parent),
    i = parents.length,
    _isDescendant = function (element) {
      let parentProp = element.parent ? 'parent' : 'parentNode'; // PIXI display object : HTML Element
      while (element) {
        element = element[parentProp];
        if (element === parent) {
          return true;
        }
      }
    },
    j,
    tweens,
    targets;
  if (i > 1) {
    while (--i > -1) {
      killChildTweensOf(parents[i], complete);
    }
    return;
  }
  parent = parents[0];
  tweens = gsap.globalTimeline.getChildren(true, true, false);
  for (i = 0; i < tweens.length; i++) {
    targets = tweens[i].targets();
    j = targets.length;
    for (j = 0; j < targets.length; j++) {
      if (_isDescendant(targets[j])) {
        if (complete) {
          tweens[i].totalProgress(1);
        }
        tweens[i].kill();
      }
    }
  }
}
