define([
    "enemy",
    "animation",
    "terrain",
], function (
    Enemy,
    Animation,
    Terrain,
    ) {


        class Crow extends Enemy {

            constructor(game, x, y, img = null, ctx = null, scale = 3, spriteWidth = 50, spriteHeight = 40) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 7;
                //for demo
                this.origy = this.y;
                this.origx = this.x;

                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2) - spriteWidth;
                this.boundWidth = this.scale*20;
                this.boundHeight = this.scale*15;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y - this.boundHeight;

                //Stats
                this.damage = 100;


                this.states = {
                    "flying": true,
                    "attacking": false,
                    "attacking_final": false,
                    "hurt": false,
                    "facingRight": true,
                };
                this.animations = {
                    "fly":          new Animation(this.img, [spriteWidth, spriteHeight], 8, 11, 10, 5, true, this.scale),
                    "attack":       new Animation(this.img, [spriteWidth, spriteHeight], 8, 11, 10, 3, false, this.scale, 5),
                    "attack_final": new Animation(this.img, [spriteWidth, spriteHeight], 8, 11, 5, 2, true, this.scale, 8),
                    "hurt":         new Animation(this.img, [spriteWidth, spriteHeight], 8, 11, 10, 1, true, this.scale, 10),
                };
                this.animation = this.animations.fly;
            }

            update() {
                if (this.states.flying) {
                    //this.updateHitbox(50, 40, 20, 15);
                    if (this.animation.loops > 3) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.flying = false;
                        //for demo
                        this.states.attacking = true;
                    }
                }
                if (this.states.attacking) {
                    this.y -= 1;
                    this.boundY -= 1;
                    this.x -= 2;
                    this.boundX -= 2;
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.attacking = false;
                        this.states.attacking_final = true;
                        //for demo
                        //this.states.hurt = true;
                    }
                }
                if (this.states.attacking_final) {
                    this.y += 3;
                    this.boundY += 3;
                    this.x += 5;
                    this.boundX += 5;
                    if (this.animation.loops > 3) {
                        this.states.attacking_final = false;
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.hurt = true;
                    }
                }
                if (this.states.hurt) {
                    if (this.animation.loops > 3) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.hurt = false;
                        this.states.flying = true;
                        this.y = this.origy;
                        this.x = this.origx;
                        this.updateHitbox(50, 40, 20, 15);
                    }
                }
            }

            draw(ctx) {
                if (this.states.flying) {
                    this.animation = this.animations.fly;
                }
                if (this.states.attacking) {
                    this.animation = this.animations.attack;
                }
                if (this.states.attacking_final) {
                    this.animation = this.animations.attack_final;
                }
                if (this.states.hurt) {
                    this.animation = this.animations.hurt;
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

            collided(other) {
                // collide with terrain
                if (other instanceof Terrain) {
                    this.y = other.boundY - this.spriteHeight * this.scale;
                    this.boundY = other.boundY - this.boundHeight;
                    this.yVelocity = 0;
                    this.jumpsLeft = this.maxJumps;
                    this.states.jumping = false;
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
                this.drawOutline(ctx);
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
            }
        }

        return Crow;
    });