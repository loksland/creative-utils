import { Howl } from 'howler';
import * as PIXI from 'pixi.js';

/*
manifest:
alias: 'sfx',
src: 'game/sfx.mp3',
data: {
  sprite: {
    laser: [4000, 1000]
  }
}
...
loadedAudio.play('laser');
*/
export const HowlerPixiLoaderMiddleware = {
  extension: {
    name: 'Howler Loader Parser',
    priority: PIXI.LoaderParserPriority.Normal,
    type: PIXI.ExtensionType.LoadParser,
  },
  test(url) {
    return (
      PIXI.utils.path.extname(url).includes('.mp3') ||
      PIXI.utils.path.extname(url).includes('.wav') ||
      PIXI.utils.path.extname(url).includes('.ogg') ||
      PIXI.utils.path.extname(url).includes('.mpeg')
    );
  },
  async load(url, resolvedAsset) {
    return new Promise((resolve, reject) => {
      const howl = new Howl({
        src: [url],
        onload: () => resolve(howl),
        onloaderror: (id, message) => reject(message),
        sprite: resolvedAsset.data.sprite,
      });
    });
  },
  unload(asset) {
    asset.unload();
  },
};
