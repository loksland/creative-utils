// Utils: import * as pixiUtils from '@/flipbook/utils/pixiUtils';

import {
  Assets,
  Spritesheet,
  //BaseTexture,
  Point,
  Texture,
  // TextureCache,
  //BaseTextureCache,
  Ticker,
} from 'pixi.js'; // PIXI v8
import { keyCount } from './obj';
import * as maths from './maths';
import { log } from './debug';



export function logCachedAssets() {

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
  const _bundles = Assets.resolver._bundles; // Private PIXI ref
  let bundleIDForAssetURL = {};
  let bundles = {};
  for (let bundleID in _bundles) {
    bundles[bundleID] = {};
    bundles[bundleID].assets = [];
    for (let assetKey of _bundles[bundleID]) {
      const assetURL = Assets.resolver.resolveUrl(assetKey);
      bundleIDForAssetURL[assetURL] = bundleID;
    }
  }

  let spritesheetURLForTxURL = {};
  let cache = Assets.cache._cache; // Private PIXI ref
  for (let [key, val] of cache) {
    const url = Assets.resolver.resolveUrl(key);


    if (val instanceof Spritesheet && bundleIDForAssetURL[url]) {

      for (let txKey in val.textures) {

        const txURL = Assets.resolver.resolveUrl(txKey);
        spritesheetURLForTxURL[txURL] = url;
        if (bundleIDForAssetURL[url]) {
          bundleIDForAssetURL[txURL] = bundleIDForAssetURL[url]; // Use spritesheet's bundle
        }
      }
    }
  }

  let noBundleID = '_nobundle';
  let cacheList = {};
  let txBySpritesheetURL = {};

  let cacheEntries = {}; // key => value
  for (let [key, val] of cache) {
    const url = Assets.resolver.resolveUrl(key);
    cacheEntries[url] = { asset: val, store: 'Assets.cache' };
  }

  // for (let key in TextureCache) {
  //   const url = Assets.resolver.resolveUrl(key);
  //   cacheEntries[url] = {
  //     asset: TextureCache[key],
  //     store: 'TextureCache',
  //   };
  // }
  // for (let key in BaseTextureCache) {
  //   const url = Assets.resolver.resolveUrl(key);
  //   cacheEntries[url] = {
  //     asset: BaseTextureCache[key],
  //     store: 'BaseTextureCache',
  //   };
  // }

  for (let url in cacheEntries) {
    const val = cacheEntries[url].asset;

    let bundleID = bundleIDForAssetURL[url]
      ? bundleIDForAssetURL[url]
      : noBundleID;
    if (!cacheList[bundleID]) {
      cacheList[bundleID] = {};
    }

    if (!cacheList[bundleID][url]) {
      let assetInfo = {};
      // assetInfo.url = url;
      if (val instanceof Spritesheet) {
        assetInfo.type = 'Spritesheet';
        //assetInfo.baseTxUID = val.baseTexture.uid;
      } else if (val instanceof Texture) {
        assetInfo.type = 'Texture';
        //assetInfo.baseTxUID = val.baseTexture.uid;
        assetInfo.spritesheetURL = spritesheetURLForTxURL[url];
        if (spritesheetURLForTxURL[url]) {
          if (!txBySpritesheetURL[spritesheetURLForTxURL[url]]) {
            txBySpritesheetURL[spritesheetURLForTxURL[url]] = {};
          }
          if (!txBySpritesheetURL[spritesheetURLForTxURL[url]][url]) {
            txBySpritesheetURL[spritesheetURLForTxURL[url]][url] = assetInfo;
          }
          assetInfo = null;
        }
      } else if (
        typeof val === 'object' &&
        url.toLowerCase().endsWith('.json')
      ) {
        assetInfo.type = 'JSON';
      }

      if (assetInfo) {
        if (bundleID === noBundleID) {
          assetInfo.store = cacheEntries[url].store;
        }
        cacheList[bundleID][url] = assetInfo;
      }
    }
  }

  for (let bundleID in cacheList) {
    for (let assetURL in cacheList[bundleID]) {
      if (
        cacheList[bundleID][assetURL].type === 'Spritesheet' &&
        txBySpritesheetURL[assetURL]
      ) {
        cacheList[bundleID][assetURL].textures = txBySpritesheetURL[assetURL];
      }
    }
  }

  // Clean up |cacheList| for output

  // let cacheList = deepClone(cacheList);

  const assetToOneLineOutput = (asset) => {
    let output = [];
    output.push(asset.type);
    delete asset.type;
    for (let prop in asset) {
      output.push(`${prop}:${asset[prop]}`);
    }
    return output.join(' ');
  };

  let totalAssets = 0;
  let output = [];
  for (let bundleID in cacheList) {
    let bundleAssetTotal = keyCount(cacheList[bundleID]);

    for (let assetURL in cacheList[bundleID]) {
      const asset = cacheList[bundleID][assetURL];
      asset.url = assetURL;
      if (asset.type === 'Spritesheet') {
        const totalTxs = keyCount(asset.textures);
        bundleAssetTotal += totalTxs;
        asset.textures = totalTxs;
      }
      output.push('  - ' + assetToOneLineOutput(asset));
    }

    output.push(
      `  Bundle: ${bundleID === noBundleID ? '*none*' : `'${bundleID}'`} (${bundleAssetTotal})`,
    );

    totalAssets += bundleAssetTotal;
  }

  output.push(`Cache (${totalAssets})`);

  // console.dir(cacheList);

  log(output.reverse().join('\n'));
}

// function textureUID(tx) {
//   if (!(tx instanceof Texture)) {
//     return null;
//   }
//   return hash(tx.textureCacheIds.join(',')).toUpperCase();
// }

// export async function destroyApp(app) {

//   Ticker.shared.stop();

//   // gsapUtils.killChildTweensOf(app.stage);

//   app.destroy(true, {
//     // remove the view (canvas) from DOM
//     children: true, // All the children will have their destroy method called as well. 'stageOptions' will be passed on to those calls.
//     texture: true, // Should it destroy the texture of the child sprite
//     baseTexture: true, // Should it destroy the base texture of the child sprite
//   });

//   // await destroyAllAssets();
//   await Assets.reset();
// }

// export async function destroyAllAssets() {

//   await Assets.reset(); // This will wipe the resolver and caches. You will need to reinitialize the Asset

//   // Remove any remaining textures from the cache.
//   // for (let key in TextureCache) {
//   //   TextureCache[key].destroy(true); // true: destroy base
//   //   Texture.removeFromCache(key);
//   // }

//   // for (let key in BaseTextureCache) {
//   //   BaseTextureCache[key].destroy();
//   //   //BaseTexture.removeFromCache(key);
//   // }
// }

/**
 * Returns a string representation of children of the given display object.
 */
export function logStack(dispo, level = 0) {
  let output = [];

  const info = getLogSummary(dispo);
  //info.children = dispo.children.length;

  if (level == 0) {
    output.push(info);
  } else {
    output.push('  '.repeat(level - 1) + '- ' + info);
  }

  if (dispo.children) {
    for (let i = dispo.children.length - 1; i >= 0; i--) {
      let child = dispo.children[i];
      output = output.concat(logStack(child, level + 1));
    }
  }

  if (level == 0) {
    log(output.join('\n')); //window['c' + 'onsole']['l' + 'og'](output.join('\n'))
  } else {
    return output;
  }
}

export function getLogSummary(dispo) {
  return _stackInfoToOneLineOutput(_getDisplayObjectInfo(dispo));
}

function _getDisplayObjectInfo(dispo) {
  let info = {};
  info.constructorClassName = _dispoContructorClassName(dispo);
  info.pixiClassName = _dispoToPixiClassName(dispo);
  info.label = dispo.label;
  info.pos = `${_clipFloat(dispo.x)},${_clipFloat(dispo.y)}`;
  if (info.pixiClassName !== 'Container') {
    info.dims = `${_clipFloat(dispo.width)}x${_clipFloat(dispo.height)}`;
  }
  info.scale = `${_clipFloat(dispo.scale.x)}x${_clipFloat(dispo.scale.y)}`;
  info.visible = dispo.visible ? 'Y' : 'N';
  info.alpha = _clipFloat(dispo.alpha);
  return info;
}

function _stackInfoToOneLineOutput(info) {
  let output = [];

  let name = info.pixiClassName;
  if (info.constructorClassName) {
    name += `[${info.constructorClassName}]`;
  }
  if (info.label) {
    name += `:'${info.label}'`;
  }
  output.push(name);

  delete info.label;
  delete info.pixiClassName;
  delete info.constructorClassName;

  for (let prop in info) {
    output.push(`${prop}:${info[prop]}`);
  }

  return output.join(' ');
}

function _clipFloat(num) {
  return Math.round(num * 100) / 100;
}

//let dispoClassNameCache;
function _dispoContructorClassName(dispo) {
  const constructorName = dispo.constructor.name;
  return constructorName.startsWith('_') ? null : constructorName;
}

function _dispoToPixiClassName(dispo) {
  if (isContainer(dispo)) {
    return 'Container';
  } else if (isAnimatedSprite(dispo)) {
    return 'AnimatedSprite';
  } else if (dispo.texture) {
    return 'Sprite';
  } else {
    return 'Other';
  }
}

function isContainer(dispo) {
  return (typeof dispo.texture === 'undefined') && dispo.allowChildren;
}

export function isAnimatedSprite(dispo) {
  return (typeof dispo.texture !== 'undefined') && (typeof dispo.animationSpeed === 'number');
}



/**
 * Returns `true` if the display object is a `PIXI.AnimatedSprite`.
 * @returns {boolean} result
 */
// PIXI.AnimatedSprite.prototype.isAnimatedSprite = function(){
//   return true;
// }

/**
 * Brings display object to the top of the display stack.
 * <br>- Will throw an error if display object doesn't have a parent.
 */
// DisplayObject.prototype.bringToFront = function(){

//   this.parent.setChildIndex(this, this.parent.children.length - 1)

// }

/**
 * Sends display object to the back of the display stack.
 * <br>- Will throw an error if display object doesn't have a parent.
 */
// DisplayObject.prototype.sendToBack = function(){
//   this.parent.setChildIndex(this, 0)
// }

/**
 * Applies the supplied pivot to the display object without moving the position, even if rotated.
 *
 * @param {DisplayObject} displayObject - Target.
 * @param {Point} pivot - Pivot point, in parent coord space.
 */
export function applyParentPivot(displayObject, pivotPt) {
  const translatedPt = translatePointToCoordSpace(
    pivotPt,
    displayObject.parent,
    displayObject,
  );

  setPivotWithoutMoving(displayObject, translatedPt);
}

/**
 * Applies the supplied pivot to the display object without moving the position, even if rotated.
 *
 * @param {DisplayObject} displayObject - Target.
 * @param {Point} pivot - Pivot point, in internal coords (as per PIXI docs).
 */
export function setPivotWithoutMoving(displayObject, pivotPt) {
  const pivotOffset = new Point(
    pivotPt.x - displayObject.pivot.x,
    pivotPt.y - displayObject.pivot.y,
  );

  displayObject.pivot.copyFrom(pivotPt);

  // const angOffset = 0.0;
  const pivotOffsetScaled = new Point(
    pivotOffset.x * displayObject.scale.x,
    pivotOffset.y * displayObject.scale.y,
  );

  const zeroPt = new Point(0.0, 0.0);
  const pivotOffsetDist = maths.distanceBetweenPoints(
    zeroPt,
    pivotOffsetScaled,
  );
  const pivotOffsetAng = maths.angleDegsBetweenPoints(
    zeroPt,
    pivotOffsetScaled,
  );

  const pos = maths.projectAngleDegsFromPoint(
    displayObject.position,
    pivotOffsetAng + displayObject.angle,
    pivotOffsetDist,
  );

  displayObject.position.copyFrom(pos);
}

/**
 * A drop in replacement for `Graphics.lineTo` that plots dashed lines.
 * @param {Vector} from - Starting point.
 * @param {Vector} to - End point.
 * @param {number} [dash=16.0] - Dash distance, in points.
 * @param {number} [gap=8.0] - Gap distance, in points.
 * @param {number} [offsetPerc=0.0] - Optional offset percentage (0.0-1.0) of dash pattern. Percentage is applied to the sum of `dash` + `gap`.
 */
// PIXI.Graphics.prototype.dashedLineTo = function(fromPt, toPt, dash = 16.0, gap = 8.0, offsetPerc = 0.0) {

//   let penDist = (gap + dash) * offsetPerc;
//   if (penDist > gap){
//     penDist -= gap + dash;
//   }
//   let penEnabled = false;
//   let totalDist = mutils.distanceBetweenPoints(fromPt, toPt);

//   let penPt;
//   if (penDist > 0.0){
//     penPt = mutils.projectDistance(fromPt, toPt, penDist);
//     this.moveTo(penPt.x, penPt.y);
//   } else {
//     this.moveTo(fromPt.x, fromPt.y);
//   }

//   while(penDist < totalDist){
//     penEnabled = !penEnabled;
//     if (penEnabled){
//       penDist = Math.min(totalDist, penDist + dash);
//       penPt = mutils.projectDistance(fromPt, toPt, penDist);
//       this.lineTo(penPt.x, penPt.y);
//     } else {
//       penDist = Math.min(totalDist, penDist + gap);
//       penPt = mutils.projectDistance(fromPt, toPt, penDist);
//       this.moveTo(penPt.x, penPt.y);
//     }
//   }
// };

/**
 * Will adjust child display object to retain the same scale despite the scale applied to its parent.
 * <br>- Will throw an error if display object has not got a parent.
 * @param {boolean} [updatePosition=true] - If true will updated the child's position as well.
 */
// DisplayObject.prototype.adjustForParentScale = function(updatePosition = false){

//   this.scale.x *= Math.abs(1.0/this.parent.scale.x);
//   this.scale.y *= Math.abs(1.0/this.parent.scale.y);

//   if (updatePosition){
//     this.x *= Math.abs(1.0/this.parent.scale.x);
//     this.y *= Math.abs(1.0/this.parent.scale.y);
//   }
// }

/**
 * Display object will remain in place from one parent coord space to another
 * <br>- See {@link https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html#toGlobal}
 */
// DisplayObject.prototype.translateToCoordSpace = function(oldParent, newParent){

//   return newParent.toLocal(this.position, oldParent, this.position);

// }

/**
 * Point will remain in place from one parent coord space to another
 * <br>- See {@link https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html#toGlobal}
 */
export function translatePointToCoordSpace(pt, oldParent, newParent) {
  return newParent.toLocal(pt, oldParent);
}

/**
 * Point will remain in place from one parent coord space to another
 * <br>- See {@link https://pixijs.download/dev/docs/PIXI.AnimatedSprite.html#toGlobal}
 */
// PIXI.ObservablePoint.prototype.translateToCoordSpace = function(oldParent, newParent){

//   return newParent.toLocal(this, oldParent, this);

// }

/**
 * Returns true if display object has applied cache as bitmap.
 * <br>- The cache will be applied at the next render after cacheAsBitmap is enabled.
 * @returns {boolean} isCached
 */
// DisplayObject.prototype.isCached = function(){
//   return this._cacheData && this._cacheData.sprite;
// }

/**
 * Removes filters and masks to display object and all children recursively.
 * <br>- Called by scene on exit.
 * @param {boolean} recursive - Whether to call on children and their children.
 */
// DisplayObject.prototype.destroyFiltersAndMasks = function(recursive = true){

//   if (this.mask){
//     this.mask = null;
//   }
//   if (this.filters){
//     this.filters = null;
//   }

//   //if (this.cacheAsBitmap){
//   //  this.cacheAsBitmap = false;
//   //}

//   if (!recursive){
//     return;
//   }

//   for (let i = 0; i < this.children.length; i++){
//     this.children[i].destroyFiltersAndMasks();
//   }

// }

/**
 * Will play the animated sprite until it gets to the target frame.
 * @param {integer} targetFrame - The target frame index.
 * @param {boolean} [animateAlways=true] - If `true` then will animate even if currently on the target frame.
 */
// PIXI.AnimatedSprite.prototype.playUntil = function(targetFrame, animateAlways = false){
//   this.loop = true;
//   if (this.currentFrame == targetFrame && !animateAlways){
//     return;
//   }
//   this.play();
//   this.onFrameChange = ()=>{
//     if (this.currentFrame === targetFrame){
//       this.stop();
//       this.onFrameChange = null;
//     }
//   }
// }

// Screen shake
// ------------

// const MAX_SHAKE_ROT = 2.0;
// const MAX_SHAKE_OFFSET_ART = 15.0*0.5;

/**
 * Will apply a cumulative screen shake and rotation.
 * <br>- Primarily developed to be applied to the current scene.
 * <br>- See: {@link https://youtu.be/tu-Qe66AvtY?t=660}
 * @param {number} traumaPerc - How much trauma/impact to apply in the range of 0.0 to 1.0.
 * @param {number} [maxFactor=1.0] - The shake limits will be multipled by this factor.
 * @param {number} [options=null] - Options
 * @param {boolean} [options.rotateOnly=false] - If true then position will not be animated.
 * @param {Array|DisplayObject} [extraTargets=false] - Any additional display objects that will be affected by the animation.
 */
// DisplayObject.prototype.applyShake = function(traumaPerc, maxFactor = 1.0, options = null, extraTargets = null){

//   let defaults = {
//       rotateOnly: false,
//   };
//   options = utils.extend(defaults, options);

//   let targets = [this];
//   if (extraTargets){
//     targets = targets.concat(Array.isArray(extraTargets) ? extraTargets : [extraTargets]);
//   }

//   if (typeof this._shake === 'undefined'){

//     this._shake = {};
//     this._shake.targets = targets;
//     this._shake.trauma = 0.0;
//     if (!options.rotateOnly){
//       if (this instanceof Scene){
//         this.setPivotWithoutMoving(scaler.stageW*0.5, scaler.stageH*0.5)
//         this._shake.origin = this.position.clone()
//       }
//     }
//     this._shake.kill = ()=>{

//       gsap.killTweensOf(targets); // Includes self
//       gsap.killTweensOf(targets[0]._shake)
//       for (let target of targets){ // Captured
//         target.rotation = 0.0;
//       }
//       if (!options.rotateOnly){
//         targets[0].position.copyFrom(targets[0]._shake.origin)
//         if (targets[0] instanceof Scene){
//           targets[0].setPivotWithoutMoving(0.0, 0.0); // Default
//         }
//       }
//       targets[0]._shake = null;
//       delete targets[0]._shake;

//     }
//   }

//   this._shake.trauma = Math.min(1.0, this._shake.trauma + traumaPerc); // Linear ease down
//   gsap.killTweensOf(this._shake);
//   gsap.to(this._shake, 1.0, {trauma:0.0, ease:Linear.easeNone, onUpdateParams:[targets], onUpdate:(targets)=>{
//     const shakeAmt = Math.pow(targets[0]._shake.trauma, 3); // Or 3
//     let tw = {};
//     tw.angle = maxFactor*MAX_SHAKE_ROT * shakeAmt * mutils.randFloatNegOneToOne()
//     if (!options.rotateOnly){
//       tw.x = targets[0]._shake.origin.x + maxFactor*MAX_SHAKE_OFFSET_ART * scaler.scale * shakeAmt * mutils.randFloatNegOneToOne()
//       tw.y = targets[0]._shake.origin.y + maxFactor*MAX_SHAKE_OFFSET_ART * scaler.scale * shakeAmt * mutils.randFloatNegOneToOne()
//     }
//     gsap.set(targets, tw);
//   }, onComplete:this._shake.kill})

// }

/**
 * Stops and disposes of any screenshake in progress.
 */
// DisplayObject.prototype.killShake = function(){

//   if (typeof this._shake !== 'undefined'){
//     this._shake.kill();
//   }
// }

// Simple Button
// -------------

/**
 * Converts the display object into a simple button.
 * @param {number} [clickCallback=null] - The function to call on click. If not set will fire `parent.onBtn()` or `parent.parent.onBtn()` if preset.
 * @param {number} [stateChangeCallback=null] - Will trigger callback on state change.
 */

// DisplayObject.prototype.makeBtn = function(clickCallback = null, stateChangeCallback = null){

//   const tintOn = 0x000000;;
//   this.interactive = true;
//   this.buttonMode = true;

//   const isContainer = !this.isSprite && !(this instanceof Graphics) && !(this instanceof Btn);
//   if (!stateChangeCallback){
//     if (isContainer){
//       const debugHitBtn = false;
//       // Add a layer to collect hit events for the button, as containers have no bounds.
//       const hit = new Sprite(debugHitBtn ? Texture.WHITE : Texture.EMPTY);
//       hit.name = '__btnhit';
//       hit.width = this.txInfo._proj.width;
//       hit.height = this.txInfo._proj.height;
//       hit.x = this.txInfo._proj.tlX - this.txInfo._proj.x;
//       hit.y = this.txInfo._proj.tlY - this.txInfo._proj.y;
//       this.addChild(hit);
//     }
//   }

//   this
//   .on('pointerdown', function(){

//     if (stateChangeCallback){
//       stateChangeCallback(true, this);
//     } else {
//       this.tint = tintOn;
//       if (isContainer){
//         for (const child of this.children){
//           if (child.isSprite){
//             child.tint = tintOn;
//           }
//         }
//       }
//     }

//     this.on('pointerupoutside', function(){
//       this.off('pointerup');
//       this.off('pointerupoutside');
//       if (stateChangeCallback){
//         stateChangeCallback(false, this);
//         return;
//       }
//       this.tint = 0xffffff;
//       if (isContainer){
//         for (const child of this.children){
//           if (child.isSprite){
//             child.tint = 0xffffff;
//           }
//         }
//       }
//     }, this)

//     this.on('pointerup', function(){
//       this.off('pointerup');
//       this.off('pointerupoutside');
//       if (stateChangeCallback){
//         stateChangeCallback(false, this);
//       } else {
//         this.tint = 0xffffff;
//         if (isContainer){
//           for (const child of this.children){
//             if (child.isSprite){
//               child.tint = 0xffffff;
//             }
//           }
//         }
//       }
//       if (clickCallback){
//         clickCallback(this);
//       } else if (typeof this.parent.onBtn === 'function'){
//         this.parent.onBtn.bind(this.parent)(this);
//       } else if (typeof this.parent.parent.onBtn === 'function'){
//         this.parent.parent.onBtn.bind(this.parent.parent)(this);
//       }
//     }, this)

//   }, this)

// }

/**
 * Resets and cleans up display object that was converted to button with `makeBtn()`.
 */
// DisplayObject.prototype.killBtn = function(){
//   this.off('pointerdown');
//   this.off('pointerupoutside');
//   this.off('pointerup');
//   this.interactive = false;
//   this.buttonMode = false;
//   let hit = this.getChildByName('__btnhit');
//   if (hit){
//     this.removeChild(hit);
//   }

// }
