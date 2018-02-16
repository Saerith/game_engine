define([
    "actor",
    "animation",
    "shotblast",
    "bullet",
    "terrain",
], function (
    Actor,
    Animation,
    Shotblast,
    Bullet,
    Terrain,
    ) {


        class Soldier_Shield extends Actor {

            constructor(game, x, y, img = null, ctx = null, scale = 3, spriteWidth = 50, spriteHeight = 50) {
                super(game, x, y, img, ctx);
                this.movementSpeed = 7;
                this.projectileSpeed = 5;

                this.scale = scale;
                this.spriteWidth = spriteWidth;
                this.spriteHeight = spriteHeight;

                this.centerX = x + ((spriteWidth * scale) / 2);
                this.boundWidth = 0;
                this.boundHeight = 0;
                this.boundX = this.centerX - (this.boundWidth / 2);
                this.boundY = this.y - this.boundHeight;


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
                    "idle":                 new Animation(this.img, [spriteWidth, spriteHeight], 0, 15, 5, 6, true, this.scale),
                    "turn":                 new Animation(this.img, [spriteWidth, spriteHeight], 0, 15, 13, 5, false, this.scale, 6),
                    "block":                new Animation(this.img, [spriteWidth, spriteHeight], 0, 15, 7, 4, true, this.scale, 11),
                    "run":                  new Animation(this.img, [spriteWidth, spriteHeight], 1, 12, 3, 12, true, this.scale), 
                    "shoot_startup":        new Animation(this.img, [spriteWidth, spriteHeight], 2, 18, 7, 5, false, this.scale),
                    "shoot_active":         new Animation(this.img, [spriteWidth, spriteHeight], 2, 18, 7, 5, false, this.scale, 5),
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
                    }
                }
                if (this.states.running) { //running
                    if (this.animation.loops > 3) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.running = false;
                        //for demo
                        this.states.shooting_startup = true;
                    }
                }
                if (this.states.shooting_startup) { //shooting start
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.shooting_startup = false;
                        this.states.shooting_active = true;                        
                    }
                }
                if (this.states.shooting_active) { //shooting active
                    if (!this.states.hasShot) {
                        //TODO: create a new "bullet" class to spawn projectile and activate animation

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
                    }
                }
                if (this.states.slashing_start) { //slashing start
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.slashing_start = false;
                        this.states.slashing_end = true;
                    }
                }
                if (this.states.slashing_end) { //slashing end
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.slashing_end = false;
                        //for demo
                        this.states.blocking = true;
                    }
                }
                if (this.states.blocking) { //blocking
                    if (this.animation.loops > 2) {
                        this.animation.elapsedTime = 0;
                        this.animation.loops = 0;
                        this.states.blocking = false;
                        //for demo                        
                        this.states.turning = true;
                    }
                }
                if (this.states.turning) { //turning
                    if (this.animation.isDone()) {
                        this.animation.elapsedTime = 0;
                        this.states.turning = false;
                        this.states.facingRight = !this.states.facingRight;
                        //for demo
                        this.states.idling = true;
                    }
                }
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
        }

        return Soldier_Shield;
    });