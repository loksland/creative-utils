/*

Usage:
import { createFullscreen, shared as fullscreen } from '@/game/utils/fullscreen.js';

fullscreen.shared.emitter.on('change', (state) => {
  console.log({ state })
}) 

fullscreen.toggle();

*/

import EventEmitter from 'eventemitter3';
import * as dom from './dom.js';

export let shared;

// createGame
// - Needs to be called when dom root element (& DOM) is present.
export function createFullscreen({ target = null, bodyClassName = null } = {}) {
  if (shared) {
    throw Error(
      '[fullscreen] Only 1 instance of fullscreen can exist at a time',
    );
  }

  target = target ? target : document.body;

  const emitter = new EventEmitter();
  document.addEventListener('fullscreenchange', onChange);

  // eslint-disable-next-line no-unused-vars
  function onChange(ev) {
    if (isFullscreen()) {
      if (bodyClassName) {
        dom.addClass(document.body, bodyClassName);
      }
      emitter.emit('change', true);
    } else {
      if (bodyClassName) {
        dom.removeClass(document.body, bodyClassName);
      }
      emitter.emit('change', false);
    }
  }

  function toggle(forceState = null) {
    let toggle = true;
    if (forceState === true || forceState === false) {
      if (forceState === isFullscreen()) {
        return;
      }
      toggle = false;
    }

    if ((toggle && !isFullscreen()) || (!toggle && forceState)) {
      const requestFullScreen =
        target.requestFullscreen ||
        target.mozRequestFullScreen ||
        target.webkitRequestFullScreen ||
        target.msRequestFullscreen;
      if (requestFullScreen) {
        requestFullScreen.call(target);
      }
    } else {
      const cancelFullScreen =
        document.exitFullscreen ||
        document.mozCancelFullScreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
      if (cancelFullScreen) {
        cancelFullScreen.call(document);
      }
    }
  }

  function enter() {
    toggle(true);
  }

  function exit() {
    toggle(false);
  }

  function destroy() {
    target = null;
    shared = null;
    emitter.removeAllListeners();
    toggle(false);
    document.removeEventListener('fullscreenchange', onChange);
  }

  function isSupported() {
    return document.fullscreenEnabled ||
      document.mozFullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.msFullscreenEnabled
      ? true
      : false;
  }

  function getFullscreenElement() {
    if (!isSupported()) {
      return false;
    }
    return (
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
  }

  function isFullscreen() {
    if (!isSupported()) {
      return false;
    }
    return getFullscreenElement() ? true : false;
  }

  shared = {
    emitter,
    toggle,
    enter,
    exit,
    isFullscreen,
    destroy,
  };

  return shared;
}
