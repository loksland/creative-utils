export let shared;

export function createKeyboard() {
  const keyDownList = {};

  function listen(enabled) {
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);

    if (!enabled) {
      return;
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
  }

  function onKeyDown(ev) {
    keyDownList[ev.keyCode] = true;
  }

  function onKeyUp(ev) {
    keyDownList[ev.keyCode] = false;
  }

  function isKeyDown(keyCode) {
    return keyDownList[keyCode];
  }

  // function kill() {
  //   listen(false);
  //   shared = null;
  // }

  listen(true);

  shared = {
    isKeyDown,
  };

  return shared;
}
