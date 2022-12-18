import React, { useState, useEffect, useContext } from 'react'
import Spritesheet from 'react-responsive-spritesheet'

let link = "http://i.imgur.com/oorjG.png"


let animationMapping = {
    right: [6, 9],
    left: [2, 5],
    up: [12, 15],
    down: [17, 20],
  }

export default function Player () {
    let [spritesheet, setSpritesheet] = useState(null)
    let [x, setX] = useState(0)
    let [y, setY] = useState(0)
  
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
        // className={spriteClass}
        // style={{ left: `${x}px`, top: `${y}px` }}
        image={link}
        widthFrame={500}
        heightFrame={500}
        fps={6}
        // loop
        steps={4}
        // startAt={frames[0]}
        // endAt={frames[1]}
        // getInstance={spritesheet => {
        //   setSpritesheet(spritesheet)
        // }}
      />
    )
}




// Avatar fields for what is currently equipped on the avatar