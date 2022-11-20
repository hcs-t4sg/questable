import React, { useState, useEffect, useContext, useReducer } from "react"
// import ReactDOM from "react-dom"
import Spritesheet from "react-responsive-spritesheet"
import Player from "./Player"
// import debounce from 'lodash.debounce'
// import { keybindings } from './keys'
// import { KeysContext } from './index'

// import { css } from "emotion"
// import { keybindings } from "./keys"
// import Player from "./Player"
import avatar from '../../utils/spriteSheets/current/char4.png'



export default function Inventory() {
    return (

        <div>
             <Spritesheet
                image={avatar}
                widthFrame={32}
                heightFrame={32}
                steps={1}
                fps={10}
                loop={false}
                startAt={0}
                endAt={0}
                isResponsive={true}
                />
        </div>
       

        // <div>
        //     <h1>Inventory</h1>
        //   {/* <KeysContext.Provider value={keysDown}> */}
        //     <Player />
        //     <img src={avatar} alt="avatar_sprite"/>
        //   {/* </KeysContext.Provider> */}
        // </div>
      )
 }


 //Making the avatar display 
 let animationMapping = {
    right: [6, 9],
    left: [2, 5],
    up: [12, 15],
    down: [17, 20],
  }
  
//   let spriteClass = css`
//     width: 150px;
//     position: absolute;
//     top: 0;
//     left: 0;`


 



 

 




// 1) Given an id for a particular item 
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page



// We'll have a final json file that maps the player items to the correct sprite item. 

