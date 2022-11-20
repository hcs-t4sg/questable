import React, { useState, useEffect, useContext, useReducer } from "react"
// import ReactDOM from "react-dom"
import Spritesheet from "react-responsive-spritesheet"
// import debounce from 'lodash.debounce'
// import { keybindings } from './keys'
// import { KeysContext } from './index'

// import { css } from "emotion"
// import { keybindings } from "./keys"
// import Player from "./Player"


let link = "'../../utils/spriteSheets/current/char4.png'"
// const dlog = debounce((...args) => console.log(...args), 200)


export default function Inventory() {
    return (
        <div>
            <h1>Inventory</h1>
          {/* <KeysContext.Provider value={keysDown}> */}
            <Player />
            <img src={link} alt="avatar_sprite"/>
          {/* </KeysContext.Provider> */}
        </div>
      )
 }


 
//  ReactDOM.render(<App />, document.getElementById("root"))



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


 let Player = () => {
    // let keysDown = useContext(KeyrspsContext)
    let [spritesheet, setSpritesheet] = useState(null)
    let [x, setX] = useState(0)
    let [y, setY] = useState(0)
  
    // useEffect(() => {
    //   let intervalId = setInterval(() => {
    //     // TODO must re-effect to get updated keysDown!!
    //     // Maybe pressedKeys can be derived from keysDown??
    //     // Or something can be memoized, memoized callback?
    //     // How can I make a context aware effect?
  
    //     // purely derived from keysDown reducer state
  
    //     dlog(JSON.stringify(keysDown))
    //     let pressedKeys = Object.entries(keysDown)
    //       .filter(e => e[1])
    //       .map(e => e[0])
  
    //     if (pressedKeys.length > 0) {
    //       console.log({ pressedKeys })
    //     }
    //     // purely derived from keysDown reducer state + keybindings
    //     let activesMap = Object.entries(keybindings).reduce((mapping, binding) => {
    //       let bindingName = binding[0]
    //       let isOn = !!pressedKeys.find(key => binding[1].includes(key))
    //       // console.log(`Found ${bindingName} to be ${isOn} when ${JSON.stringify(pressedKeys)}`)
    //       return {
    //         ...mapping,
    //         [bindingName]: isOn,
    //       }
    //     }, {})
  
    //     // the only actual action of this effect, from entirely derived data... hmmm
    //     // make activesMap or the individual ones we care about the props to this component??
    //     if (activesMap.moveDown) {
    //       console.log('moving down')
    //       setY(y + 10)
    //     }
    //   }, 500)
  
    //   return () => clearInterval(intervalId)
    // })
  
    useEffect(() => {
      if (!spritesheet) {
        return
      }
  
      let frames = animationMapping['left']
      // Update spritesheet instance instead of remounting/etc
      spritesheet.goToAndPlay(frames[0])
      spritesheet.setStartAt(frames[0])
      spritesheet.setEndAt(frames[1])
    })
  
    let frames = animationMapping['left']
    return (
      <Spritesheet
        // className={spriteClass}
        style={{ left: `${x}px`, top: `${y}px` }}
        image={link}
        widthFrame={300}
        heightFrame={300}
        fps={6}
        startAt={frames[0]}
        endAt={frames[1]}
        getInstance={spritesheet => {
          setSpritesheet(spritesheet)
        }}
      />
    )
  }




 

 




// 1) Given an id for a particular item 
// 2) Go to the correct location on the spritesheet
// Display the item on the inventory page



// We'll have a final json file that maps the player items to the correct sprite item. 

