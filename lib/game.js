;(function (exports) {

    function Game(stage, socket) {
        this.socket = socket
        this.stage = stage
        this.ctx = stage.getContext('2d')
    }

     Game.prototype.setListeners = function () {
        this.socket && this.socket.on('getball', this.getball.bind(this))
    }

    exports.Game = Game

})(window.IAction)