import React, { useState, useEffect, useContext, useReducer } from "react"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex } from '@mui/system';
import body from '../assets/spriteSheets/characters/char4.png';
import hair from '../assets/spriteSheets/hair/braids.png';
import shirt from '../assets/spriteSheets/clothes/basic.png';
import pants from '../assets/spriteSheets/clothes/pants.png';
import shoes from '../assets/spriteSheets/clothes/shoes.png';

export default function Avatar({ outfit }) {
   return (
      <Box sx={{ width: '10%' }}>
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
            startAt={1}
            endAt={1}
            isResponsive={true}
         />
         <Spritesheet
            style={{
               imageRendering: 'pixelated',
               position: 'absolute',
               width: '50%'
            }}
            image={hair}
            widthFrame={32}
            heightFrame={32}
            fps={10}
            loop={true}
            startAt={1}
            endAt={1}
            isResponsive={true}
         />
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
            startAt={1}
            endAt={1}
            isResponsive={true}
         />
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
            startAt={1}
            endAt={1}
            isResponsive={true}
         />
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
            startAt={1}
            endAt={1}
            isResponsive={true}
         />
      </Box>
   )
}