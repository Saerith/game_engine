define([
    'actor',
    'animation',
], function (
    Actor,
    Animation,
    ) {


        class Shotblast extends Actor {

            constructor(game, x, y, img = null, ctx = null, scale = 3, facingRight, spriteWidth = 50, spriteHeight = 50) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 7;
                if (!facingRight) { this.x += 100; } else { this.x -= 100 };//offset to match gun
                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2);
                this.boundWidth = 0;
                this.boundHeight = 0;
                this.boundX = this.centerX - (this.boundWidth / 2);

                this.boundY = this.y - this.boundHeight - 500;

                //Stats

                this.states = {
                    "active": true,
                    "facingRight": !facingRight,
                };
                this.animations = {
                    "shotblast": new Animation(this.img, [spriteWidth, spriteHeight], 2, 18, 4, 6, false, this.scale, 10),
                };
                this.animation = this.animations.shotblast;
            }

            update() {
                //TODO
                
                if (this.states.active) {
                    if (this.animation.isDone()) {

                        this.animation.elapsedTime = 0;
                        this.states.active = false;
                        this.removeFromWorld = true;
                    }
                }
            };

            draw(ctx) {
                if (this.states.active) {
                    this.animation = this.animations.shotblast;
                }
                this.drawImg(ctx);
            }

            drawOutline(ctx) {
                ctx.beginPath();
                ctx.strokeStyle = "green";
                ctx.rect(this.boundX,
                    this.boundY,
                    this.boundWidth, this.boundHeight);
                ctx.stroke();
                ctx.closePath();
            }


            drawImg(ctx) {
                this.drawOutline(ctx);
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
            }
        }

        return Shotblast;
    });