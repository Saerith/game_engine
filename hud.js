define([
    "asset-manager",
    'soldier-shield',
], function (
    AssetManager,
    Soldier_Shield,
){

    class Hud {

        constructor(img, hero) {
            this.img = img;
            this.hero = hero;
            this.healthbar = new healthbar(this.hero);
            this.energybar = new energybar(this.hero);

        }

        update() {

        }


    }

    class ResourceBar {

        constructor(game_engine, img, hero, src_coordinates, src_dimensions, dest_coordinates, scale=3) {
            this.game_engine = game_engine;
            this.hero = hero;
            this.img = img;
            this.src_coords = src_coordinates;
            this.src_dims = src_dimensions;
            this.dest_coords = dest_coordinates;
            // this.ctx = ctx;
            this.scale = scale;
            
        }

        draw(ctx) {
            ctx.drawImage(this.img, 
                    (col * this.width),
                    (row * this.height),
                    this.width,
                    this.height, 
                    this.x + (i * this.width), this.y,
                    this.width*this.scale, 
                    this.height*this.scale
                );
        }

        resourceBarSegment(img, src_coords, src_dims, dest_x_offset=0, dest_y_offset=0) {
                return {
                    "img": img,
                    "src_x": src_coords[0],
                    "src_y": src_coords[1],
                    "src_width": src_dims[0],
                    "src_height": src_dims[1],
                    "dest_x_offset": dest_x_offset,
                    "dest_y_offset": dest_y_offset,
                }
               
               // this.dest_x = dest_coords[0]
               // this.dest_y = dest_coords[1]
               // this.dest_width = dest_dimensions[0]
               // this.dest_height = dest_dimensions[1]
        }
    }


    /*
        Provides a health bar for the Hero.
        Constructed of resourceBarSegments, defined in ResourceBar.
        Health grows upward.
    */
    class HealthBar extends ResourceBar {

        constructor(game_engine, img, hero, src_coordinates, src_dimensions, dest_coordinates, scale=3) {
            super(game_engine, img, hero, src_coordinates, src_dimensions, dest_coordinates, scale=3);
            this.health = hero.health; // has room for 6 ticks
            this.width = 14; // the pixel art width

            // bar segments
            this.top = this.resourceBarSegment(img, 
                [src_coordinates[0], src_dimensions[1] + 0],
                [this.width, 3]);
            this.middle = this.resourceBarSegment(img, 
                [src_coordinates[0], src_coordinates[1] + 3],
                [this.width, 14]);
            this.bottom = this.resourceBarSegment(img, 
                [src_coordinates[0], src_coordinates[1] + 19],
                [this.width, 18]);
            this.tick = this.resourceBarSegment(img, 
                [src_coordinates[0] + 3, src_coordinates[1] + 16],
                [this.width-7, 3],
                9, 11);
            this.parts = [this.top, this.middle, this.bottom]

        }

        draw(ctx) {
            let lasty = 0;
            for (var i = 0; i < this.parts.length; i++) {
                let part = this.parts[i]
                this.drawPart(ctx, part, lasty);
                lasty = lasty + part["src_height"]; // this causes each segment to be drawn vertically on top of the last
            }

            lasty -= this.bottom["src_height"]
            for (var i = this.health; i > 0; i--) {
                this.drawPart(ctx, this.tick, lasty)
                lasty -= 2 // this causes health to grow upward 
            }
            console.log(this.dest_coords);

        }

        drawPart(ctx, part, lasty) {
            ctx.drawImage(this.img,
                part["src_x"], part["src_y"], // src x, y
                part["src_width"], part["src_height"], // src width, height
                this.dest_coords[0] + part["dest_x_offset"], this.dest_coords[1] + (lasty * this.scale) - part["dest_y_offset"], // dest x, y
                part["src_width"] * this.scale, part["src_height"] * this.scale, // dest width, height
            ) 
        }

        update() {
            this.dest_coords[0] = this.hero.x - 50;
            this.dest_coords[1] = this.hero.y - 200;

        }
        isColliding() {}
        collided() {}

    }

    class EnergyBar extends ResourceBar {

        constructor(img, hero) {
            super(img, hero);
            this.energy = hero.health;
        }
    }

    return {
        "HealthBar": HealthBar,
    };

});