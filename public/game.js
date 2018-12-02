export default class Game{
    constructor(socket,container){
        this.app = new PIXI.Application(640,480, { backgroundColor: 0xF0F0F0});
        this.stage = this.app.stage
        container.append(this.app.view);
        console.log(this.app.renderer instanceof PIXI.WebGLRenderer);

        let up = keyboard("ArrowUp");
        let down = keyboard("ArrowDown");
        let left = keyboard("ArrowLeft");
        let right = keyboard("ArrowRight");
        
        var debugTextStyle = new PIXI.TextStyle();
        debugTextStyle.fontSize = 14

        var velText = new PIXI.Text();
        velText.style = debugTextStyle
        velText.x = 20
        velText.y = 40
        var accelText = new PIXI.Text();
        accelText.style = debugTextStyle
        accelText.x = 20
        accelText.y = 60
        var posText = new PIXI.Text();
        posText.style = debugTextStyle
        posText.x = 20
        posText.y = 20
        this.stage.addChild(velText)
        this.stage.addChild(accelText)
        this.stage.addChild(posText)
        var player = new Player(this.app.screen.width/2, 100,this.app.screen.width, this.app.screen.height, 0xF0F000)
        this.stage.addChild(player.sprite)

        this.app.ticker.add(function(delta){
            player.update(delta)
            velText.text = player.vel.toString()
            accelText.text = player.accel.toString()
            posText.text = player.pos.toString()
        })

        up.press = () => {
            player.accel.y -= 4
        }
        up.release = () => {
            player.accel.y += 4
        }
        down.press = () => {
            player.accel.y += 4
        }
        down.release = () => {
            player.accel.y -= 4
        }
        left.press = () => {
            player.accel.x -= 4
        }
        left.release = () => {
            player.accel.x += 4
        }
        right.press = () => {
            player.accel.x += 4
        }
        right.release = () => {
            player.accel.x -= 4
        }
    } 
}

class Player{
  constructor(posx, posy,boundsx, boundsy, tint){
    this.tint = tint
    this.boundsx = boundsx
    this.boundsy = boundsy
    this.sprite = PIXI.Sprite.fromImage("/assets/senzoface2.png");
    this.sprite.tint = tint
    this.sprite.anchor.set(0.5,1)
    this.pos = new Victor(posx, posy)
    this.accel = new Victor(0,0)
    this.vel = new Victor(0,0)
    this.sprite.x = posx
    this.sprite.y = posy
    this.sprite.scale.x = 0.5
    this.sprite.scale.y = 0.5
  }

  update(delta){
    this.vel.add(this.accel)
    this.vel.multiply(new Victor(0.8,0.8))
    if(this.vel.length() < 0.3){
      this.vel.x = 0
      this.vel.y = 0
    }
    this.pos.add(this.vel)
    if(this.pos.x <= 0){
      this.pos.x = 0;
      this.vel.x = 0;
    }
    if(this.pos.x >= this.boundsx){
      this.pos.x = this.boundsx;
      this.vel.x = 0;
    }
    if(this.pos.y - 50 <= 0){
      this.pos.y = 50;
      this.vel.y = 0;
    }
    if(this.pos.y >= this.boundsy){
      this.pos.y = this.boundsy
      this.vel.y = 0;
    }
    this.sprite.x = this.pos.x
    this.sprite.y = this.pos.y
  }

}

function keyboard(value) {
  let key = {};
  key.value = value;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.key === key.value) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.key === key.value) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
      event.preventDefault();
    }
  };

  //Attach event listeners
  const downListener = key.downHandler.bind(key);
  const upListener = key.upHandler.bind(key);
  
  window.addEventListener(
    "keydown", downListener, false
  );
  window.addEventListener(
    "keyup", upListener, false
  );
  
  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener("keydown", downListener);
    window.removeEventListener("keyup", upListener);
  };
  
  return key;
}