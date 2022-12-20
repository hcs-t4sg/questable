// import React, { useState, useEffect, useContext, useReducer } from "react"
import React from 'react'
import Spritesheet from "react-responsive-spritesheet"
// import { Box, ThemeProvider, createTheme, zIndex } from '@mui/system';
import { capitalize } from 'lodash';

import body from '../assets/spriteSheets/characters/char_all.png';

import bob from '../assets/spriteSheets/hair/bob.png';
import braids from '../assets/spriteSheets/hair/braids.png';
import buzzcut from '../assets/spriteSheets/hair/buzzcut.png';
import curly from '../assets/spriteSheets/hair/curly.png';
import emo from '../assets/spriteSheets/hair/emo.png';
import extra_long_skirt from '../assets/spriteSheets/hair/extra_long_skirt.png';
import extra_long from '../assets/spriteSheets/hair/extra_long.png';
import french_curl from '../assets/spriteSheets/hair/french_curl.png';
import gentleman from '../assets/spriteSheets/hair/gentleman.png';
import long_straight from '../assets/spriteSheets/hair/long_straight.png';
import long_straight_skirt from '../assets/spriteSheets/hair/long_straight_skirt.png';
import midiwave from '../assets/spriteSheets/hair/midiwave.png';
import ponytail from '../assets/spriteSheets/hair/ponytail.png';
import spacebuns from '../assets/spriteSheets/hair/spacebuns.png';
import wavy from '../assets/spriteSheets/hair/wavy.png';

import shirt from '../assets/spriteSheets/clothes/basic.png';
import pants from '../assets/spriteSheets/clothes/pants.png';
import shoes from '../assets/spriteSheets/clothes/shoes.png';

// Guide to classes in Javascript: https://dmitripavlutin.com/javascript-classes-complete-guide/#32-private-instance-fields


// Arrays mapping item IDs to their respective colors for names/descriptions. Order important.
// Note that in our local data structure, item ID, spritesheet location, and color all correspond.
const clothingColors = ['black', 'dark blue', 'light blue', 'brown', 'dark green', 'light green', 'pink', 'purple', 'red', 'beige'];
const hairColors = ['black', 'blonde', 'dark brown', 'light brown', 'ginger', 'dark green', 'light green', 'gray', 'light purple', 'blue', 'pink', 'purple', 'red', 'turquoise'];


// Render function to generate item sprites
export default function render(file, spriteStart, doAnimation) {
   // Import object to allow the correct image import based on the subtype string.
   const imports = { bob, braids, buzzcut, curly, emo, extra_long_skirt, extra_long, french_curl, gentleman, long_straight_skirt, long_straight, midiwave, ponytail, spacebuns, wavy, body, shirt, pants, shoes }

   return (
      <Spritesheet
         style={{
            imageRendering: 'pixelated',
            position: 'absolute',
            width: '100%'
         }}
         image={imports[file]}
         widthFrame={32}
         heightFrame={32}
         fps={10}
         loop={true}
         startAt={spriteStart}
         endAt={doAnimation ? spriteStart + 7 : spriteStart}
         isResponsive={true}
      />
   )
}

/* Class description for Body, Shirt, Pants, Shoes:

Fields:
- id: Integer starting from 0 that corresponds to the color of the item (see above mappings) and the spritesheet location of the item. Note that items across different types or subtypes may have the same id.
- name: Item name to be displayed on frontend
- description: Item description to be displayed on frontend
- #spriteStart: A private field (not accessible outside class) for accessing the correct spritesheet location
- type: Type of the item ('body', 'shirt', 'pants', 'shoes')

Methods:
- renderStatic(): Display an unmoving version of the item
- renderAnimated(): Display an animated version of the item

Keep in mind that rendered sprites display with 'absolute' positioning and will fill their container. You need to set a container with a defined width if you are displaying the sprite by itself (such as in shop).
*/

/*
Class description for Hair:
Same as above, but there is an additional 'subtype' field. This corresponds to the hairstyle. Again, items with different 'subtype' fields can have the same 'id'
*/

export class Body {
   id;
   name;
   description;
   #spriteStart;
   type = "body";

   constructor(id) {
      this.id = id;
      this.name = "Body " + id.toString();
      this.description = "A skin tone for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return render("body", this.#spriteStart, false)
   }

   renderAnimated() {
      return render("body", this.#spriteStart, true)
   }
}

export class Hair {
   id;
   name;
   description;
   #spriteStart;
   type = "hair";
   subtype;

   constructor(id, subtype) {
      this.id = id;
      this.name = capitalize(hairColors[id]) + " " + subtype.replaceAll('_', ' ') + " hair";
      this.description = capitalize(hairColors[id]) + " " + subtype.replaceAll('_', ' ') + " hair for your avatar!";
      this.#spriteStart = 8 * id + 1;
      this.subtype = subtype;
   }

   renderStatic() {
      return render(this.subtype, this.#spriteStart, false)
   }

   renderAnimated() {
      return render(this.subtype, this.#spriteStart, true)
   }
}

export class Shirt {
   id;
   name;
   description;
   #spriteStart;
   type = "shirt";

   constructor(id) {
      this.id = id;
      this.name = capitalize(clothingColors[id]) + " shirt";
      this.description = "A " + clothingColors[id] + " shirt for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return render("shirt", this.#spriteStart, false)
   }

   renderAnimated() {
      return render("shirt", this.#spriteStart, true)
   }
}

export class Pants {
   id;
   name;
   description;
   #spriteStart;
   type = "pants";

   constructor(id) {
      this.id = id;
      this.name = capitalize(clothingColors[id]) + " pants";
      this.description = capitalize(clothingColors[id]) + " pants for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return render("pants", this.#spriteStart, false)
   }

   renderAnimated() {
      return render("pants", this.#spriteStart, true)
   }
}

export class Shoes {
   id;
   name;
   description;
   #spriteStart;
   type = "shoes";

   constructor(id) {
      this.id = id;
      this.name = capitalize(clothingColors[id]) + " shoes";
      this.description = capitalize(clothingColors[id]) + " shoes for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return render("shoes", this.#spriteStart, false)
   }

   renderAnimated() {
      return render("shoes", this.#spriteStart, true)
   }
}

// Functions to generate all items of a given type in the game (for use in Shop).
// Items are returned as an array of Item objects which can then be individually rendered.

export function getBodyItems() {
   // Generate id array from 0 to 7
   const idList = [...Array(8).keys()];
   const bodyItems = idList.map((id) => new Body(id));

   return bodyItems;
}

export function getHairItems() {
   const hairSubtypes = [
      'bob', 'braids', 'buzzcut', 'curly', 'emo', 'extra_long_skirt', 'extra_long', 'french_curl', 'gentleman', 'long_straight', 'long_straight_skirt', 'midiwave', 'ponytail', 'spacebuns', 'wavy'
   ];

   const bigArray = hairSubtypes.map((subtype) => {

      const idList = [...Array(14).keys()];

      const hairItems = idList.map((id) => new Hair(id, subtype));

      return hairItems
   })

   // Flatten the 2D array created from the nested maps
   return bigArray.flat()
};

export function getShirtItems() {
   const idList = [...Array(10).keys()];
   const shirtItems = idList.map((id) => new Shirt(id));

   return shirtItems;
}

export function getPantsItems() {
   const idList = [...Array(10).keys()];
   const pantsItems = idList.map((id) => new Pants(id));

   return pantsItems;
}

export function getShoesItems() {
   const idList = [...Array(10).keys()];
   const shoesItems = idList.map((id) => new Shoes(id));

   return shoesItems;
}