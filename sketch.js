let size = 600

var grid = [];
var next = [];

let diffusionA = 1;		// diffusion rate of liquid A
let diffusionB = 0.5;	// diffusion rate of liquid B
let feed = 0.55;		// feed

function setup() 
{
	createCanvas(size, size);
	pixelDensity(1);
	for (var x = 0; x < size; x++)
	{
		grid[x] = []
		next[x] = []
		for (y = 0; y < size; y++)
		{
			grid[x][y] = {
				a: random(1) * 255, 
				b: random(1) * 255
			}
			next[x][y] = {
				a: 0, 
				b: 0
			}
		}
	}
}

function draw()
{
	background(51);

	updateNext();

	loadPixels();

	displayGrid();
	
	updateGrid();

	updatePixels();
}

function updateGrid()
{
	grid = next;
}

function updateNext()
{
	for (var x = 0; x < size; x++)
	{
		for (y = 0; y < size; y++)	
		{
			next[x][y].a = grid[x][y].a + (diffusionA); 
			next[x][y].b = grid[x][y].b; 
		}
	}
}

function displayGrid()
{
	for (var x = 0; x < size; x++)
	{
		for (y = 0; y < size; y++)
		{
			pix = (x + (y * width)) * 4
			pixels[pix + 0] = grid[x][y].a;									// R
			pixels[pix + 1] = (grid[x][y].a + grid[x][y].b) / 2;			// G
			pixels[pix + 2] = grid[x][y].b;									// B
			pixels[pix + 3] = 255;											// alpha
		}
	}
}