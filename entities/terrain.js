define([
    'entity',
],function(
    Entity,
){


    class Terrain extends Entity {
         constructor (game, x, y, dimensions, img=null, ctx=null, scale=null, tiles=null) {
            super(game, x, y, img, ctx);
            this.states = null;
            this.animations = null;
            this.animation = null;
            this.tiles = tiles;
            this.scale = scale;
            this.src_width = dimensions[0];
            this.src_height = dimensions[1];
            this.boundX = this.x;
            this.boundY = this.y+6;
            this.boundWidth = 96;
            this.boundHeight = 96;
        }

        drawOutline (ctx) {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.rect(this.x, this.y, 
                this.boundWidth, this.boundHeight);
            ctx.stroke();
            ctx.closePath();
        }

        draw(ctx) {
            if (this.tiles != null) {
            for (var i = 0; i < 1; i++) {
                let col = this.tiles[0]
                let row = this.tiles[1]
                this.drawOutline(ctx);
                ctx.drawImage(this.img, 
                    (col * this.src_width),
                    (row * this.src_height),
                    this.src_width,
                    this.src_height, 
                    this.x, this.y,
                    this.src_width*3, 
                    this.src_height*3
                );
            }
            }
        }
        
        /*Updates the entity each game loop. i.e. what does this entity do? */
        update () {
            super.update();

        }
    } // end Terrain

    return Terrain;
});
