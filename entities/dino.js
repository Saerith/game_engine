define([
    "enemy",
    "animation",
    "terrain",
    "projectile",
], function (
    Enemy,
    Animation,
    Terrain,
    Projectile,
    ) {


        class Dino extends Enemy {

            constructor(game, x, y, img = null, ctx = null, scale = 3, spriteWidth = 90, spriteHeight = 60) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 7;
                //for demo
                this.origy = this.y;
                this.origx = this.x;

                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2) - spriteWidth;
                this.boundWidth = 60*this.scale;
                this.boundHeight = 50*this.scale;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y - this.boundHeight + (this.spriteHeight/2 - 10); //DS3DRAWCHANGE2

                //Stats
                this.yVelocity = 3;
                this.health = 200;
                this.damage = 100;

                this.states = {
                    "idling": true,
                    "shooting": false,
                    "walking": false,
                    "grounded": false,
                    "facingRight": true,
                };
                this.animations = {
                    "idle":             new Animation(this.img, [90, 60], 6, 13, 25, 1, true, this.scale, 12),
                    "walk_straight":    new Animation(this.img, [90, 60], 6, 13, 15, 6, true, this.scale),
                    "walk_down":        new Animation(this.img, [90, 60], 6, 13, 15, 6, true, this.scale, 6),
                    "walk_up":          new Animation(this.img, [90, 70], 6, 12, 15, 6, true, this.scale),//90x70
                    "shoot_up":         new Animation(this.img, [90, 70], 6, 12, 15, 2, false, this.scale, 6),//90x70
                    "shoot_diagonal":   new Animation(this.img, [90, 70], 6, 12, 15, 2, false, this.scale, 8),//90x70
                    "shoot_straight":   new Animation(this.img, [90, 70], 6, 12, 15, 2, false, this.scale, 10),//90x70
                    
                };
                this.animation = this.animations.idle;
                //for demo
                this.direction = 0;
            }

            update() {
                if (this.states.idling) {
                    if (this.animation.loops > 3) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.idling = false;
                        //for demo
                        if (this.direction >= 3) {
                            this.direction = 0;
                        }
                        this.direction++;
                        this.states.walking = true;
                    }
                }
                if (this.states.walking) {
                    if (this.animation.loops > 1) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.walking = false;
                        //for demo
                        this.states.shooting = true;
                        this.states.facingRight = true;
                    }
                }
                if (this.states.shooting) {
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.shooting = false;                        
                        //for demo
                        this.states.idling = true;
                    }
                }
                this.yVelocity += this.gravity * this.gravity;
                this.y += this.yVelocity;
                this.lastBoundY = this.boundY;
                this.boundY += this.yVelocity;
            }

            draw(ctx) {
                if (this.states.idling) {
                    //console.log("idle");
                    this.animation = this.animations.idle;
                }
                if (this.states.walking && this.direction === 1) {
                    //console.log("walk straight");
                    this.animation = this.animations.walk_straight;
                }
                if (this.states.walking && this.direction === 2) {
                    //console.log("walk down");
                    this.animation = this.animations.walk_down;
                }
                if (this.states.walking && this.direction === 3) {
                    //console.log("walk up");
                    this.animation = this.animations.walk_up;
                }
                if (this.states.shooting && this.direction === 1) {
                    //console.log("shoot diagonal");
                    this.animation = this.animations.shoot_diagonal;   
                }
                if (this.states.shooting && this.direction === 2) {
                    //console.log("shoot straight");
                    this.animation = this.animations.shoot_straight;
                }
                if (this.states.shooting && this.direction === 3) {
                    //console.log("shoot up");
                    this.animation = this.animations.shoot_up;
                }
                if (this.health <= 0) {
                    this.removeFromWorld = true;
                }
                this.drawImg(ctx);
            }

            collided(other, direction) {

                if (other instanceof Terrain) {

                    if (direction === 'bottom') {
                        this.boundY = other.boundY - this.boundHeight;
                        this.y = this.boundY + this.boundHeight - 20; //fix magic number (drawn slightly below hitbox without the 20 offset)
                        this.yVelocity = 0;
                        this.jumpsLeft = this.maxJumps;
                        this.states.jumping = false;
                    }

                    else if (direction === 'top') {
                        this.boundY = other.boundY + other.boundHeight;
                        this.y = this.boundY + this.boundHeight;
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
                else if (other instanceof Projectile) {
                    this.health -= other.damage;
                }
            }


            updateHitbox(fWidth, fHeight, bWidth, bHeight) {
                this.centerX = this.x + ((fWidth * this.scale) / 2) - fWidth;
                this.boundWidth = this.scale * bWidth;
                this.boundHeight = this.scale * bHeight;
                this.boundX = this.centerX - this.boundWidth / 2;
                this.boundY = this.y - this.boundHeight;
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

        return Dino;
    });