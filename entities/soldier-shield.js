define([
    "enemy",
    "animation",
    "shotblast",
    "bullet",
    "terrain",
    "projectile",
], function (
    Enemy,
    Animation,
    Shotblast,
    Bullet,
    Terrain,
    Projectile,
    ) {


        class Soldier_Shield extends Enemy {

            constructor(game, x, y, img = null, ctx = null, scale = 3, spriteWidth = 50, spriteHeight = 50) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 7;
                this.yVelocity = 0;

                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2) - spriteWidth;
                this.boundWidth = this.scale*45;
                this.boundHeight = this.scale * 45;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y - this.boundHeight + (this.spriteHeight / 2 - 10);

                //Stats
                this.health = 400;
                this.damage = 50;

                this.states = {
                    "idling": true,
                    "running": false,
                    "shooting_startup": false,
                    "shooting_active": false,
                    "hasShot": false,
                    "slashing_start": false,
                    "slashing_end": false,
                    "blocking": false,
                    "turning": false,
                    "facingRight": false,
                };
                this.animations = {
                    "idle":                 new Animation(this.img, [spriteWidth, spriteHeight], 0, 15, 3, 6, true, this.scale),
                    "turn":                 new Animation(this.img, [spriteWidth, spriteHeight], 0, 15, 3, 5, false, this.scale, 6),
                    "block":                new Animation(this.img, [spriteWidth, spriteHeight], 0, 15, 3, 4, true, this.scale, 11),
                    "run":                  new Animation(this.img, [spriteWidth, spriteHeight], 1, 12, 3, 12, true, this.scale), 
                    "shoot_startup":        new Animation(this.img, [spriteWidth, spriteHeight], 2, 18, 3, 5, false, this.scale),
                    "shoot_active":         new Animation(this.img, [spriteWidth, spriteHeight], 2, 18, 3, 5, false, this.scale, 5),
                    "slash_start":          new Animation(this.img, [80, 60], 3, 9, 7, 9, false, this.scale),
                    "slash_end":            new Animation(this.img, [100, 60], 4, 11, 7, 7, false, this.scale),
                };
                this.animation = this.animations.idle;
            }

            update() {
                if (this.states.idling) { //idling                   
                    if (this.animation.loops > 3) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.idling = false;
                        //for demo
                        this.states.running = true;
                        //this.updateHitbox(50, 50, 45, 45);
                    }
                }
                if (this.states.running) { //running
                    if (this.animation.loops > 3) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.running = false;
                        //for demo
                        this.states.shooting_startup = true;
                        //this.updateHitbox(50, 50, 45, 45);
                    }
                }
                if (this.states.shooting_startup) { //shooting start
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.shooting_startup = false;
                        this.states.shooting_active = true;
                        //this.updateHitbox(50, 50, 45, 45);
                    }
                }
                if (this.states.shooting_active) { //shooting active
                    if (!this.states.hasShot) {
                        this.game.addEntity(new Shotblast(this.game, this.x, this.y, this.img, this.ctx, this.scale, this.states.facingRight));
                        this.game.addEntity(new Bullet(this.game, this.x, this.y, this.img, this.ctx, this.scale, this.states.facingRight));
                        this.states.hasShot = true;
                    }
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.shooting_active = false;
                        this.states.hasShot = false;
                        //for demo
                        this.states.slashing_start = true;
                        this.updateHitbox(80, 60, 80, 50);
                    }
                }
                if (this.states.slashing_start) { //slashing start
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.slashing_start = false;
                        this.states.slashing_end = true;
                        this.updateHitbox(100, 60, 80, 50);
                    }
                }
                if (this.states.slashing_end) { //slashing end
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.slashing_end = false;
                        //for demo
                        this.states.blocking = true;
                        this.updateHitbox(50, 50, 45, 45);
                    }
                }
                if (this.states.blocking) { //blocking
                    //this.UpdateHitbox(50, 50, 45, 45);
                    if (this.animation.loops > 2) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.blocking = false;
                        //for demo                        
                        this.states.turning = true;
                        //this.updateHitbox(50, 50, 45, 45);
                    }
                }
                if (this.states.turning) { //turning
                    //this.UpdateHitbox(50, 50, 45, 45);
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.turning = false;
                        this.states.facingRight = !this.states.facingRight;
                        //for demo
                        console.log(this.states.facingRight);
                        this.states.idling = true;
                        //this.updateHitbox(50, 50, 45, 45);
                    }
                }
                this.yVelocity += this.gravity * this.gravity;
                this.y += this.yVelocity;
                this.lastBoundY = this.boundY;
                this.boundY += this.yVelocity;

                if (this.health <= 0)
                    this.removeFromWorld = true;
            }

            draw(ctx) {
                if (this.states.idling) {
                    this.animation = this.animations.idle;
                }
                if (this.states.running) {
                    this.animation = this.animations.run;
                }
                if (this.states.shooting_startup) {
                    this.animation = this.animations.shoot_startup;
                }
                if (this.states.shooting_active) {
                    this.animation = this.animations.shoot_active;
                }
                if (this.states.slashing_start) {
                    this.animation = this.animations.slash_start;
                }
                if (this.states.slashing_end) {
                    this.animation = this.animations.slash_end;
                }
                if (this.states.blocking) {
                    this.animation = this.animations.block;
                }
                if (this.states.turning) {
                    this.animation = this.animations.turn;
                }
                this.drawImg(ctx);
            }

            //used to easily update hitbox based on state/animation
            updateHitbox(fWidth, fHeight, bWidth, bHeight) {
                this.centerX = this.x + ((fWidth * this.scale) / 2) - fWidth;
                this.boundWidth = this.scale*bWidth;
                this.boundHeight = this.scale*bHeight;
                this.boundX = this.centerX - this.boundWidth/2;
                this.boundY = this.y - this.boundHeight + (fHeight / 2 - 10);
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
                if (other instanceof Projectile) {
                    this.health -= other.damage;
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
        return Soldier_Shield;
    });