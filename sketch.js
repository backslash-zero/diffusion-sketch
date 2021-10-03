var size = 200

var grid = [];
var next = [];

let diffusionA = 1;		// diffusion rate of liquid A
let diffusionB = 0.5;	// diffusion rate of liquid B
let feed = 0.055;		// feed rate
let kill = 0.062;		// kill rate

let lapCenterWeight = -1;
let lapCornerWeight = 0.05;
let lapAdjacentWeight = 0.2;

function setup() 
{
	createCanvas(size, size);
	pixelDensity(1);
	seedingCanvas();
}

function seedingCanvas()
{
	for (var x = 0; x < size; x++)
	{
		grid[x] = []
		next[x] = []
		for (var y = 0; y < size; y++)
		{
			grid[x][y] = {
				a: 1, 
				b: 0
			};
			next[x][y] = {
				a: 1, 
				b: 0
			};
		}
	}
	addingSeedB();
}

function addingSeedB ()
{
	for (var x = size / 5; x < 2 * size / 5; x++)
	{
		for (y = size / 5 ; y < 2 * size / 5; y++)
		{
			grid[x][y].b = 1;
		}
	}
}



function draw()
{
	background(80);

	updateNext();

	loadPixels();

	displayGrid();
	
	updatePixels();
	
	updateGrid();
}

function updateGrid()
{
	var temp = grid;
	grid = next;
	next = temp;
}

function updateNext()
{
	for (var x = 1; x < size -1 ; x++)
	{
		for (y = 1; y < size - 1; y++)	
		{
			var a = grid[x][y].a;
			var b = grid[x][y].b;
			next[x][y].a = a + (
							(diffusionA * laplaceA(x, y))
							- (a * b * b)
							+ (feed * (1 - a))
							);
			next[x][y].b = b + (
							(diffusionB * laplaceAB(x, y))
							+ (a * b * b)
							- ((kill + feed) * b)
							);
			next[x][y].a =	constrain(next[x][y].a, 0, 1)
			next[x][y].b = 	constrain(next[x][y].b, 0, 1)
		}
	}
}

function laplaceAB(x, y, id) // id is index of a or b (0 or 1)
{
	var sum = 0;
	for (var i = (x - 1); x <= (x + 1); x++)
	{
		for (var j = (y - 1); y <= (y + 1); x++)
		{
			var value = grid[i][j][id]
			if (i == x && j == y)
				sum += value * lapCenterWeight;
			else if (i == x || j == y)
				sum += value * lapAdjacentWeight;
			else
				sum += value * lapCornerWeight;
		}
	}
	return sum;
}

function laplaceA(x, y)
{
	var sumA = 0;

	sumA += grid[x][y].a * lapCenterWeight;

	sumA += grid[x - 1][y].a * lapAdjacentWeight;
	sumA += grid[x + 1][y].a * lapAdjacentWeight;
	sumA += grid[x][y - 1].a * lapAdjacentWeight;
	sumA += grid[x][y + 1].a * lapAdjacentWeight;

	sumA += grid[x - 1][y - 1].a * lapCornerWeight;
	sumA += grid[x + 1][y - 1].a * lapCornerWeight;
	sumA += grid[x - 1][y + 1].a * lapCornerWeight;
	sumA += grid[x + 1][y + 1].a * lapCornerWeight;

	return (sumA);
}

function laplaceB(x, y)
{
	var sumB = 0;

	sumB += grid[x][y].b * lapCenterWeight;

	sumB += grid[x - 1][y].b * lapAdjacentWeight;
	sumB += grid[x + 1][y].b * lapAdjacentWeight;
	sumB += grid[x][y - 1].b * lapAdjacentWeight;
	sumB += grid[x][y + 1].b * lapAdjacentWeight;

	sumB += grid[x - 1][y - 1].b * lapCornerWeight;
	sumB += grid[x + 1][y - 1].b * lapCornerWeight;
	sumB += grid[x - 1][y + 1].b * lapCornerWeight;
	sumB += grid[x + 1][y + 1].b * lapCornerWeight;

	return (sumB);
}

function displayGrid()
{
	for (var x = 0; x < size; x++)
	{
		for (var y = 0; y < size; y++)
		{
			var pix = (x + (y * width)) * 4;
			var a = next[x][y].a;
			var b = next[x][y].b;
			var c = floor((a - b) * 255);
			c = constrain(c, 0, 255);

			pixels[pix + 0] = c;	// R
			pixels[pix + 1] = c;	// G
			pixels[pix + 2] = c;	// B
			pixels[pix + 3] = 255;	// alpha
		}
	}
}
