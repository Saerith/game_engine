define([
    'asset-manager',
    'game-engine',
    "game-board",
    "entity",
    "hero",
    "leo",
    "flames",
    "solider",
    "terrain",
    "level-one",
], function(
    AssetManager,
    GameEngine,
    GameBoard,
    Entity,
    Hero,
    Leo,
    Flames,
    Soldier,
    Terrain,
    LevelOne
) {

    let init = function() {
        console.log("init")
    };

    // the "main" code begins here

    toload = [
        "img/ZXe.png",
        "img/Leo.png",
        "img/EnemySheet1.png",
        "img/pipes.png"
    ];

    let ASSET_MANAGER = new AssetManager(toload);

    ASSET_MANAGER.downloadAll(function () {
        console.log("starting up da sheild");
        let canvas = document.getElementById('gameWorld');
        let ctx = canvas.getContext('2d');

        let gameEngine = new GameEngine();

        let levelOne = new LevelOne(gameEngine, ASSET_MANAGER, ctx);

        // let mapreader = new FileReader();
        // mapreader.onload = function(e) {
        //     console.log(mapreader.result);
        // }
        // mapreader.readAsText("maps/testmap");

        // gameEngine.showOutlines = true;

        // let gameboard = new GameBoard();

        // gameEngine.addEntity(gameboard);
        //(game, x, y, img=null, ctx=null, scale=3, spriteWidth=50, spriteHeight=50)
        // gameEngine.addEntity(new Terrain(gameEngine, 100, 600, [32, 32], ASSET_MANAGER.getAsset("img/pipes.png"), ctx=ctx, scale=3, tiles=[[2,0], [3, 0], [4,0]]));

        gameEngine.addEntity(new Hero(gameEngine, 200, 0, ASSET_MANAGER.getAsset("img/ZXe.png"), ctx));
        // gameEngine.addEntity(new Leo(gameEngine, 200, 150, ASSET_MANAGER.getAsset("img/Leo.png"), ctx));
        // gameEngine.addEntity(new Flames(gameEngine, 200, 700, ASSET_MANAGER.getAsset("img/Leo.png"), ctx));
        // gameEngine.addEntity(new Soldier(gameEngine, 100, 0, ASSET_MANAGER.getAsset("img/EnemySheet1.png"), ctx));
        // gameEngine.addEntitySet()


        gameEngine.init(ctx);
        gameEngine.start();
    });

    return {
        init: init
    };

});

