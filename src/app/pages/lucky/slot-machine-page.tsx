"use client"

import React, {useState, useRef} from 'react'
// @ts-ignore
import {SlotMachine} from '@lucky-canvas/react'

export function SlotMachinePage(){

    const [blocks] = useState([
        {padding: '10px', background: '#869cfa', imgs: [{src: "https://bugstack.cn/images/system/blog-03.png"}]}
    ])

    const [prizes] = useState([
        {background: '#e9e8fe', fonts: [{text: '0'}]},
        {background: '#b8c5f2', fonts: [{text: '1'}]},
        {background: '#e9e8fe', fonts: [{text: '2'}]},
        {background: '#b8c5f2', fonts: [{text: '3'}]},
        {background: '#e9e8fe', fonts: [{text: '4'}]},
        {background: '#b8c5f2', fonts: [{text: '5'}]},
    ])
    const [slots]=useState([
            { order: [0] },
            { order: [1] },
            { order: [2] },

        ])
    const [end]=useState()
    const [defaultStyle] = useState([{background: "#b8c5f2"}])
    const myLucky = useRef()

    return <div>
        <SlotMachine
            ref={myLucky}
            width="300px"
            height="300px"
            blocks={blocks}
            prizes={prizes}
            slots={slots}
            onStart={() => { // 点击抽奖按钮会触发star回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    const index = Math.random() * 6 >> 0
                    // @ts-ignore
                    myLucky.current.stop(index)
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
                }
            }
        />
    </div>
}