/*

Usage:

import { createDebug, gui, shared as debug } from '@/game/core/debug.js';
createDebug();
debug?.destroy();

*/
import Stats from 'stats.js';
import GUI from 'lil-gui';

// import { shared as game } from '@/game/game'

const ACTIVATION_HASH = '#dev';

const SHOW_GUI_BY_DEFAULT = import.meta.env.DEV ? false : false;
const SHOW_GUI_IF_HASH_PRESENT = import.meta.env.DEV ? true : true;

const MONITOR_FPS_BY_DEFAULT = import.meta.env.DEV ? false : false;
const MONITOR_FPS_IF_HASH_PRESENT = import.meta.env.DEV ? false : false;

const LOGGING_ENABLED_BY_DEFAULT = import.meta.env.DEV ? true : false;
const LOGGING_ENABLED_IF_HASH_PRESENT = import.meta.env.DEV ? false : false;

// let debug = {
//   shared: null
// }
// export default debug;

export let gui;
export let stats;
export let shared;

let logState = {
  enabled: LOGGING_ENABLED_BY_DEFAULT,
};

// Title is only used if all 3 arguments are present.
export function log(idPrefix, title, val) {
  if (!logState.enabled) {
    return;
  }

  val = arguments[arguments.length - 1];

  if (arguments.length === 1) {
    idPrefix = null;
    title = null;
  }

  if (arguments.length === 2) {
    title = null;
  }

  if (idPrefix === 'phase_neutral') {
    // debugger
  }

  idPrefix = idPrefix ? `[${idPrefix}] ` : '';

  if (typeof val === 'function') {
    val = val();
  }

  if (typeof val !== 'string') {
    val = JSON.stringify(
      val,
      function (key, val) {
        if (typeof val === 'object' && typeof val.label === 'string') {
          return val.label; // PIXI object
        }
        return val;
      },
      2,
    );
  }

  if ((title || idPrefix) && val?.includes('\n')) {
    val = '\n' + val;
  }

  if (title) {
    title = `${title}: `;
  } else {
    title = '';
  }

  if (window) {
    window['con' + 'sole'].log(`${idPrefix}${title}${val}`);
  }
}

export function createDebug() {
  if (shared) {
    throw Error('[debug] Only 1 instance of debug can exist at a time');
  }

  const activationHashIsPresent = window.location.hash === ACTIVATION_HASH;

  if (activationHashIsPresent && LOGGING_ENABLED_IF_HASH_PRESENT) {
    logState.enabled = true;
  }

  if (
    SHOW_GUI_BY_DEFAULT ||
    (activationHashIsPresent && SHOW_GUI_IF_HASH_PRESENT)
  ) {
    gui = new GUI({ width: 320 });

    //const guiFolder = gui.addFolder(`debug`);
    gui
      .add(
        {
          monitorFPS: MONITOR_FPS_BY_DEFAULT,
        },
        'monitorFPS',
      )
      .name('monitor FPS')
      .onChange((enabled) => {
        monitorFPS(enabled);
      });

    gui
      .add(logState, 'enabled')
      .name('logging')
      .onChange((enabled) => {
        const enabledOG = enabled;
        if (!enabled) {
          logState.enabled = true;
        }
        log('debug', enabled ? 'Logging enabled' : 'Logging disabled');
        logState.enabled = enabledOG;
      });

    gui
      .add(
        {
          destroy: destroy,
        },
        'destroy',
      )
      .name('remove this panel');
  }

  if (
    MONITOR_FPS_BY_DEFAULT ||
    (activationHashIsPresent && MONITOR_FPS_IF_HASH_PRESENT)
  ) {
    // Otherwise will wait for FPS monitoring to be enabled via the GUI
    monitorFPS(true);
  }

  function monitorFPS(enable) {
    if (stats) {
      stats.dom.parentNode.removeChild(stats.dom);
      stats = null;
    }

    if (enable) {
      stats = new Stats();
      stats.showPanel(0);
      document.body.appendChild(stats.dom);
    }
  }

  // function onTickPre() {
  //   stats?.begin();
  // }

  // function onTickPost() {
  //   stats?.end();
  // }

  function destroy() {
    shared = null;

    if (gui) {
      gui.destroy();
      gui = null;
    }

    monitorFPS(false);
  }

  shared = {
    destroy,
  };
}
