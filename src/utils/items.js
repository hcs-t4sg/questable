import React, { useState, useEffect, useContext, useReducer } from "react"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex } from '@mui/system';
import _, { map } from 'underscore';

import body from '../assets/spriteSheets/characters/char_all.png';

import bob from 'src/assets/spriteSheets/hair/bob.png';
import braids from 'src/assets/spriteSheets/hair/braids.png';
import buzzcut from 'src/assets/spriteSheets/hair/buzzcut.png';
import curly from 'src/assets/spriteSheets/hair/curly.png';
import emo from 'src/assets/spriteSheets/hair/emo.png';
import extra_long_skirt from 'src/assets/spriteSheets/hair/extra_long_skirt.png';
import extra_long from 'src/assets/spriteSheets/hair/extra_long.png';
import french_curl from 'src/assets/spriteSheets/hair/french_curl.png';
import gentleman from 'src/assets/spriteSheets/hair/gentleman.png';
import long_straight from 'src/assets/spriteSheets/hair/long_straight.png';
import long_straight_skirt from 'src/assets/spriteSheets/hair/long_straight_skirt.png';
import midiwave from 'src/assets/spriteSheets/hair/midiwave.png';
import ponytail from 'src/assets/spriteSheets/hair/ponytail.png';
import spacebuns from 'src/assets/spriteSheets/hair/spacebuns.png';
import wavy from 'src/assets/spriteSheets/hair/wavy.png';

import shirt from '../assets/spriteSheets/clothes/basic.png';
import pants from '../assets/spriteSheets/clothes/pants.png';
import shoes from '../assets/spriteSheets/clothes/shoes.png';

// Guide to classes in Javascript: https://dmitripavlutin.com/javascript-classes-complete-guide/#32-private-instance-fields


// Arrays mapping item IDs to their respective colors for names/descriptions. Order important.
// Note that in our local data structure, item ID, spritesheet location, and color all correspond.
const clothingColors = ['black', 'dark blue', 'light blue', 'brown', 'dark green', 'light green', 'pink', 'purple', 'red', 'beige'];
const hairColors = ['black', 'blonde', 'dark brown', 'light brown', 'ginger', 'dark green', 'light green', 'gray', 'light purple', 'blue', 'pink', 'purple', 'red', 'turquoise'];

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
      this.name = "Body" + id.toString();
      this.description = "A skin tone for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={body}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart}
            isResponsive={true}
         />
      )
   }

   renderAnimated() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={body}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export class Hair {
   id;
   name;
   description;
   #spriteStart;
   type = "hair";
   subtype;

   // Import object to allow the correct image import based on the subtype string. This is a static private field of the class
   static #imports = { bob, braids, buzzcut, curly, emo, extra_long_skirt, extra_long, french_curl, gentleman, long_straight_skirt, long_straight, midiwave, ponytail, spacebuns, wavy }

   constructor(id, subtype) {
      this.id = id;
      this.name = _.capitalize(hairColors[id]) + this.subtype.replaceAll('_', ' ') + "hair";
      this.description = _.capitalize(hairColors[id]) + this.subtype.replaceAll('_', ' ') + "hair for your avatar!";
      this.#spriteStart = 8 * id + 1;
      this.subtype = subtype;
   }

   renderStatic() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={Hair.#imports[this.subtype]}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart}
            isResponsive={true}
         />
      )
   }

   renderAnimated() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={Hair.#imports[this.subtype]}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export class Shirt {
   id;
   name;
   description;
   #spriteStart;
   type = "shirt";

   constructor(id, subtype) {
      this.id = id;
      this.name = _.capitalize(clothingColors[id]) + "shirt";
      this.description = "A " + _.capitalize(clothingColors[id]) + " shirt for your avatar!";
      this.#spriteStart = 8 * id + 1;
      this.subtype = subtype;
   }

   renderStatic() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={shirt}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart}
            isResponsive={true}
         />
      )
   }

   renderAnimated() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={shirt}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart + 7}
            isResponsive={true}
         />
      )
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
      this.name = _.capitalize(clothingColors[id]) + "pants";
      this.description = _.capitalize(clothingColors[id]) + "pants for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={pants}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart}
            isResponsive={true}
         />
      )
   }

   renderAnimated() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={pants}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart + 7}
            isResponsive={true}
         />
      )
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
      this.name = _.capitalize(clothingColors[id]) + "shoes";
      this.description = _.capitalize(clothingColors[id]) + "shoes for your avatar!";
      this.#spriteStart = 8 * id + 1;
   }

   renderStatic() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={shoes}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart}
            isResponsive={true}
         />
      )
   }

   renderAnimated() {
      return (
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={shoes}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={this.#spriteStart}
            endAt={this.#spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

// Functions to generate all items of a given type in the game (for use in Shop)

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