import React, { useState, useEffect, useContext, useReducer } from "react"
// import ReactDOM from "react-dom"
import Spritesheet from "react-responsive-spritesheet"
import { Box, ThemeProvider, createTheme, zIndex} from '@mui/system';
import Player from "./Player"
// import debounce from 'lodash.debounce'
// import { keybindings } from './keys'
// import { KeysContext } from './index'

// import { css } from "emotion"
// import { keybindings } from "./keys"
// import Player from "./Player"
import avatar from '../../utils/spriteSheets/current/char4.png'
import overalls from '../../utils/spriteSheets/current/overalls.png'
import braids from '../../utils/spriteSheets/current/braids.png'

export default function Inventory() {
    return (

    <Box sx={{width: '10%'}}>
            <Spritesheet
                style = {{
                    imageRendering: 'pixelated',
                    position : 'absolute',
                    width : '50%'
                }}
                image={avatar}
                widthFrame={32}
                heightFrame={32}
                // steps={1}
                fps={10}
                loop={false}
                startAt={1}
                endAt={1}
                isResponsive={true}
                />
      
            <Spritesheet
                style = {{
                    imageRendering: 'pixelated',
                    position: 'absolute',
                    width: '50%'
                }}
                image={overalls}
                widthFrame={32}
                heightFrame={32}
                steps={1}
                fps={10}
                loop={true}
                startAt={1}
                endAt={1}
                isResponsive={true}
                />
       
           
            <Spritesheet
                style = {{
                    imageRendering: 'pixelated',
                    position: 'absolute',
                    width: '50%'
                }}
                image={braids}
                widthFrame={32}
                heightFrame={32}
                steps={1}
                fps={10}
                loop={true}
                startAt={0}
                endAt={10}
                isResponsive={true}
            />    
       
    </Box>
      )
 }



 



 

 




// 1) Given an id for a particular item 
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page



// We'll have a final json file that maps the player items to the correct sprite item. 

