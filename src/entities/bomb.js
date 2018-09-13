//row 9, 40x30, offset 11, 4 frames
define([
    "enemy",
    "animation",
    "terrain",
    "hurtbox",
    "projectile",

], function (
    Enemy,
    Animation,
    Terrain,
    Hurtbox,
    Projectile,
    ) {


    class Bomb extends Enemy {

        constructor(game, x, y, img = null, ctx = null, scale = 3, spriteWidth = 40, spriteHeight = 30, facingRight = false,
                        /*Unique to Bomb*/xVelocity = 7, yVelocity = -20) {
            super(game, x, y, img, ctx);
            this.parentClass = "Enemy";
            this.xVelocity = xVelocity;

            this.scale = scale;
            this.spriteWidth = spriteWidth;
            this.spriteHeight = spriteHeight;

            this.centerX = x + ((spriteWidth * scale) / 2) - spriteWidth;
            this.boundWidth = this.scale * 20;
            this.boundHeight = this.scale * 15;
            this.boundX = this.centerX - (this.boundWidth / 2);
            this.boundY = this.y - this.boundHeight + 15;

            //Stats
            this.sightRadius[0] = 500;
            this.sightRadius[1] = 700;
            this.health = 50;
            this.damage = 0;
            this.launchtime = 25;
            this.countdown = 4;
            this.startup = 3;
            this.yVelocity = yVelocity;
            this.friction = .03;

            this.states = {
                "active": false,
                "launching": true,
                "activating": false,
                "detonating": false,
                "exploding": false,
                "exploded": false,
                "reflected": false,
                "facingRight": facingRight,
            };
            this.animations = {
                "launch": new Animation(this.img, [spriteWidth, spriteHeight], 9, 17, 5, 1, true, this.scale, 11),
                "activate": new Animation(this.img, [spriteWidth, spriteHeight], 9, 17, 7, 2, true, this.scale, 12),
                "detonate": new Animation(this.img, [spriteWidth, spriteHeight], 9, 17, 6, 1, true, this.scale, 14),
                "explode": new Animation(this.img, [60, 60], 4, 17, 5, 7, false, this.scale + 3, 10),
            };
            if (this.states.facingRight) { this.facing = 1; } else { this.facing = -1; }
            this.animation = this.animations.launch;
        }

        update() {
            if (this.states.launching) {
                this.updatePos(this.facing*this.xVelocity, 0);
            }
            if (this.states.activating) {
                this.updatePos(this.facing * this.xVelocity, 0);
                if (this.animation.loops > this.countdown) {
                    this.animation.reset();
                    this.states.activating = false;
                    this.states.detonating = true;
                }
            }
            if (this.states.detonating) {
                //This "Facing Hero" check makes sure that, if Hero crosses axis before explosion,
                //Hero will be pushed back in the correct direction on stun
                if (this.x - this.game.hero.x < 0) {
                    this.states.facingRight = true;
                    this.facing = 1;
                }
                else {
                    this.states.facingRight = false;
                    this.facing = -1;
                }
                if (this.animation.loops > this.startup) {
                    //Spawn explosion hurtbox
                    this.animation.reset();
                    this.states.detonating = false;
                    this.states.exploding = true;
                }
            }
            if (this.states.exploding) {
                if (!this.states.exploded) {
                    this.spriteHeight = 60;
                    this.spriteWidth = 60;
                    this.states.facingRight = true;
                    this.x -= 2 * this.spriteWidth - 30;
                    this.y += 30;
                    var explosionX = 150;
                    var explosionY = 150;
                    this.game.playSound("explosion_1")
                    var hurtbox = new Hurtbox(this.game, this.ctx, this.boundX, this.boundY, -1.75 * explosionX + 10, this.spriteHeight - 20,
                        this.spriteWidth, this.spriteHeight, explosionX, explosionY, this.scale + 2, Math.max(4, this.damage), this.states.facingRight, !this.states.reflected, "health", 15);
                    hurtbox.parent = this.name;
                    this.game.addEntity(hurtbox);
                    this.states.exploded = true;
                }
                if (this.animation.isDone()) {
                    this.removeFromWorld = true;
                }
            }

            if (!this.states.exploding) {
                this.yVelocity += this.gravity * this.gravity;
                this.lastBoundY = this.boundY;
                this.updatePos(0, this.yVelocity);
            }

            if (this.health <= 0) {
                this.removeFromWorld = true;
            }
        }

        draw(ctx) {
            if (this.states.launching) {
                this.animation = this.animations.launch;
            }
            if (this.states.activating) {
                this.animation = this.animations.activate;
            }
            if (this.states.detonating) {
                this.animation = this.animations.detonate;
            }
            if (this.states.exploding) {
                this.animation = this.animations.explode;
            }
            this.drawImg(ctx);
        }

        updateHitbox(fWidth, fHeight, bWidth, bHeight) {
            this.centerX = this.x + ((fWidth * this.scale) / 2) - fWidth;
            this.boundWidth = this.scale * bWidth;
            this.boundHeight = this.scale * bHeight;
            this.boundX = this.centerX - this.boundWidth / 2;
            this.boundY = this.y - this.boundHeight;
        }

        collided(other, direction) {
            // collide with terrain
            if (other.name === "Terrain") {
                //TODO Add collision with terrain
                if (direction === 'bottom' && !this.states.exploding) {
                    this.boundY = other.boundY - this.boundHeight;
                    this.y = this.boundY + this.boundHeight - 10;
                    this.yVelocity = 0;
                    if (this.xVelocity > 0) {
                        if (this.states.facingRight) {
                            this.xVelocity -= this.facing * this.xVelocity * this.friction;
                        }
                        else {
                            this.xVelocity += this.facing * this.xVelocity * this.friction;
                        }
                    }
                    if (this.states.launching) {
                        this.animation.reset();
                        this.states.launching = false;
                        this.states.activating = true;
                    }
                }
                else if (direction === 'top') {
                    this.boundY = other.boundY + other.boundHeight;
                    this.y = this.boundY + this.boundHeight - 10;
                    this.yVelocity = 0;
                    this.lastBoundY = this.boundY;
                }
                else if (direction === 'left') {
                    this.boundX = other.boundX + other.boundWidth;
                    this.x = this.boundX;
                }
                else if (direction === 'right') {
                    this.boundX = other.boundX - this.boundWidth;
                    this.x = this.boundX;
                }
            }
            if (other.name === "Projectile") {
                this.states.launching = false,
                this.states.activating = false;
                this.states.detonating = false;
                this.states.exploding = true;
                this.gravity = 0;
                this.yVelocity = 0;
            }
            if (other.name === "Hurtbox") {
                if (!other.isEnemy) {
                    //If hero is cleaving, do...
                        //Hit bomb away
                    //Else
                    this.states.launching = false,
                    this.states.activating = false;
                    this.states.detonating = false;
                    this.states.exploding = true;
                    this.gravity = 0;
                    this.yVelocity = 0;
                }
            }
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
            this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
            if (this.game.drawBoxes) {
                this.drawOutline(ctx);
            }
        }
    }
    return Bomb;
});