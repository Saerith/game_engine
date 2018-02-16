define([
    'actor',
    'animation',
], function (
    Actor,
    Animation,
    ) {


        class Projectile_Sword extends Actor {

            constructor(game, x, y, img = null, ctx = null, scale = 3, facingRight, spriteWidth = 90, spriteHeight = 60) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 10;
                if (facingRight) { this.x += 95; } else { this.x -= 95 };//offset to match gun
                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2);
                this.boundWidth = 0;
                this.boundHeight = 0;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y - this.boundHeight;

                this.states = {
                    "starting": true,
                    "stablized": false,
                    "recovering": false,
                    "facingRight": facingRight
                };
                this.animations = {
                    "start": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 4, 18, 2, 2, false, this.scale, 11),
                    "stable": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 4, 18, 6, 1, true, this.scale, 13),
                    "recovery": new Animation(this.img, [this.spriteWidth, this.spriteHeight], 4, 18, 6, 4, false, this.scale, 14),
                };
                this.animation = this.animations.start;
            }

            update() {
                //TODO
                if (this.states.facingRight) { this.x += this.movementSpeed; } else { this.x -= this.movementSpeed; }
                if (this.states.starting) {
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.starting = false;
                        this.states.stablized = true;
                    }
                }
                else if (this.states.stablized) {
                    if (this.animation.loops > 1) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.stablized = false;
                        this.states.recovering = true;
                    }
                }
                else if (this.states.recovering) {
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.removeFromWorld = true;
                    }
                }
            };

            draw(ctx) {
                if (this.states.starting) {
                    this.animation = this.animations.start;
                }
                if (this.states.stablized) {
                    this.animation = this.animations.stable;
                }
                else if (this.states.recovering) {
                    this.animation = this.animations.recovery;
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

        return Projectile_Sword;
    });
