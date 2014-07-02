Engine.module('amt.game.Levels',
	['physics.Orientation'],
	function () {
		'use strict';

		var Orientation = Engine.physics.Orientation;

		var Levels = {
			TEST_MAP: {
				tileSize: 100,
				width: 14,
				terrain: [1, 2, 29, 29, 29, 28, 27, 27, 20, 29, 29, 30, 30, 30, 12, 4, 29, 29, 29, 28, 23, 34, 20, 29, 30, 30, 30, 30, 9, 10, 29, 36, 29, 25, 27, 36, 26, 30, 30, 30, 30, 30, 29, 29, 29, 30, 29, 17, 19, 19, 18, 30, 30, 30, 30, 30, 5, 6, 30, 30, 30, 25, 27, 27, 26, 15, 16, 30, 30, 30, 5, 6, 30, 30, 30, 1, 3, 3, 2, 15, 16, 30, 30, 30, 5, 6, 30, 30, 1, 29, 11, 11, 10, 15, 16, 30, 30, 30, 30, 30, 30, 30, 9, 10, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
				objects: [
					{id: 'player', x: 450, y: 250},
					{id: 'item/sky-meat', x: 650, y: 150},
					{id: 'item/sky-meat', x: 250, y: 650},
					{id: 'item/sky-meat', x: 850, y: 1150}
				]
			},
			LEVEL1A: {
				gameMode: 'SCROLLING',
				tileSize: 100,
				width: 9,
				terrain: [8, 9, 9, 9, 9, 9, 9, 9, 10, 18, 56, 62, 67, 62, 67, 62, 56, 20, 18, 62, 60, 60, 60, 60, 60, 62, 20, 18, 70, 60, 60, 60, 60, 60, 69, 20, 18, 62, 60, 60, 56, 60, 60, 62, 20, 18, 70, 60, 60, 60, 60, 60, 69, 20, 18, 62, 60, 60, 60, 60, 60, 62, 20, 18, 56, 62, 60, 62, 60, 62, 56, 20, 34, 35, 35, 35, 35, 35, 35, 35, 36, 44, 45, 45, 45, 45, 45, 45, 45, 46, 15, 59, 71, 72, 59, 59, 59, 59, 17, 15, 59, 81, 82, 59, 85, 26, 86, 17, 15, 59, 71, 72, 59, 17, 54, 15, 17, 15, 59, 81, 82, 59, 17, 54, 15, 17, 15, 59, 71, 72, 59, 17, 54, 31, 33, 15, 59, 81, 82, 59, 17, 54, 41, 43, 15, 59, 71, 72, 59, 17, 54, 18, 20, 15, 59, 81, 82, 59, 17, 54, 34, 36, 15, 59, 71, 72, 59, 17, 54, 44, 46, 15, 59, 81, 82, 59, 17, 54, 31, 33, 15, 59, 85, 26, 86, 17, 54, 41, 43, 15, 59, 17, 55, 15, 17, 54, 34, 36, 15, 59, 17, 55, 15, 17, 54, 44, 46, 15, 59, 17, 55, 15, 17, 54, 15, 17, 15, 59, 17, 55, 15, 17, 54, 31, 33, 15, 59, 17, 55, 31, 33, 54, 41, 43, 31, 32, 33, 55, 73, 74, 54, 18, 20, 41, 42, 43, 55, 93, 94, 54, 18, 20, 18, 56, 20, 55, 93, 94, 54, 18, 20, 18, 56, 20, 55, 93, 94, 54, 18, 20, 18, 56, 20, 55, 93, 94, 54, 18, 20, 18, 56, 20, 55, 93, 94, 54, 18, 20, 34, 35, 36, 55, 83, 84, 54, 34, 36, 44, 45, 46, 55, 41, 43, 54, 41, 43, 15, 16, 17, 55, 18, 47, 9, 48, 20, 15, 16, 17, 55, 18, 56, 60, 56, 20, 15, 16, 17, 55, 18, 60, 56, 60, 20, 15, 16, 17, 55, 18, 19, 60, 19, 20, 15, 16, 17, 55, 34, 35, 35, 35, 36, 15, 16, 17, 55, 44, 45, 45, 45, 46, 15, 16, 17, 55, 15, 59, 59, 59, 17, 15, 16, 17, 55, 15, 59, 59, 59, 17, 15, 16, 17, 55, 25, 40, 59, 59, 17, 15, 16, 17, 55, 55, 25, 40, 16, 17, 31, 32, 33, 55, 55, 55, 31, 32, 33, 41, 42, 43, 55, 55, 55, 44, 45, 46, 18, 56, 20, 55, 55, 55, 15, 16, 17, 34, 35, 36, 55, 55, 55, 15, 16, 17, 44, 45, 46, 55, 55, 55, 15, 16, 17, 15, 16, 17, 55, 55, 55, 15, 16, 17, 31, 32, 33, 55, 55, 55, 31, 32, 33, 44, 45, 46, 55, 55, 55, 44, 45, 46, 25, 40, 49, 6, 6, 6, 50, 39, 27, 52, 25, 40, 16, 16, 16, 39, 27, 52, 52, 53, 25, 40, 16, 39, 27, 53, 52, 52, 53, 54, 31, 32, 33, 54, 53, 52, 52, 53, 54, 41, 42, 43, 54, 53, 52, 52, 53, 8, 48, 60, 47, 10, 53, 52, 8, 9, 48, 66, 64, 68, 47, 9, 10, 18, 66, 60, 64, 62, 64, 60, 68, 20, 18, 70, 60, 62, 19, 62, 60, 69, 20, 18, 70, 60, 37, 29, 38, 60, 69, 20, 34, 35, 35, 36, 55, 34, 35, 35, 36, 44, 45, 45, 46, 55, 44, 45, 45, 46, 15, 71, 72, 17, 55, 15, 71, 72, 17, 15, 81, 82, 17, 55, 15, 81, 82, 17, 15, 39, 26, 27, 55, 25, 26, 40, 17, 15, 17, 55, 55, 55, 55, 55, 15, 17, 15, 49, 6, 6, 6, 6, 6, 50, 17, 15, 16, 59, 59, 59, 59, 59, 16, 17, 31, 76, 77, 77, 77, 77, 77, 78, 33, 44, 79, 80, 80, 80, 80, 80, 75, 46, 15, 59, 59, 59, 59, 59, 59, 59, 17, 15, 59, 59, 59, 59, 59, 59, 59, 17, 15, 59, 59, 59, 59, 59, 59, 59, 17, 31, 76, 77, 77, 77, 77, 77, 78, 33, 41, 42, 42, 42, 42, 42, 42, 42, 43, 18, 66, 67, 67, 67, 67, 67, 68, 20, 18, 70, 60, 60, 60, 60, 60, 69, 20, 28, 38, 63, 60, 60, 60, 65, 37, 30, 52, 28, 38, 63, 60, 65, 37, 30, 52, 52, 53, 28, 38, 64, 37, 30, 53, 52, 52, 53, 54, 34, 35, 36, 54, 53, 52, 52, 53, 54, 44, 45, 46, 54, 53, 52, 52, 53, 54, 15, 16, 17, 54, 53, 52, 52, 53, 54, 25, 26, 27, 54, 53, 52],
				objects: [
					{id: 'player', x: 450, y: 8450},
					{id: 'enemy/shell', x: 450, y: 7500},
					{id: 'enemy/shell', x: 250, y: 7250},
					{id: 'enemy/shell', x: 650, y: 7250},
					{id: 'enemy/shell', x: 750, y: 6950},
					{id: 'enemy/shell', x: 100, y: 6500},
					{id: 'enemy/shell', x: 800, y: 6500},
					{id: 'enemy/shell', x: 250, y: 6250},
					{id: 'enemy/shell', x: 650, y: 6250},
					{id: 'enemy/shell', x: 450, y: 5650},
					{id: 'enemy/shell', x: 400, y: 5450},
					{id: 'enemy/shell', x: 500, y: 5450},
					{id: 'enemy/shell', x: 150, y: 5050},
					{id: 'enemy/shell', x: 150, y: 4750},
					{id: 'enemy/shell', x: 150, y: 4450},
					{id: 'enemy/shell', x: 150, y: 4050},
					{id: 'enemy/shell', x: 150, y: 3650},
					{id: 'enemy/shell', x: 150, y: 3150},
					{id: 'enemy/shell', x: 750, y: 2950},
					{id: 'enemy/shell', x: 150, y: 2850},
					{id: 'enemy/shell', x: 150, y: 2350},
					{id: 'enemy/shell', x: 500, y: 2050},
					{id: 'enemy/shell', x: 150, y: 1950},
					{id: 'enemy/shell', x: 450, y: 1750},
					{id: 'enemy/shell', x: 250, y: 1550},
					{id: 'enemy/shell', x: 450, y: 1250},
					{id: 'enemy/shell', x: 150, y: 1150},
					{id: 'enemy/shell', x: 800, y: 1150},
					{id: 'enemy/baby', x: 125, y: 6950},
					{id: 'enemy/baby', x: 175, y: 6950},
					{id: 'enemy/baby', x: 350, y: 5950},
					{id: 'enemy/baby', x: 550, y: 5950},
					{id: 'enemy/baby', x: 450, y: 5850},
					{id: 'enemy/baby', x: 700, y: 5050},
					{id: 'enemy/baby', x: 750, y: 5050},
					{id: 'enemy/baby', x: 725, y: 4350},
					{id: 'enemy/baby', x: 775, y: 4350},
					{id: 'enemy/baby', x: 625, y: 4150},
					{id: 'enemy/baby', x: 675, y: 4150},
					{id: 'enemy/baby', x: 725, y: 4100},
					{id: 'enemy/baby', x: 775, y: 4100},
					{id: 'enemy/baby', x: 725, y: 4000},
					{id: 'enemy/baby', x: 775, y: 4000},
					{id: 'enemy/baby', x: 625, y: 3875},
					{id: 'enemy/baby', x: 675, y: 3875},
					{id: 'enemy/baby', x: 525, y: 3825},
					{id: 'enemy/baby', x: 575, y: 3825},
					{id: 'enemy/baby', x: 625, y: 3825},
					{id: 'enemy/baby', x: 675, y: 3825},
					{id: 'enemy/baby', x: 625, y: 3725},
					{id: 'enemy/baby', x: 675, y: 3725},
					{id: 'enemy/baby', x: 625, y: 3675},
					{id: 'enemy/baby', x: 675, y: 3675},
					{id: 'enemy/baby', x: 625, y: 3625},
					{id: 'enemy/baby', x: 675, y: 3625},
					{id: 'enemy/baby', x: 475, y: 3475},
					{id: 'enemy/baby', x: 525, y: 3475},
					{id: 'enemy/baby', x: 775, y: 3475},
					{id: 'enemy/baby', x: 825, y: 3475},
					{id: 'enemy/baby', x: 775, y: 3425},
					{id: 'enemy/baby', x: 825, y: 3425},
					{id: 'enemy/baby', x: 475, y: 3250},
					{id: 'enemy/baby', x: 525, y: 3250},
					{id: 'enemy/baby', x: 475, y: 3050},
					{id: 'enemy/baby', x: 525, y: 3050},
					{id: 'enemy/baby', x: 475, y: 2850},
					{id: 'enemy/baby', x: 525, y: 2850},
					{id: 'enemy/baby', x: 475, y: 2650},
					{id: 'enemy/baby', x: 525, y: 2650},
					{id: 'enemy/baby', x: 475, y: 2450},
					{id: 'enemy/baby', x: 525, y: 2450},
					{id: 'enemy/baby', x: 475, y: 2250},
					{id: 'enemy/baby', x: 525, y: 2250},
					{id: 'enemy/baby', x: 350, y: 1950},
					{id: 'enemy/baby', x: 450, y: 1850},
					{id: 'item/sky-meat', x: 800, y: 2350},
					{id: 'item/sky-meat', x: 800, y: 2000},
					{id: 'item/sky-meat', x: 800, y: 1900},
					{id: 'item/sky-meat', x: 800, y: 1650},
					{id: 'item/sky-meat', x: 800, y: 1350},
					{id: 'decoration/hatched-egg-mound', x: 400, y: 6875},
					{id: 'decoration/egg-mountain', x: 260, y: 6840},
					{id: 'decoration/egg-pile', x: 350, y: 5250},
					{id: 'decoration/egg-mound', x: 450, y: 5250},
					{id: 'decoration/hatched-egg-mound', x: 550, y: 5250},
					{id: 'decoration/egg-mound', x: 850, y: 5150},
					{id: 'decoration/egg-pile', x: 575, y: 4350},
					{id: 'decoration/egg-mountain', x: 475, y: 4225},
					{id: 'decoration/hatched-egg-pile', x: 450, y: 4150},
					{id: 'decoration/hatched-egg-mound', x: 475, y: 4075},
					{id: 'decoration/hatched-egg-pile', x: 750, y: 3750},
					{id: 'decoration/hatched-egg-pile', x: 550, y: 3650},
					{id: 'decoration/hatched-egg-pile', x: 650, y: 3450}
				]
			},
			LEVEL2: {
				tileSize: 100,
				width: 20,
				terrain: [54, 8, 9, 9, 9, 9, 9, 9, 67, 68, 9, 9, 9, 9, 10, 54, 54, 54, 54, 54, 52, 18, 62, 62, 60, 56, 56, 60, 56, 56, 60, 60, 60, 60, 47, 1, 2, 6, 7, 54, 53, 18, 62, 60, 60, 56, 56, 60, 56, 56, 60, 60, 60, 60, 60, 11, 12, 16, 17, 54, 52, 18, 60, 60, 60, 56, 56, 60, 56, 56, 62, 19, 60, 60, 37, 21, 22, 26, 27, 54, 54, 34, 35, 35, 35, 58, 55, 29, 29, 29, 69, 70, 35, 35, 36, 54, 54, 54, 54, 54, 54, 44, 45, 45, 45, 46, 54, 54, 54, 54, 54, 44, 45, 45, 46, 54, 54, 8, 9, 10, 52, 15, 61, 59, 61, 17, 54, 52, 52, 52, 54, 25, 26, 26, 27, 52, 54, 18, 19, 20, 53, 15, 59, 59, 59, 64, 9, 10, 54, 53, 53, 54, 54, 54, 53, 54, 54, 34, 35, 36, 53, 15, 59, 59, 59, 13, 14, 20, 53, 52, 52, 53, 53, 53, 52, 52, 52, 41, 42, 43, 52, 15, 61, 59, 61, 63, 29, 30, 54, 53, 54, 54, 52, 53, 52, 54, 8, 48, 19, 20, 54, 31, 32, 32, 32, 33, 54, 54, 54, 54, 54, 52, 54, 52, 53, 54, 18, 19, 19, 20, 54, 41, 42, 42, 42, 65, 66, 6, 6, 6, 6, 6, 6, 6, 7, 54, 18, 19, 19, 20, 52, 18, 60, 60, 60, 11, 12, 57, 59, 59, 59, 59, 59, 57, 17, 54, 18, 19, 19, 20, 52, 18, 60, 60, 60, 11, 12, 59, 59, 59, 59, 59, 59, 59, 17, 54, 18, 19, 19, 20, 53, 18, 60, 62, 60, 11, 12, 59, 59, 16, 61, 16, 59, 59, 17, 54, 18, 19, 19, 20, 53, 18, 60, 60, 60, 11, 12, 59, 59, 61, 16, 61, 59, 59, 17, 54, 18, 19, 19, 20, 53, 18, 60, 60, 60, 11, 12, 59, 59, 59, 59, 59, 59, 59, 17, 54, 18, 19, 19, 20, 53, 18, 60, 62, 60, 11, 12, 57, 59, 59, 59, 59, 59, 57, 17, 54, 18, 19, 19, 20, 52, 18, 60, 60, 60, 11, 12, 39, 26, 26, 26, 26, 26, 26, 27, 54, 18, 19, 19, 20, 52, 18, 60, 60, 60, 11, 12, 17, 54, 54, 54, 52, 53, 52, 54, 54, 18, 19, 19, 20, 54, 18, 60, 60, 60, 11, 12, 49, 6, 6, 6, 6, 6, 6, 7, 54, 18, 19, 19, 20, 54, 18, 60, 60, 60, 11, 12, 57, 59, 59, 59, 59, 59, 57, 17, 54, 18, 19, 19, 20, 54, 18, 60, 62, 60, 11, 12, 59, 57, 59, 59, 59, 57, 59, 17, 54, 34, 35, 35, 36, 54, 18, 60, 60, 60, 11, 12, 59, 59, 61, 59, 61, 59, 59, 17, 54, 44, 45, 45, 46, 54, 18, 60, 60, 60, 11, 12, 59, 59, 59, 16, 59, 59, 59, 49, 6, 50, 16, 16, 17, 54, 18, 60, 62, 60, 11, 12, 59, 59, 61, 59, 61, 59, 59, 59, 16, 16, 16, 16, 17, 52, 18, 60, 60, 60, 11, 12, 59, 57, 59, 59, 59, 57, 59, 59, 59, 16, 16, 16, 17, 53, 18, 60, 60, 60, 11, 12, 57, 59, 59, 59, 59, 59, 57, 59, 39, 26, 40, 16, 17, 52, 28, 29, 29, 29, 21, 22, 26, 26, 26, 26, 26, 26, 26, 26, 27, 54, 25, 26, 27, 54, 52, 53, 52, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54, 54],
				objects: [
					{id: 'player', x: 1750, y: 250, orientation: Orientation.WEST},
					{id: 'decoration/egg-pile', x: 250, y: 50},
					{id: 'decoration/hatched-egg-mound', x: 1300, y: 600},
					{id: 'decoration/egg-mountain', x: 700, y: 1200},
					{id: 'decoration/hatched-egg-mound', x: 1100, y: 1150},
					{id: 'decoration/egg-mound', x: 1450, y: 1150},
					{id: 'decoration/egg-mountain', x: 1200, y: 1300},
					{id: 'decoration/hatched-egg-pile', x: 1100, y: 1250},
					{id: 'decoration/egg-pile', x: 950, y: 1850},
					{id: 'decoration/egg-pile', x: 200, y: 2850},
					{id: 'decoration/hatched-egg-mound', x: 1500, y: 2850},
					{id: 'decoration/egg-mound', x: 1700, y: 2750},
					{id: 'decoration/hatched-egg-pile', x: 1950, y: 2850},

					{id: 'item/sky-meat', x: 650, y: 900},

					{id: 'enemy/shell', x: 350, y: 150},
					{id: 'enemy/shell', x: 1250, y: 450},
					{id: 'enemy/shell', x: 950, y: 1300},
					{id: 'enemy/shell', x: 350, y: 2100},
					{id: 'enemy/shell', x: 300, y: 2650},
					{id: 'enemy/shell', x: 1700, y: 1000},
					{id: 'enemy/shell', x: 1900, y: 1200},
					{id: 'enemy/shell', x: 1700, y: 1400},
					{id: 'enemy/shell', x: 1900, y: 1600},
					{id: 'enemy/shell', x: 1700, y: 1800},
					{id: 'enemy/shell', x: 1900, y: 2000},
					{id: 'enemy/baby', x: 950, y: 1150},
					{id: 'enemy/baby', x: 1450, y: 1350},
					{id: 'enemy/baby', x: 1150, y: 1550},
					{id: 'enemy/baby', x: 1050, y: 1650},
					{id: 'enemy/baby', x: 1150, y: 1650},
					{id: 'enemy/baby', x: 1150, y: 1750},
					{id: 'enemy/baby', x: 1250, y: 1750},
					{id: 'enemy/baby', x: 350, y: 2250},
					{id: 'enemy/baby', x: 1350, y: 2250},
					{id: 'enemy/baby', x: 1250, y: 2350},
					{id: 'enemy/baby', x: 1350, y: 2350},
					{id: 'enemy/baby', x: 1250, y: 2450},
					{id: 'enemy/baby', x: 1450, y: 2550},
					{id: 'enemy/baby', x: 1350, y: 2650},
					{id: 'enemy/baby', x: 1250, y: 2750},
					{id: 'enemy/baby', x: 1850, y: 2650}
				]
			},
			LEVEL3: {
				tileSize: 100,
				width: 8,
				terrain: [51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 51, 8, 9, 10, 51, 51, 51, 51, 51, 18, 62, 20, 51, 51, 51, 51, 51, 34, 35, 36, 51, 51, 51, 51, 51, 44, 45, 46, 51, 51, 51, 51, 51, 15, 61, 17, 51, 51, 51, 51, 51, 15, 57, 17, 51, 51, 51, 51, 51, 15, 61, 17, 51, 51, 51, 51, 51, 15, 57, 17, 51, 51, 51, 51, 51, 15, 61, 17, 51, 51, 51, 51, 51, 15, 57, 17, 51, 51, 51, 51, 51, 15, 61, 17, 51, 51, 51, 51, 51, 15, 57, 17, 51, 51, 51, 51, 51, 15, 61, 17, 51, 51, 51, 51, 51, 15, 57, 17, 51, 51, 51, 51, 51, 15, 16, 17, 54, 51, 51, 51, 51, 15, 57, 17, 51, 51, 51, 51, 54, 15, 16, 17, 54, 51, 54, 54, 54, 15, 57, 17, 54, 54, 51, 51, 54, 15, 16, 17, 54, 51, 54, 54, 54, 15, 57, 17, 54, 54, 54, 54, 54, 15, 16, 17, 54, 54, 54, 54, 5, 50, 57, 49, 7, 54, 54, 54, 15, 57, 16, 57, 49, 7, 54, 54, 15, 16, 57, 57, 16, 17, 54, 54, 15, 57, 16, 16, 57, 17, 54, 52, 15, 16, 57, 57, 16, 17, 52, 52, 15, 57, 16, 16, 57, 17, 52, 52, 15, 16, 57, 57, 16, 17, 52, 52, 31, 32, 32, 32, 32, 33, 52, 52, 41, 42, 42, 42, 42, 43, 52, 52, 18, 19, 60, 60, 19, 20, 52, 52, 18, 60, 60, 60, 60, 20, 52, 53, 18, 60, 60, 60, 60, 20, 53, 53, 18, 60, 60, 60, 60, 20, 53, 53, 18, 60, 60, 60, 60, 20, 53, 53, 18, 60, 60, 60, 60, 20, 52, 53, 18, 60, 60, 60, 60, 20, 53, 53, 18, 60, 60, 60, 60, 20, 53, 53, 28, 38, 60, 60, 37, 30, 53, 53, 52, 18, 60, 60, 20, 52, 52, 54, 53, 18, 60, 60, 20, 52, 53, 54, 54, 18, 60, 60, 20, 53, 52, 54, 54, 18, 60, 60, 20, 53, 54, 51, 52, 18, 60, 60, 20, 52, 51, 51, 52, 18, 60, 60, 20, 52, 51, 54, 54, 18, 19, 19, 20, 54, 54, 54, 51, 34, 35, 35, 36, 51, 54, 54, 52, 41, 42, 42, 43, 52, 54, 54, 54, 34, 35, 35, 36, 54, 54, 54, 54, 44, 45, 45, 46, 54, 54, 53, 52, 31, 32, 32, 33, 54, 53, 52, 53, 41, 42, 42, 43, 53, 52, 53, 52, 34, 35, 35, 36, 52, 53, 52, 54, 44, 45, 45, 46, 53, 52, 53, 52, 31, 32, 32, 33, 52, 53, 54, 53, 41, 42, 42, 43, 53, 52, 53, 52, 34, 35, 35, 36, 52, 53, 52, 53, 44, 45, 45, 46, 53, 54, 52, 54, 15, 59, 59, 17, 54, 52, 52, 5, 50, 59, 59, 49, 7, 52, 52, 15, 61, 59, 59, 61, 17, 52, 52, 15, 61, 59, 59, 61, 17, 52, 53, 25, 40, 59, 59, 39, 27, 53, 53, 54, 31, 32, 32, 33, 54, 53, 53, 54, 44, 45, 45, 46, 54, 53, 53, 52, 15, 59, 59, 17, 52, 53, 53, 52, 15, 59, 59, 17, 52, 53, 53, 54, 15, 59, 59, 17, 54, 53, 53, 54, 15, 59, 59, 17, 54, 53, 53, 52, 31, 32, 32, 33, 52, 53, 53, 52, 41, 42, 42, 43, 52, 53, 52, 53, 18, 60, 60, 20, 51, 53, 52, 53, 18, 60, 60, 20, 51, 52, 52, 53, 18, 60, 60, 20, 53, 52, 52, 53, 28, 38, 60, 20, 53, 52, 54, 54, 54, 18, 19, 20, 53, 53, 54, 54, 54, 18, 19, 20, 53, 53, 52, 52, 52, 18, 19, 20, 52, 54, 51, 51, 8, 48, 37, 30, 52, 54, 53, 53, 18, 19, 20, 52, 52, 54, 53, 53, 18, 19, 20, 54, 54, 54, 52, 52, 18, 19, 20, 54, 54, 54, 52, 8, 48, 37, 30, 52, 52, 53, 53, 18, 19, 20, 53, 5, 6, 7, 53, 18, 19, 20, 52, 15, 61, 17, 53, 18, 19, 20, 52, 25, 26, 27, 53, 18, 60, 47, 10, 54, 52, 52, 53, 18, 60, 60, 20, 53, 53, 52, 52, 18, 60, 60, 47, 10, 53, 52, 52, 18, 60, 60, 60, 20, 54, 54, 52, 18, 60, 60, 60, 20, 54, 54, 53, 18, 60, 60, 60, 20, 53, 53, 52, 18, 60, 60, 60, 20, 54, 54, 52, 18, 60, 60, 60, 20, 54, 54, 52, 34, 35, 35, 35, 36, 54, 54, 51, 44, 45, 45, 45, 46, 51, 51, 51, 15, 59, 59, 59, 17, 53, 53, 51, 15, 59, 59, 59, 17, 53, 53, 54, 15, 59, 59, 59, 49, 7, 52, 52, 15, 59, 59, 59, 59, 17, 52, 54, 15, 59, 59, 59, 59, 17, 51, 52, 15, 59, 59, 59, 59, 17, 51, 52, 15, 59, 59, 59, 59, 17, 53, 52, 15, 59, 59, 59, 59, 17, 53, 52, 25, 40, 59, 59, 39, 27, 52, 54, 52, 15, 59, 59, 17, 52, 54, 53, 53, 15, 59, 59, 17, 53, 53, 51, 53, 31, 32, 32, 33, 53, 51, 52, 52, 44, 45, 45, 46, 52, 52, 54, 54, 15, 16, 16, 17, 54, 54, 52, 51, 15, 57, 57, 17, 52, 52, 52, 51, 15, 57, 57, 17, 52, 52, 52, 52, 15, 57, 57, 17, 51, 52, 53, 53, 15, 57, 57, 17, 53, 53, 53, 53, 15, 57, 57, 17, 51, 53, 54, 51, 15, 57, 57, 17, 54, 54, 51, 54, 15, 57, 57, 49, 7, 54, 52, 5, 50, 57, 57, 61, 49, 7, 52, 31, 32, 32, 32, 32, 32, 33, 52, 41, 42, 42, 42, 42, 42, 43, 8, 48, 56, 60, 60, 60, 56, 20, 34, 58, 55, 38, 60, 56, 19, 20, 44, 46, 52, 18, 60, 60, 56, 20, 15, 17, 52, 18, 60, 60, 60, 20, 15, 17, 52, 18, 60, 60, 60, 20, 15, 17, 52, 18, 60, 60, 60, 20, 15, 17, 52, 18, 60, 60, 60, 20, 15, 17, 52, 18, 60, 60, 60, 20, 15, 17, 53, 34, 35, 35, 35, 36, 15, 17, 53, 44, 45, 45, 45, 46, 15, 17, 53, 15, 59, 59, 59, 17, 15, 17, 53, 15, 59, 59, 59, 17, 15, 17, 53, 25, 40, 59, 59, 17, 15, 17, 53, 53, 15, 59, 59, 17, 25, 40, 6, 6, 50, 16, 39, 27, 51, 31, 32, 32, 32, 32, 33, 51, 52, 41, 42, 42, 42, 42, 43, 52, 53, 34, 35, 35, 35, 35, 36, 53, 53, 41, 42, 42, 42, 42, 43, 53, 52, 18, 62, 60, 60, 62, 20, 52, 52, 18, 60, 60, 60, 60, 20, 52, 52, 18, 62, 60, 60, 62, 20, 52, 54, 18, 60, 60, 60, 60, 20, 54, 52, 18, 62, 60, 60, 62, 20, 52, 52, 18, 60, 60, 60, 60, 20, 52, 51, 18, 62, 60, 60, 62, 20, 52, 53, 18, 60, 60, 60, 60, 20, 53, 52, 18, 62, 60, 60, 62, 20, 52, 52, 18, 60, 60, 60, 60, 20, 51, 52, 18, 62, 60, 60, 62, 20, 51, 52, 18, 60, 60, 60, 60, 20, 52, 52, 18, 62, 60, 60, 62, 20, 52, 52, 18, 60, 60, 60, 60, 20, 52, 8, 48, 60, 60, 60, 60, 47, 10, 18, 60, 60, 60, 60, 60, 60, 20, 18, 60, 60, 60, 60, 60, 60, 20, 18, 60, 60, 60, 60, 60, 60, 20, 18, 60, 60, 60, 60, 60, 60, 20, 18, 60, 60, 60, 60, 60, 60, 20, 18, 19, 60, 60, 60, 60, 19, 20, 34, 35, 35, 35, 35, 35, 35, 36, 44, 45, 45, 45, 45, 45, 45, 46, 15, 57, 39, 26, 26, 40, 57, 17, 15, 39, 27, 52, 52, 25, 40, 17, 15, 17, 54, 53, 53, 54, 15, 17, 15, 17, 54, 53, 53, 54, 15, 17, 15, 17, 53, 54, 54, 53, 15, 17, 15, 17, 53, 53, 53, 53, 15, 17, 15, 49, 7, 52, 52, 5, 50, 17, 15, 57, 49, 6, 6, 50, 57, 17, 25, 40, 16, 16, 16, 16, 39, 27, 53, 15, 57, 59, 59, 57, 17, 53, 51, 15, 57, 59, 59, 57, 17, 53, 53, 15, 57, 59, 59, 57, 17, 51, 53, 15, 57, 59, 59, 57, 17, 53, 52, 15, 16, 16, 16, 16, 17, 52, 54, 31, 32, 32, 32, 32, 33, 54, 54, 44, 45, 45, 45, 45, 46, 54, 51, 15, 16, 16, 16, 16, 17, 52, 52, 15, 59, 59, 59, 59, 17, 52, 54, 15, 59, 59, 59, 59, 17, 51, 52, 15, 59, 59, 59, 59, 17, 51, 52, 15, 59, 59, 59, 59, 17, 52, 54, 31, 32, 32, 32, 32, 33, 54, 54, 41, 42, 42, 42, 42, 43, 54, 7, 18, 56, 60, 60, 56, 20, 5, 17, 18, 60, 60, 60, 60, 20, 15, 17, 18, 60, 60, 60, 60, 20, 15, 17, 18, 60, 60, 60, 60, 20, 15, 17, 18, 60, 60, 60, 60, 20, 15, 17, 18, 60, 60, 60, 60, 20, 15, 17, 18, 60, 60, 60, 60, 20, 15, 17, 18, 60, 60, 60, 60, 20, 15, 27, 18, 56, 60, 60, 56, 20, 25, 54, 28, 38, 60, 60, 37, 30, 54, 54, 53, 34, 35, 35, 36, 53, 54, 52, 52, 44, 45, 45, 46, 52, 52, 52, 52, 15, 16, 16, 17, 52, 52, 53, 53, 15, 16, 16, 17, 53, 53, 54, 53, 25, 26, 26, 27, 53, 54],
				objects: [
					{id: 'player', x: 400, y: 20300}
				]
			}
		};

		return {
			Levels: Levels
		};
	});
