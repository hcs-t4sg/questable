/* eslint-disable camelcase */
import React from 'react'
import { Spritesheet } from './Spritesheet'
import { capitalize } from 'lodash'

import body from '../assets/spriteSheets/characters/char_all.png'

import bob from '../assets/spriteSheets/hair/bob.png'
import braids from '../assets/spriteSheets/hair/braids.png'
import buzzcut from '../assets/spriteSheets/hair/buzzcut.png'
import curly from '../assets/spriteSheets/hair/curly.png'
import emo from '../assets/spriteSheets/hair/emo.png'
import extra_long_skirt from '../assets/spriteSheets/hair/extra_long_skirt.png'
import extra_long from '../assets/spriteSheets/hair/extra_long.png'
import french_curl from '../assets/spriteSheets/hair/french_curl.png'
import gentleman from '../assets/spriteSheets/hair/gentleman.png'
import long_straight from '../assets/spriteSheets/hair/long_straight.png'
import long_straight_skirt from '../assets/spriteSheets/hair/long_straight_skirt.png'
import midiwave from '../assets/spriteSheets/hair/midiwave.png'
import ponytail from '../assets/spriteSheets/hair/ponytail.png'
import spacebuns from '../assets/spriteSheets/hair/spacebuns.png'
import wavy from '../assets/spriteSheets/hair/wavy.png'

import shirt from '../assets/spriteSheets/clothes/basic.png'
import pants from '../assets/spriteSheets/clothes/pants.png'
import shoes from '../assets/spriteSheets/clothes/shoes.png'
import reward from '../assets/spriteSheets/rewards/all_rewards.png'
import { Item, Player } from '../types'
import eyes from '../assets/spriteSheets/eyes/eyes.png'
import CircleIcon from '@mui/icons-material/Circle'
import { Box, Stack } from '@mui/material'
import blue3 from '/src/assets/spriteSheets/potions/blue3.png'
import green3 from '/src/assets/spriteSheets/potions/green3.png'
import purple3 from '/src/assets/spriteSheets/potions/purple3.png'
import red3 from '/src/assets/spriteSheets/potions/red3.png'

// Functions and classes pertaining to rendering of item/clothing sprites

// Guide to classes in Javascript: https://dmitripavlutin.com/javascript-classes-complete-guide/#32-private-instance-fields

// Arrays mapping item IDs to their respective colors for names/descriptions. Order important.
// Note that in our local data structure, item ID, spritesheet location, and color all correspond.
const clothingColors = [
	'black',
	'dark blue',
	'light blue',
	'brown',
	'dark green',
	'light green',
	'pink',
	'purple',
	'red',
	'beige',
]
const hairColors = [
	'black',
	'blonde',
	'dark brown',
	'light brown',
	'ginger',
	'dark green',
	'light green',
	'gray',
	'light purple',
	'blue',
	'pink',
	'purple',
	'red',
	'turquoise',
]

const eyeColors: { name: string; hex: string }[] = [
	{ name: 'black', hex: '#362f2d' },
	{ name: 'dark blue', hex: '#354652' },
	{ name: 'light blue', hex: '#546e8a' },
	{ name: 'brown', hex: '#4d3530' },
	{ name: 'dark brown', hex: '#2e2723' },
	{ name: 'light brown', hex: '#754b44' },
	{ name: 'green', hex: '#475c4e' },
	{ name: 'dark green', hex: '#24382d' },
	{ name: 'light green', hex: '#637d64' },
	{ name: 'gray', hex: '#544b4e' },
	{ name: 'light gray', hex: '#6e656a' },
	{ name: 'pink', hex: '#b04f63' },
	{ name: 'light pink', hex: '#c26576' },
	{ name: 'red', hex: '#a64444' },
]

// Render function to generate item sprites
export default function render(file: string, spriteStart: number, doAnimation: boolean) {
	// Import object to allow the correct image import based on the subtype string.
	//* Reference: https://dev.to/mapleleaf/indexing-objects-in-typescript-1cgi
	const imports: { [key: string]: string } = {
		bob,
		braids,
		buzzcut,
		curly,
		emo,
		extra_long_skirt,
		extra_long,
		french_curl,
		gentleman,
		long_straight_skirt,
		long_straight,
		midiwave,
		ponytail,
		spacebuns,
		wavy,
		body,
		shirt,
		pants,
		shoes,
		reward,
		eyes,
	}

	return (
		<Spritesheet
			style={{
				imageRendering: 'pixelated',
				position: 'absolute',
				width: '100%',
			}}
			image={imports[file]}
			widthFrame={32}
			heightFrame={32}
			fps={10}
			loop={true}
			startAt={spriteStart}
			endAt={doAnimation ? spriteStart + 7 : spriteStart}
			isResponsive={true}
			steps={doAnimation ? 8 : 1}
			direction='forward'
		/>
	)
}

/* Class description for Body, Shirt, Pants, Shoes, Eyes:

Fields:
- id: Integer starting from 0 that corresponds to the color of the item (see above mappings) and the spritesheet location of the item. Note that items across different types or subtypes may have the same id.
- name: Item name to be displayed on frontend
- description: Item description to be displayed on frontend
- #spriteStart: A private field (not accessible outside class) for accessing the correct spritesheet location
- type: Type of the item ('body', 'shirt', 'pants', 'shoes', 'eyes')

Methods:
- renderStatic(): Display an unmoving version of the item
- renderAnimated(): Display an animated version of the item

Keep in mind that rendered sprites display with 'absolute' positioning and will fill their container. You need to set a container with a defined width if you are displaying the sprite by itself (such as in shop).
*/

/*
Class description for Hair:
Same as above, but there is an additional 'subtype' field. This corresponds to the hairstyle. Again, items with different 'subtype' fields can have the same 'id'
*/

export class Body implements Item {
	id
	name
	description
	#spriteStart
	type = 'body' as const
	price = 0

	constructor(id: number) {
		this.id = id
		this.name = 'Body ' + id.toString()
		this.description = 'A skin tone for your avatar!'
		this.#spriteStart = 8 * id + 1
	}

	renderStatic() {
		return render('body', this.#spriteStart, false)
	}

	renderAnimated() {
		return render('body', this.#spriteStart, true)
	}
}

export class Hair implements Item {
	id
	name
	description
	#spriteStart
	type = 'hair' as const
	subtype
	price = 100

	constructor(id: number, subtype: string) {
		this.id = id
		this.name = capitalize(hairColors[id]) + ' ' + subtype.replaceAll('_', ' ') + ' hair'
		this.description =
			capitalize(hairColors[id]) + ' ' + subtype.replaceAll('_', ' ') + ' hair for your avatar!'
		this.#spriteStart = 8 * id + 1
		this.subtype = subtype
	}

	renderStatic() {
		return render(this.subtype, this.#spriteStart, false)
	}

	renderAnimated() {
		return render(this.subtype, this.#spriteStart, true)
	}
}

export class Shirt implements Item {
	id
	name
	description
	#spriteStart
	type = 'shirt' as const
	price = 150

	constructor(id: number) {
		this.id = id
		this.name = capitalize(clothingColors[id]) + ' shirt'
		this.description = 'A ' + clothingColors[id] + ' shirt for your avatar!'
		this.#spriteStart = 8 * id + 1
	}

	renderStatic() {
		return render('shirt', this.#spriteStart, false)
	}

	renderAnimated() {
		return render('shirt', this.#spriteStart, true)
	}
}

export class Pants implements Item {
	id
	name
	description
	#spriteStart
	type = 'pants' as const
	price = 150

	constructor(id: number) {
		this.id = id
		this.name = capitalize(clothingColors[id]) + ' pants'
		this.description = capitalize(clothingColors[id]) + ' pants for your avatar!'
		this.#spriteStart = 8 * id + 1
	}

	renderStatic() {
		return render('pants', this.#spriteStart, false)
	}

	renderAnimated() {
		return render('pants', this.#spriteStart, true)
	}
}

export class Shoes implements Item {
	id
	name
	description
	#spriteStart
	type = 'shoes' as const
	price = 100

	constructor(id: number) {
		this.id = id
		this.name = capitalize(clothingColors[id]) + ' shoes'
		this.description = capitalize(clothingColors[id]) + ' shoes for your avatar!'
		this.#spriteStart = 8 * id + 1
	}

	renderStatic() {
		return render('shoes', this.#spriteStart, false)
	}

	renderAnimated() {
		return render('shoes', this.#spriteStart, true)
	}
}

export class Eyes implements Item {
	id
	name
	description
	#spriteStart
	type = 'eyes' as const
	price = 0

	constructor(id: number) {
		this.id = id
		this.name = capitalize(eyeColors[id].name) + ' eyes'
		this.description = capitalize(eyeColors[id].name) + ' eyes for your avatar!'
		this.#spriteStart = 8 * id + 1
	}

	renderStatic() {
		return render('eyes', this.#spriteStart, false)
	}

	renderAnimated() {
		return render('eyes', this.#spriteStart, true)
	}

	renderSwatch() {
		return (
			<Stack justifyContent='center' flexDirection='row' sx={{ pt: 3 }}>
				<CircleIcon style={{ color: eyeColors[this.id].hex, fontSize: '300%' }} />
			</Stack>
		)
	}
}

// Functions to generate all items of a given type in the game (for use in Shop).
// Items are returned as an array of Item objects which can then be individually rendered.

export function getBodyItems() {
	// Generate id array from 0 to 7
	const idList = [...Array(8).keys()]
	const bodyItems = idList.map((id) => new Body(id))

	return bodyItems
}

export function getHairItems() {
	const hairSubtypes = [
		'bob',
		'braids',
		'buzzcut',
		'curly',
		'emo',
		'extra_long_skirt',
		'extra_long',
		'french_curl',
		'gentleman',
		'long_straight',
		'long_straight_skirt',
		'midiwave',
		'ponytail',
		'spacebuns',
		'wavy',
	]

	const bigArray = hairSubtypes.map((subtype) => {
		const idList = [...Array(14).keys()]

		const hairItems = idList.map((id) => new Hair(id, subtype))

		return hairItems
	})

	// Flatten the 2D array created from the nested maps
	return bigArray.flat()
}

export function getAllShirtItems() {
	const idList = [...Array(10).keys()]
	const shirtItems = idList.map((id) => new Shirt(id))

	return shirtItems
}

export function getAllPantsItems() {
	const idList = [...Array(10).keys()]
	const pantsItems = idList.map((id) => new Pants(id))

	return pantsItems
}

export function getAllShoesItems() {
	const idList = [...Array(10).keys()]
	const shoesItems = idList.map((id) => new Shoes(id))

	return shoesItems
}

export function getAllEyesItems() {
	const idList = [...Array(14).keys()]
	const eyesItems = idList.map((id) => new Eyes(id))

	return eyesItems
}

export class Reward {
	id
	name
	#spriteStart

	constructor(id: number) {
		this.id = id
		this.name = 'Reward' + id.toString()
		this.#spriteStart = 1 * id + 1
	}

	renderStatic() {
		return render('reward', this.#spriteStart, false)
	}

	renderAnimated() {
		return render('reward', this.#spriteStart, true)
	}
}

export function getRewardItems() {
	const idList = [...Array(10).keys()]
	const rewardItems = idList.map((id) => new Reward(id))

	return rewardItems
}

export function currentAvatar(player: Player) {
	let playerHair
	if (player.avaHairSubtype) {
		if (player.avaHair) {
			playerHair = new Hair(player.avaHair, player.avaHairSubtype)
		} else {
			playerHair = new Hair(0, player.avaHairSubtype)
		}
	} else {
		if (player.avaHair) {
			playerHair = new Hair(player.avaHair, 'bob')
		} else {
			playerHair = new Hair(0, 'bob')
		}
	}

	const playerOutfit = {
		body: player.avaBody ? new Body(player.avaBody) : new Body(0),
		shirt: player.avaShirt ? new Shirt(player.avaShirt) : new Shirt(0),
		hair: playerHair,
		pants: player.avaPants ? new Pants(player.avaPants) : new Pants(0),
		shoes: player.avaShoes ? new Shoes(player.avaShoes) : new Shoes(0),
		eyes: player.avaEyes ? new Eyes(player.avaEyes) : new Eyes(0),
	}

	return playerOutfit
}

// Displays potion sprite representing a particular assignment (task/repeatable) depending on the reward amount for that assignment
export function assignmentPotion(rewardAmount: number) {
	// TODO: This needs to be kept in sync with the options for assignment rewards in Questable (such as during task/repeatable creation), so these values should be refactored into a master list of parameters that is referenced globally
	const rewardMatch =
		rewardAmount === 10
			? blue3
			: rewardAmount === 20
			? green3
			: rewardAmount === 30
			? purple3
			: rewardAmount === 40
			? red3
			: ''

	return (
		<Box
			component='img'
			sx={{
				imageRendering: 'pixelated',
				maxHeight: { xs: 140, md: 200 },
				maxWidth: { xs: 140, md: 200 },
				minWidth: '28px',
				minHeight: '31.5px',
				position: 'relative',
			}}
			alt='Potion'
			src={rewardMatch}
			height='100%'
			width='100%'
		/>
	)
}
