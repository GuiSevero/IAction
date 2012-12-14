var PixelCanvas = {
	target: null,
	targetCtx: null,
	drawMode: false,
	drawColor: "black",
	drawSize: 5,
	socket: { } ,
	
	init: function(target, socket, drawer) {
		this.target = target;
		this.targetCtx = target.getContext("2d");
		this.changeColor(this.drawColor);
		this.socket = socket;
		
		if(drawer){
			this.target.onmousedown = this.mouseDown;
			this.target.onmousemove = this.mouseMove;
			this.target.onmouseup = this.mouseUp;

		}
		
		
	},
	
	clearCanvas: function() {
		this.targetCtx.clearRect(0,0,this.target.width,this.target.height);
	},
	
	mouseDown: function(e) {
		PixelCanvas.drawMode = true;

		var mouse = getMouseCoords(e, PixelCanvas.target);
		PixelCanvas.drawPixel(mouse.x, mouse.y);
		
		e.preventDefault();
	},
	
	mouseUp: function(e) {
		PixelCanvas.drawMode = false;
		e.preventDefault();
	},
	
	mouseMove: function(e) {
		var mouse = getMouseCoords(e, PixelCanvas.target);

		if (PixelCanvas.drawMode){
			//desenha o pixel
			PixelCanvas.drawPixel(mouse.x, mouse.y);
			
		} 

		e.preventDefault();
	},

	drawPixel: function(x, y) {
		this.targetCtx.fillRect (x - this.drawSize/2, y - this.drawSize/2, this.drawSize, this.drawSize);
		socket.emit('drawPixel', {x: x, y: y });

	},

	
	changeColor: function(c) {
		this.drawColor = c;
		this.targetCtx.fillStyle = this.drawColor;
		socket.emit('changeColor', {c: c });
	},

	changeBrush: function(s) {
		this.drawSize = s;
		socket.emit('changeBrush', {s: s});
	},

	redrawPixel: function(x, y) {
		this.targetCtx.fillRect (x - this.drawSize/2, y - this.drawSize/2, this.drawSize, this.drawSize);
		

	},

	rechangeColor: function(c) {
		this.drawColor = c;
		this.targetCtx.fillStyle = this.drawColor;
		$('#current-color').css('background-color', c);
		
	},

	rechangeBrush: function(s) {
		this.drawSize = s;
		
	},
};
