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

                this.centerX = x + ((spriteWidth * scale) / 2);
                this.boundWidth = 90*this.scale;
                this.boundHeight = 60*this.scale;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y - this.boundHeight; //DS3DRAWCHANGE2

                this.health = 200;

                this.states = {
                    "idling": true,
                    "shooting": false,
                    "walking": false,
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

            collided(other) {
                // collide with terrain
                if (other instanceof Projectile) {
                    this.health -= 50;
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

        return Dino;
    });