import React, { useState, useEffect, useContext, useReducer } from "react"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex } from '@mui/system';
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



// Do a class approach for each item type because otherwise we would need to link specific spritesheets to IDs which is hard. If we need to add generic item properties we can always add a superclass of Item. 

export class Body {
   id;
   name;
   description;
   spriteStart;
   type = "body";

   constructor(id) {
      this.id = id;
      this.name = "Body" + id.toString();
      this.description = "A skin tone for your avatar!";
      this.spriteStart = 8 * id + 1;
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
            startAt={this.spriteStart}
            endAt={this.spriteStart}
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
            startAt={this.spriteStart}
            endAt={this.spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export class Hair {
   id;
   name;
   description;
   spriteStart;
   type = "hair";
   subtype;

   static #imports = { bob, braids, buzzcut, curly, emo, extra_long_skirt, extra_long, french_curl, gentleman, long_straight_skirt, long_straight, midiwave, ponytail, spacebuns, wavy }

   constructor(id, subtype) {
      this.id = id;
      this.name = "Hair" + id.toString();
      this.description = "Hair for your avatar!";
      this.spriteStart = 8 * id + 1;
      this.subtype = subtype;
   }

   // Figure out how to conditionally import hair files to use in render. Dynamic imports?

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
            startAt={this.spriteStart}
            endAt={this.spriteStart}
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
            startAt={this.spriteStart}
            endAt={this.spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export class Shirt {
   id;
   name;
   description;
   spriteStart;
   type = "shirt";

   constructor(id, subtype) {
      this.id = id;
      this.name = "Shirt" + id.toString();
      this.description = "A shirt for your avatar!";
      this.spriteStart = 8 * id + 1;
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
            startAt={this.spriteStart}
            endAt={this.spriteStart}
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
            startAt={this.spriteStart}
            endAt={this.spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export class Pants {
   id;
   name;
   description;
   spriteStart;
   type = "pants";

   constructor(id) {
      this.id = id;
      this.name = "Pants" + id.toString();
      this.description = "Pants for your avatar!";
      this.spriteStart = 8 * id + 1;
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
            startAt={this.spriteStart}
            endAt={this.spriteStart}
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
            startAt={this.spriteStart}
            endAt={this.spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export class Shoes {
   id;
   name;
   description;
   spriteStart;
   type = "shoes";

   constructor(id) {
      this.id = id;
      this.name = "Shoes" + id.toString();
      this.description = "Shoes for your avatar!";
      this.spriteStart = 8 * id + 1;
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
            startAt={this.spriteStart}
            endAt={this.spriteStart}
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
            startAt={this.spriteStart}
            endAt={this.spriteStart + 7}
            isResponsive={true}
         />
      )
   }
}

export function getBodyItems() {
   // Generate array from 0 to 7
   const bodyList = [...Array(8).keys()];
   const bodyItems = bodyList.map((index) => new Body(index));

   return bodyItems;
}

export function getHairItems() {
   const hairList = [
      'bob', 'braids', 'buzzcut', 'curly', 'emo', 'extra_long_skirt', 'extra_long', 'french_curl', 'gentleman', 'long_straight', 'long_straight_skirt', 'midiwave', 'ponytail', 'spacebuns', 'wavy'
   ];

   const bigArray = hairList.map((subtype) => {

      const colorList = [...Array(14).keys()];

      const hairColors = colorList.map((index) => new Hair(index, subtype));

      return hairColors
   })

   return bigArray.flat()
};

export function getShirtItems() {
   const shirtList = [...Array(10).keys()];
   const shirtItems = shirtList.map((index) => new Shirt(index));

   return shirtItems;
}

export function getPantsItems() {
   const pantsList = [...Array(10).keys()];
   const pantsItems = pantsList.map((index) => new Pants(index));

   return pantsItems;
}

export function getShoesItems() {
   const shoesList = [...Array(10).keys()];
   const shoesItems = shoesList.map((index) => new Shoes(index));

   return shoesItems;
}