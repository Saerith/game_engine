// JavaScript source code
define([
    'asset-manager',
    'game-engine',
    "game-board",
    "camera",
    "hud",
    "entity",
    "terrain",
    "background",
    "hero",
    "leo",
    "flames",
    "soldier-shield",
    "dino",
    "crow",
    "bullet",
    "shotblast",
    "enemy",
    "hurtbox",
    "item",
    "hand",
    "hazards",
    "sound"
], function (
    AssetManager,
    GameEngine,
    GameBoard,
    Camera,
    Hud,
    Entity,
    Terrain,
    Background,
    Hero,
    Leo,
    Flames,
    Soldier_Shield,
    Dino,
    Crow,
    Bullet,
    Shotblast,
    Enemy,
    Hurtbox,
    Item,
    Hand,
    Hazards,
    Sound
) {

    class LevelOne {

        /* Define terrain */
        constructor(gameEngine, assetManager, ctx) {

            //instance variables
            this.gameEngine = gameEngine;
            this.assetManager = assetManager;
            this.ctx = ctx;
            this.tilesheet = assetManager.getAsset("img/pipes.png");
            this.levelNum = 1;
            this.sectionNum;
            this.checkpoints = [[15, 1824], [3870, 0]];
            this.camVals = [[2, 1.5], [2, 1.5]];
            this.camSpeeds = [[7, 7], [7, 7]];
            this.activatedCheckpoints = [true, false, false, false];
            this.nextLevel = 2;
            this.activatedCheckpoints = [true, false]

            this.tileSize = 96;

            this.tileMap = {
                ' ': null,
                // '\n': null,
                'i': [0, 6],
                '!': [1, 0],
                '[': [1, 4],
                '<': [1, 6],
                '{': [2, 0],
                '>': [2, 6],
                '_': [3, 0],
                '#': [3, 1],
                '-': [3, 4],
                '}': [4, 0],
                'j': [4, 3],
                '|': [4, 6],
                'l': [2, 3],
                '~': [6, 0],
                ']': [6, 3],
            }
            this.tileDimensions = {
                //boundWidth, boundHeight, offX, offY
                'i': [16, 32, 44, 0],
                '!': [16, 32, 44, 0],
                '[': [32, 32, 0, 0],
                '<': [16, 16, 44, 24],
                '{': [32, 32, 0, 0],
                '>': [16, 16, 0, 24],
                '_': [32, 32, 0, 0],
                '#': [32, 32, 0, 0],
                '-': [32, 32, 0, 0],
                '}': [32, 32, 0, 0],
                'j': [32, 32, 0, 0],
                '|': [16, 32, 4, 0],
                'l': [32, 32, 0, 0],
                '~': [32, 16, 0, 24],
                ']': [32, 32, 0, 0],
            }
            // 20 lines from top to bottom
            this.map =
`{_____________________________}   {}   {_}                                                        
l-----------------------------j   []   l-j 
!                              {} []
!                              lj []
!   {________}                    []
!   l--------j                    []
!             {}    {}      {____}[]
!             lj    lj      l----j[]
<~~~~~~~~~>                      |[]
          {}                     |[]               
          []                     |[]
          []{____}    {____}     |[]
          []l----j    l----j     |[]
          []                     |[]
          lj                     |[]
                              {__}[]
                              l--j[]
  {}{______}{}{___}{}{_________}{}[]
  lj[------]lj[###]lj[#########]lj[]
{}{}[]!~~|[]{}l---j{}l---------j{}[]
lj[][]!  |[]lj~~~~~lj           lj[]
`.split('\n');

        }

        load() {
            this.constructTerrain();
            this.populateMap();
        }


        constructTerrain() {
            console.log("constructing terrain...")
            console.log(this.map[0].length + " x " + this.map.length)
            for (var col = 0; col < this.map[0].length; col++) {
                for (var row = 0; row < this.map.length; row++) {
                    var tile = this.tileMap[this.map[row][col]]
                    if (tile != null) {
                        var tileDimension = this.tileDimensions[this.map[row][col]];
                        this.gameEngine.addEntity(new Terrain(this.gameEngine, col * this.tileSize, row * this.tileSize, [32, 32], this.tilesheet, this.ctx, 3, tile, tileDimension));
                    }
                }
            }
        }

        populateMap(checkpoint) {
            if (checkpoint === -1) {
                this.section_1();
            }
            else {
                if (checkpoint === 0) {
                    this.section_1();
                }
            }
        }

        section_1() {
            this.sectionNum = 0;
            this.gameEngine.addEntity(new Item.HealthPack(this.gameEngine, 2935, 1200, this.assetManager.getAsset("img/healthpack.png"), this.ctx, 10, 8));
            this.gameEngine.addEntity(new Item.EnergyPack(this.gameEngine, 2965, 1200, this.assetManager.getAsset("img/energypack.png"), this.ctx, 10, 8));
            this.gameEngine.addEntity(new Item.HealthPack(this.gameEngine, 300, 400, this.assetManager.getAsset("img/healthpack.png"), this.ctx, 10, 8));
            this.gameEngine.addEntity(new Item.EnergyPack(this.gameEngine, 330, 400, this.assetManager.getAsset("img/energypack.png"), this.ctx, 10, 8));

            this.gameEngine.addEntity(new Hand(this.gameEngine, 1800, 1450, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
            this.gameEngine.addEntity(new Soldier_Shield(this.gameEngine, 1800, 1450, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
            this.gameEngine.addEntity(new Crow(this.gameEngine, 1350, 1300, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
            this.gameEngine.addEntity(new Crow(this.gameEngine, 2950, 1700, this.assetManager.getAsset("img/Enemies.png"), this.ctx));


            this.gameEngine.addEntity(new Soldier_Shield(this.gameEngine, 1300, 1100, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
            this.gameEngine.addEntity(new Crow(this.gameEngine, 400, 300, this.assetManager.getAsset("img/Enemies.png"), this.ctx));

            this.gameEngine.addEntity(new Dino(this.gameEngine, 2130, 1061, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 90, 60, 400, 250));
            this.gameEngine.addEntity(new Dino(this.gameEngine, 1980, 582, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
        }
    }

    class LevelTwo {

        /* Define terrain */
        constructor(gameEngine, assetManager, ctx) {

            // instance variables
            this.gameEngine = gameEngine;
            this.assetManager = assetManager;
            this.ctx = ctx;
            this.tilesheet = assetManager.getAsset("img/pipes.png");
            this.levelNum = 2;
            this.sectionNum;
            this.checkpoints = [[-570, 1440], [3200, 1440], [7000, 1200], [9955, 384]];
            this.camVals = [[2, 1.5], [2.75, 1.75], [2, 1.5], [2, 2]];
            this.camSpeeds = [[7, 7], [7, 4], [4, 4], [4, 4]];
            this.activatedCheckpoints = [true, false, false, false];
            this.nextLevel = -1;
            //I'd like to use an array of functions (will let us have an actual Level superclass)
            //this.sectionFunctions = null;

            this.tileSize = 96;

            this.tileMap = {
                ' ': null,
                // '\n': null,
                'i': [0, 6],
                '!': [1, 0],
                '[': [1, 4],
                '<': [1, 6],
                '{': [2, 0],
                '>': [2, 6],
                '_': [3, 0],
                '#': [3, 1],
                '-': [3, 4],
                '}': [4, 0],
                'j': [4, 3],
                '|': [4, 6],
                'l': [2, 3],
                '~': [6, 0],
                ']': [6, 3],
            }
            this.tileDimensions = {
                //boundWidth, boundHeight, offX, offY
                'i': [16, 32, 44, 0],
                '!': [16, 32, 44, 0],
                '[': [32, 32, 0, 0],
                '<': [16, 16, 44, 24],
                '{': [32, 32, 0, 0],
                '>': [16, 16, 0, 24],
                '_': [32, 32, 0, 0],
                '#': [32, 32, 0, 0],
                '-': [32, 32, 0, 0],
                '}': [32, 32, 0, 0],
                'j': [32, 32, 0, 0],
                '|': [16, 32, 4, 0],
                'l': [32, 32, 0, 0],
                '~': [32, 16, 0, 24],
                ']': [32, 32, 0, 0],
            }

            // 20 lines from top to bottom
            this.map =
                `                                                                                                                                                                #
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~     |
                                                                               |                                              
                                                                               |                                   
                                                                               |                       {}
                                                                               |                       []                     
                                                                               |                       []               
                                                                               |                       []                  
                                                                       <                               []              
                                                                                                       []
             <~~~~~>                                                  <~~                              []                                                                             
                                                                                                       []                           
                                                                       <                               []                          
                                       {}{}{______}{}{___}{}{_________}{}{}                            []                          ]
                       {}              []ljl------jljl---jljl---------jlj[]                            []                          ]
{___}{}{}{______}{}{___}{}{_________}{}[]                                []                            lj                          ]
[###]ljlj[######]ljl---j[]l---------jlj[]                                lj--------------------------------------------------------j
[###]    [######]       []             []                                                              
[###]    [######]       []             []                                
[###]    [######]       []             []                                                      
`.split('\n');

            this.mapStart = 
`{_}
l-j
`.split('\n');

        }

        load() {
            this.constructTerrain();
            //mapStart (saves work for now. Not good practice)
            for (var col = 0; col < this.mapStart[0].length; col++) {
                for (var row = 0; row < this.mapStart.length; row++) {
                    var tile = this.tileMap[this.mapStart[row][col]];
                    if (tile != null) {
                        var tileDimension = this.tileDimensions[this.mapStart[row][col]];
                        this.gameEngine.addEntity(new Terrain(this.gameEngine, -650 + col * this.tileSize, 1440 + row * this.tileSize, [32, 32], this.tilesheet, this.ctx, 3, tile, tileDimension));
                    }
                }
            }
            this.populateMap();
        }

        constructTerrain() {
            console.log("constructing terrain...")
            console.log(this.map[0].length + " x " + this.map.length)
            for (var col = 0; col < this.map[0].length; col++) {
                for (var row = 0; row < this.map.length; row++) {
                    var tile = this.tileMap[this.map[row][col]];
                    if (tile != null) {
                        var tileDimension = this.tileDimensions[this.map[row][col]];
                        this.gameEngine.addEntity(new Terrain(this.gameEngine, col * this.tileSize, row * this.tileSize, [32, 32], this.tilesheet, this.ctx, 3, tile, tileDimension));
                    }
                }
            }
        }

        populateMap(checkpoint) {
            if (checkpoint === -1) {
                this.section_1();
                this.section_2();
                this.section_3();
                this.section_4();
            }
            else {
                if (checkpoint === 0) {
                    this.section_1();
                }
                if (checkpoint === 1) {
                    this.section_2();
                }
                if (checkpoint === 2) {
                    this.section_3();
                }
                if (checkpoint === 3) {
                    this.section_4();
                }
            }
        }

        /*Define Sections*/
        section_1() {
            this.sectionNum = 0;
            /***HAZARDS***/

            /***ENEMIES***/
            var hand1 = new Hand(this.gameEngine, 2283, 1344, this.assetManager.getAsset("img/Enemies.png"), this.ctx);
            hand1.distance = 75;
            hand1.sightRadius[0] = 2300;
            this.gameEngine.addEntity(hand1);
            //this.gameEngine.addEntity(new Hand(this.gameEngine, 1783, 984, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
            //this.gameEngine.addEntity(new Crow(this.gameEngine, 500, 1000, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 50, 40, [300, 1000]));
            this.gameEngine.addEntity(new Dino(this.gameEngine, 1460, 984, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 90, 60, /*patrol distance*/300, /*shot time offset*/ 0));
            this.gameEngine.addEntity(new Crow(this.gameEngine, 2300, 1000, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 50, 40,
                /*sightRadius*/[300, 1000], /*Murder Parameters*/true, [[-600, 200], [400, 400]]));
            this.gameEngine.addEntity(new Soldier_Shield(this.gameEngine, 1000, 1440, this.assetManager.getAsset("img/Enemies.png"), this.ctx));

            /***ITEMS***/

            /***TOP LAYER ENTITIES***/

        }

        section_2() {
            this.sectionNum = 1;
            this.gameEngine.addEntity(new Hand(this.gameEngine, 6825, 984, this.assetManager.getAsset("img/Enemies.png"), this.ctx));
            this.gameEngine.addEntity(new Hazards["launcher"](this.gameEngine, 6875, 792 + 2 * 70, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 8, 8, [-1, 0], 90, 350, 20))
            this.gameEngine.addEntity(new Hazards["launcher"](this.gameEngine, 6875 - 95, 984 + 2 * 70, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 8, 8, [-1, 0], 90, 350, 50))
            this.gameEngine.addEntity(new Hazards["launcher"](this.gameEngine, 6875, 1176 + 2 * 70, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 8, 8, [-1, 0], 45, 350, 60))
        }

        section_3() {
            this.sectionNum = 2;
            /***BOTTOM LAYER ENTITIES***/
            this.gameEngine.addEntity(new Item.HealthPack(this.gameEngine, 8665, 950, this.assetManager.getAsset("img/healthpack.png"), this.ctx, 10, 8, 3, 1));
            this.gameEngine.addEntity(new Item.EnergyPack(this.gameEngine, 8635, 1000, this.assetManager.getAsset("img/energypack.png"), this.ctx, 10, 8, 3, 1));

            /***HAZARDS***/
            this.gameEngine.addEntity(new Hazards["fireball"](this.gameEngine, 7300, 1450 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 4,
                                /*cooldown*/ 50, /*speed*/ 20));
            this.gameEngine.addEntity(new Hazards["fireball"](this.gameEngine, 7820, 1450 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 4,
                                /*cooldown*/ 50, /*speed*/ 20, /*offset*/ 25));
            this.gameEngine.addEntity(new Hazards["spikes"](this.gameEngine, 7512,
                1152 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 4, 0, 3));
            this.gameEngine.addEntity(new Hazards["spikes"](this.gameEngine, 7980,
                1056 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 4, 20, 3));
            this.gameEngine.addEntity(new Hazards["spikes"](this.gameEngine, 8665,

                1150 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 3.5, 40, 0));
            this.gameEngine.addEntity(new Hazards["spikes"](this.gameEngine, 7692,
                700 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 4.5, 0, 3));
            this.gameEngine.addEntity(new Hazards["spikes"](this.gameEngine, 8064,
                250 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 7, 40, 20));

            this.gameEngine.addEntity(new Hazards["launcher"](this.gameEngine, 7965, -300, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 7, 7, [0, 1], 120, 160))

            /***ENEMIES***/
            this.gameEngine.addEntity(new Crow(this.gameEngine, 9600, -200, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 50, 40,
                [1000, 700], true, [[-400, 600], [-800, 700]]));

            /***ITEMS***/
            this.gameEngine.addEntity(new Item.HealthPack(this.gameEngine, 7050, 1248, this.assetManager.getAsset("img/healthpack.png"), this.ctx, 10, 8, 3, 1));
            this.gameEngine.addEntity(new Item.EnergyPack(this.gameEngine, 7080, 1248, this.assetManager.getAsset("img/energypack.png"), this.ctx, 10, 8, 3, 1));

            /***TOP LAYER ENTITIES***/
            this.gameEngine.addEntity(new Hazards["lava"](this.gameEngine, 7500, 1400 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 300));
            this.gameEngine.addEntity(new Hazards["lava"](this.gameEngine, 8400, 1400 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 300));
            this.gameEngine.addEntity(new Hazards["lava"](this.gameEngine, 9300, 1400 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 300));
        }

        section_4() {
            this.sectionNum = 3;
            /***HAZARDS***/
            var spikes1 = new Hazards["spikes"](this.gameEngine, 10530,
                792 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20, 2, 0);
            var spikes2 = new Hazards["spikes"](this.gameEngine, 11246,
                872 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20, 2, 0);
            var spikes3 = new Hazards["spikes"](this.gameEngine, 11058,
                504 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20*3, 2, 0);
            var spikes4 = new Hazards["spikes"](this.gameEngine, 11600,
                1148 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 0, 2, 0);
            var spikes5 = new Hazards["spikes"](this.gameEngine, 11910,
                792 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20*3, 2, 0);
            var spikes6 = new Hazards["spikes"](this.gameEngine, 11500,
                312 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20, 2, 0);
            var spikes7 = new Hazards["spikes"](this.gameEngine, 12686,
                600 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 0, 2, 0);
            var spikes8 = new Hazards["spikes"](this.gameEngine, 12203,
                312 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20 * 3, 2, 0);

            /***ENEMIES***/
            this.gameEngine.addEntity(new Crow(this.gameEngine, 12500, 1100, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 50, 40,
                [550, 400], true, [[-1200, -500], [-400, -900]]));

            /***ITEMS***/

            /***TOP LAYER ENTITIES***/
            this.gameEngine.addEntity(new Hazards["lava"](this.gameEngine, 10200, 1400 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 300));
            this.gameEngine.addEntity(new Hazards["lava"](this.gameEngine, 11100, 1400 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 300));
            this.gameEngine.addEntity(new Hazards["lava"](this.gameEngine, 12000, 1400 - 140, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 3, 300));
            var spikes8 = new Hazards["spikes"](this.gameEngine, 12543 - 20,
                1248 + 44, this.assetManager.getAsset("img/Enemies.png"), this.ctx, 2, true, 20 * 5, 20 * 3, 2, 0);
        }
    }
        

    return {
        "level-one": LevelOne,
        "level-two": LevelTwo,
    };
});