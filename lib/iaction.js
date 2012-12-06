window.IAction = {}

;(function (exports) {

    function init(board, socket) {
        this.game = new IAction.Game(board, socket)
        this.game.run()
    }

    exports.init = init
    
})(window.IAction)