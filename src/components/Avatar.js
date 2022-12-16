import React, { useState, useEffect, useContext, useReducer } from "react"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex } from '@mui/system';
import { Body, Hair, Shirt, Pants, Shoes, getBodyItems, getHairItems, getShirtItems, getPantsItems, getShoesItems } from '../utils/items';
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

/* Renders the player's avatar sprite. 

Keep in mind that the sprite stretches to fill its parent container. When using this, you must place <Avatar /> inside a parent MUI component with a defined width! */

export default function Avatar({ outfit }) {

   return (
      <Box sx={{
         width: '100%',
         position: 'relative',
      }}>
         {outfit.body.renderStatic()}
         {outfit.hair.renderStatic()}
         {outfit.shirt.renderStatic()}
         {outfit.pants.renderStatic()}
         {outfit.shoes.renderStatic()}
      </Box>
   )
}