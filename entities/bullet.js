define([
    'actor',
    'animation',
], function (
    Actor,
    Animation,
    ) {


        class Bullet extends Actor {

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

                this.states = {
                    "active": true,
                    "facingRight": !facingRight,
                };
                this.animations = {
                    "bullet": new Animation(this.img, [spriteWidth, spriteHeight], 2, 18, 20, 2, true, this.scale, 16),
                };
                this.animation = this.animations.bullet;
            }

            update() {
                //TODO

                if (this.states.active) {
                    if (this.states.facingRight) {
                        this.x += this.movementSpeed;
                    } else {
                        this.x -= this.movementSpeed;
                    }
                    if (this.animation.loops > 1) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.steady = false;
                        this.removeFromWorld = true;
                    }
                }
            };

            draw(ctx) {
                if (this.states.active) {
                    this.animation = this.animations.bullet;
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

        return Bullet;
    });
