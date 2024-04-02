
// The clock class binds the the shared PIXI ticker.

import EventEmitter from 'eventemitter3';
import * as PIXI from 'pixi.js';

class ClockClass extends EventEmitter {

  constructor(){
    super();
    this.tick = this.tick.bind(this);
  }

  attach(){ // The class that attaches should detach() too.
    PIXI.Ticker.shared.remove(this.tick);
    PIXI.Ticker.shared.add(this.tick); 
    PIXI.Ticker.shared.start();
  }

  tick(dt){
    this.emit('tick.pre')
    this.emit('tick', dt)
    this.emit('tick.post')
  }

  pause(enabled){
    if (enabled){
      PIXI.Ticker.shared.stop();
    } else {
      PIXI.Ticker.shared.start();
    }
  }

  detach(){
    this.pause(true);
    PIXI.Ticker.shared.remove(this.tick);
    this.removeAllListeners();
  }
}

export const clock = new ClockClass(); // Singleton
