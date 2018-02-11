
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

require.config({
    paths: {
        "actor": "entities/actor",
        "animation": "animation",
        "game-board": "entities/game-board",
        "entity": "entities/entity",
        "hero": "entities/hero",
        "projectile": "entities/projectile",
        "projectile-sword": "entities/projectile-sword",
    	"leo": "entities/leo",
    	"flames": "entities/flames",
    	"solider": "entities/soldier",
    	"terrain" : "entities/terrain"
    },


});


require(['core'], function(Core) {
    Core.init();
});