define([
    'asset-manager',
    'game-engine',
    "game-board",
    "camera",
    "hud",
    "entity",
    "terrain",
    "hero",
    "leo",
    "flames",
    "solider",
    "level-one",
    "soldier-shield",
    "dino",
    "crow",  
    "bullet",
    "shotblast",
    "enemy",

], function(
    AssetManager,
    GameEngine,
    GameBoard,
    Camera,
    Hud,
    Entity,
    Terrain,
    Hero,
    Leo,
    Flames,
    Soldier,
    LevelOne,
    Soldier_Shield,
    Dino,
    Crow,  
    Bullet,
    Shotblast,
    Enemy,
) {

    let init = function() {
        console.log("init")
    };

    // the "main" code begins here

    toload = [
        "img/ZXe.png",
        "img/Leo.png",
        "img/EnemySheet1.png",
        "img/pipes.png",
        "img/Enemies.png",
        "img/hud.png"
    ];

    let ASSET_MANAGER = new AssetManager(toload);

    ASSET_MANAGER.downloadAll(function () {
        console.log("starting up da sheild");
        let canvas = document.getElementById('gameWorld');
        let ctx = canvas.getContext('2d');
        console.log("canvas width: " + canvas.width);
        console.log("canvas height: " + canvas.height);
        let vPortWidth = 300; // Distance from left side of screen
        let vPortHeight = 500; // Distance from top of screen

        let gameEngine = new GameEngine();
        let camera = new Camera(gameEngine, 0, 0, null, ctx=ctx, vPortWidth, vPortHeight, canvas.width, canvas.height) //Placeholder magic numbers until we decide on how to handle world boundary and camera
        /**NOTE: IT IS VERY IMPORTANT CAMERA IS THE FIRST ADDED ENTITY**/
        gameEngine.addEntity(camera);

        let levelOne = new LevelOne(gameEngine, ASSET_MANAGER, ctx);

        // let mapreader = new FileReader();
        // mapreader.onload = function(e) {
        //     console.log(mapreader.result);
        // }
        // mapreader.readAsText("maps/testmap");

        // gameEngine.showOutlines = true;

        // let gameboard = new GameBoard();

        // gameEngine.addEntity(gameboard);

        let hero = new Hero(gameEngine, 100, 0, ASSET_MANAGER.getAsset("img/ZXe.png"), ctx);
        camera.follow(hero);
        gameEngine.addEntity(hero);  
        // gameEngine.addEntity(new Leo(gameEngine, 200, 150, ASSET_MANAGER.getAsset("img/Leo.png"), ctx));
        // gameEngine.addEntity(new Flames(gameEngine, 200, 700, ASSET_MANAGER.getAsset("img/Leo.png"), ctx));
        // gameEngine.addEntity(new Soldier(gameEngine, 100, 0, ASSET_MANAGER.getAsset("img/EnemySheet1.png"), ctx));
        gameEngine.addEntity(new Soldier_Shield(gameEngine, 600, 700, ASSET_MANAGER.getAsset("img/Enemies.png"), ctx));
        gameEngine.addEntity(new Crow(gameEngine, 60, 550, ASSET_MANAGER.getAsset("img/Enemies.png"), ctx));
        gameEngine.addEntity(new Dino(gameEngine, 1250, 400, ASSET_MANAGER.getAsset("img/Enemies.png"), ctx));
//        gameEngine.addEntity(new Terrain(gameEngine, 0, 600, [32, 32], ASSET_MANAGER.getAsset("img/pipes.png"), ctx=ctx, scale=3, tiles=[[2,0], [3, 0], [4,0]]));

        let hud = new Hud.HealthBar(gameEngine, ASSET_MANAGER.getAsset("img/hud.png"), hero, [0, 0], [0,0], [100, 100], 3);
        gameEngine.addEntity(hud);

        gameEngine.init(ctx);
        gameEngine.start();
    });

    return {
        init: init
    };

});

