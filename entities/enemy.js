define([
    "actor",
    "animation",
], function (
    Actor,
    Animation,
    ) {


        class Enemy extends Actor {

            constructor(game, x, y, img = null, ctx = null, scale = 3, spriteWidth, spriteHeight) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 0;
                //for demo
            }

            update() {
                super.update();
            }
        }
        return Enemy;
    });