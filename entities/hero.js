define([
    "actor",
    "animation",
    "terrain",
    "projectile",
    "projectile-sword",
    "soldier-shield",
    "enemy",
], function (
    Actor,
    Animation,
    Terrain,
    Projectile,
    Projectile_Sword,
    Soldier_Shield,
    Enemy,
){


    class Hero extends Actor {

        constructor (game, x, y, img=null, ctx=null, scale=3, spriteWidth=60, spriteHeight=60) {
            super(game, x, y, img, ctx);
            this.origY = this.y; //For jumping
            //this.y = y - spriteHeight*scale;
            this.movementSpeed = (8);

            this.jumpStrength = (20);
            this.jumpsLeft = 2;
            this.maxJumps = 2;
            this.jumpTimer = 0;
            this.jumpCooldown = 20;

            this.scale = scale;
            this.spriteWidth = spriteWidth;
            this.spriteHeight = spriteHeight;
            this.yVelocity = 0;

            this.centerX = x + ((spriteWidth * scale) / 2) - spriteWidth;
            this.boundWidth = 60;
            this.boundHeight = 110;
            this.boundX = this.centerX - (this.boundWidth / 2);
            //DS3 2/16: Frame height is no longer subtracted in order to align hitbox with animation (see animation class draw image func)
            this.boundY = this.y - this.boundHeight;
            this.lastBoundY = this.boundY; // This will help stop Hero from slipping at edges, particularly for horizontally longer blocks of terrain

            this.maxHealth = 6;
            this.maxEnergy = 6;
            this.energy = this.maxEnergy;
            this.health = this.maxHealth;

            this.states = {
                "running": false,
                "jumping": false,
                "shooting": false,
                "cleaving": false,
                "facingRight": true,
                "grounded": false,
                "slashing": false,
                "shotlocked": false,
                "energized": false,
            };
            this.animations = {
                "idle": new Animation(this.img, [spriteWidth, spriteHeight], 0, 9, 3, 9, true, this.scale), //50x50
                "run": new Animation(this.img, [spriteWidth, spriteHeight], 1, 22, 3, 11, true, this.scale), //50x50
                //Takeoff?
                "ascend": new Animation(this.img, [spriteWidth, spriteHeight], 2, 8, 3, 5, true, this.scale, 2), //50x50
                "descend": new Animation(this.img, [spriteWidth, spriteHeight], 2, 14, 3, 4, true, this.scale, 8), //50x50
                //Land?
                "airshoot": new Animation(this.img, [spriteWidth, spriteHeight], 2, 20, 3, 6, false, this.scale, 14), //50x50
                "shoot": new Animation(this.img, [80, 60], 3, 3, 6, 3, false, this.scale), //80x60
                "gunrun": new Animation(this.img, [60, 60], 1, 22, 3, 11, true, this.scale, 11), //50x50
                "slash": new Animation(this.img, [90, 60], 4, 11, 3, 11, false, this.scale), //80x50
                "cleave": new Animation(this.img, [100, 70], 9, 13, 3, 13, false, this.scale), //80x60
            };

        }


        drawOutline (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.rect(this.boundX, 
                this.boundY, 
                this.boundWidth, this.boundHeight);
            ctx.stroke();
            ctx.closePath();
        }


        drawImg (ctx) {
            this.drawOutline(ctx);
            if(this.yVelocity < 0) {
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
                
            } else {
                this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);


            }
        }


        draw (ctx) {
            if(this.yVelocity < 0) {
                this.animation = this.animations.ascending;
            }
            else if (this.yVelocity > 0) {
                this.animation = this.animations.descending;
            }
            else if (this.states.running && this.animation) {
                this.animation = this.animations.run;
            } else {
                this.animation = this.animations.idle;
            }
            this.drawImg(ctx);
            
        }

        update () {
            /////////// all button checks go here ///////////
            // check if button pressed
            // Moving left and right are mutually exclusive, thus else-if
            if (this.game.controlKeys[this.game.controls.right].active) { //run right
                if (!this.states.facingRight) { this.states.facingRight = true };
                this.states.running = true;
            } else if (this.game.controlKeys[this.game.controls.left].active) { //run left
                if (this.states.facingRight) { this.states.facingRight = false };
                this.states.running = true;
            }
            if (this.game.controlKeys[this.game.controls.energize].active) {
                this.states.energized = true;
            }
            if (this.game.controlKeys[this.game.controls.jump].active && !this.states.jumping) { // jump
                this.states.jumping = true;
            }
            if (this.game.controlKeys[this.game.controls.shoot].active) { //shoot
                this.states.shooting = true;
            }
            if (this.game.controlKeys[this.game.controls.cleave].active && !this.states.jumping && !this.states.shooting) { //cleave
                this.states.cleaving = true;
            }
            if (this.game.controlKeys[this.game.controls.slash].active && !this.states.jumping && !this.states.shooting) { //slash
                this.states.slashing = true;
            }

            // check if button NOT pressed, if state is supposed to change...
            if (!(this.game.controlKeys[this.game.controls.right].active || this.game.controlKeys[this.game.controls.left].active)
                && this.states.running) {
                this.states.running = false;
            }
            if (!this.game.controlKeys[this.game.controls.energize].active) {
                this.states.energized = false;
            }


            ///////////// THEN do actions //////////////
            if (this.jumpTimer > 0) {
                this.jumpTimer -= 1;
            }

            // Running
            if (this.states.running) {
                if (this.states.facingRight) {
                    this.x += this.movementSpeed;
                    this.centerX += this.movementSpeed;
                    this.boundX += this.movementSpeed;
                } else {
                    this.x -= this.movementSpeed;
                    this.centerX -= this.movementSpeed;
                    this.boundX -= this.movementSpeed;

                }
            }

            if (this.states.jumping) {
                this.states.jumping = false;

                if (this.jumpsLeft > 0 && this.jumpTimer == 0) {
                    this.jumpsLeft -= 1;
                    this.jumpTimer = this.jumpCooldown;
                    this.yVelocity = 0;
                    this.yVelocity -= this.jumpStrength;
                }
            }

            if (this.states.cleaving) {
                if (this.animation.isDone()) {
                    this.animation.elapsedTime = 0;
                    this.states.cleaving = false;
                }
            }

            if (this.states.shooting) {
                if (!this.states.shotlocked) {
                    if (this.energy >= 75 && this.states.energized) {
                        this.game.addEntity(new Projectile(this.game, this.x, this.y, this.img, this.ctx, this.scale, this.states.facingRight, this.states.energized))
                        this.energy -= 75;
                    }
                    else {
                        this.game.addEntity(new Projectile(this.game, this.x, this.y, this.img, this.ctx, this.scale, this.states.facingRight, false))
                    }
                    this.states.shotlocked = true;
                }
                if (this.animation.isDone()) {
                    this.animation.elapsedTime = 0;
                    this.states.shooting = false;
                    this.states.shotlocked = false;
                }
            }

            if (this.states.slashing) {
                if (this.animation.currentFrame() === 2 && this.states.energized && !this.states.shotlocked && this.energy >= 100) {
                    this.game.addEntity(new Projectile_Sword(this.game, this.x + 20, this.y, this.img, this.ctx, this.scale, this.states.facingRight));
                    this.states.shotlocked = true;
                    this.energy -= 100;
                }
                if (this.animation.isDone()) {
                    this.animation.elapsedTime = 0;
                    this.states.slashing = false;
                    this.states.shotlocked = false;
                }
            }

            if (this.energy < 200) {
                this.energy++;
            }

            // update velocities based on gravity and friction
            this.yVelocity += this.gravity * this.gravity;
            this.y += this.yVelocity;
            this.lastBoundY = this.boundY;
            this.boundY += this.yVelocity;

            if (this.health <= 0) {
                //this.removeFromWorld = true;
            }
        }

        draw(ctx) {
            if (this.yVelocity < 0 && !this.states.shooting) {//ascending
                this.updateHitbox(50, 50, 20, 35);
                this.animation = this.animations.ascend;
            }
            else if (this.yVelocity > 0 && !this.states.shooting) {//descending
                this.updateHitbox(50, 50, 20, 35);
                this.animation = this.animations.descend;
            }
            else if (this.states.running && this.animation && !this.states.shooting) {//gunrunning
                this.updateHitbox(50, 50, 20, 35);
                this.animation = this.animations.gunrun;
            }
            else if (this.states.shooting && this.yVelocity == 0 && this.animation) {//shooting

                this.updateHitbox(70, 50, 20, 35);
                this.animation = this.animations.shoot;
            }
            else if (this.states.shooting && this.yVelocity != 0 && this.animation) {//air shooting
                this.updateHitbox(50, 50, 20, 35);
                this.animation = this.animations.airshoot;
            }
            else if (this.states.cleaving && this.animation) {//cleaving
                this.updateHitbox(80, 60, 20, 35);
                this.animation = this.animations.cleave;
            }
            else if (this.states.slashing && this.animation) {//slashing
                this.updateHitbox(80, 50, 20, 35);
                this.animation = this.animations.slash;
            }
            else {
                this.updateHitbox(50, 50, 20, 35);
                this.animation = this.animations.idle;
            }
            this.drawImg(ctx);
        }


        collided(other, direction) {
            // collide with terrain
            if (other instanceof Terrain) {

                // Hero above terrain
                // TODO store lastBottom, when landing, check to see if lastBottom is above other.BoundX. if it is, I SHOULD land. else i slide off like a chump. might work? idk yet
                if (direction === 'bottom') {
                    this.boundY = other.boundY - this.boundHeight;
                    this.y = this.boundY + this.boundHeight; //DS3DRAWCHANGE1:
                    this.yVelocity = 0;
                    this.jumpsLeft = this.maxJumps;
                    this.states.jumping = false;
                }

                // Hero jumps into terrain
                else if (direction === 'top') {
                    this.boundY = other.boundY + other.boundHeight;
                    this.y = this.boundY + this.boundHeight;
                    this.lastBoundY = this.boundY;

                }

                // Hero collides with terrain to the left
                else if (direction === 'left') {
                    this.boundX = other.boundX + other.boundWidth;
                    this.x = this.boundX;
                }

                // Hero collides with terrain to the right
                else if (direction === 'right') {
                    this.boundX = other.boundX - this.boundWidth;
                    this.x = this.boundX;
                }
                //console.log(`${this.name} colliding with ${other.name} from ${direction}`);
            }

            if (other instanceof Enemy) {
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

        drawOutline (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.rect(this.boundX, 
                this.boundY, 
                this.boundWidth, this.boundHeight);
            ctx.stroke();
            ctx.closePath();
        }


        drawImg (ctx) {
            this.drawOutline(ctx);
            this.animation.drawFrame(1, ctx, this.x, this.y, this.states.facingRight);
        }
    }

    return Hero;
});



