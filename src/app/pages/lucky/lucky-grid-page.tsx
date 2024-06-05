"use client"

import React, {useState, useRef, useEffect} from 'react'
// @ts-ignore
import {LuckyGrid} from '@lucky-canvas/react'
import {queryRaffleAwardList, randomRaffle} from '@/apis'
import {RaffleAwardVO} from "@/types/RaffleAwardVO";

export function LuckyGridPage() {
    const queryParams = new URLSearchParams(window.location.search);
    const strategyId = Number(queryParams.get('strategyId'));
    const [prizes, setPrizes] = useState([{}])
    const myLucky = useRef()
    // 背景
    const [blocks] = useState([
        {padding: '10px', background: '#869cfa',imgs: [{src: "https://bugstack.cn/images/system/blog-03.png"}]}
    ])

    const [buttons] = useState([
        {x: 1, y: 1, background: "#7f95d1", fonts: [{text: '开始', top: '35%'}]}
    ])

    const [defaultStyle] = useState([{background: "#b8c5f2"}])

    //查询奖品列表
    const queryRaffleAwardListHandle = async () => {
        const result = await queryRaffleAwardList(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        }
        const prizes = data.map((award: RaffleAwardVO, index: number) => {
            const background = '#869cfa'
            const coordinates = [
                {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1},
                {x: 2, y: 2}, {x: 1, y: 2}, {x: 0, y: 2}, {x: 0, y: 1}
            ];
            const {x, y} = coordinates[index];
            return {
                x: x,
                y: y,
                fonts: [{id: award.awardId, text: award.awardTitle, top: '35px'}]
            };
        });
        //设置奖品数据
        setPrizes(prizes)
    }
    //调用随机抽奖
    const randomRaffleHandle = async () => {
        const result = await randomRaffle(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("随机抽奖失败 code:" + code + " info:" + info)
            return;
        }
        return data.awardId;
    }
    useEffect(() => {
        queryRaffleAwardListHandle().then(r => {
        });
    }, [])
    return <div>
        <LuckyGrid
            ref={myLucky}
            width="300px"
            height="300px"
            rows="3"
            cols="3"
            prizes={prizes}
            defaultStyle={defaultStyle}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发star回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    const index = Math.random() * 8 >> 0
                    // @ts-ignore
                    myLucky.current.stop(index)
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    alert('恭喜你抽到 ' + prize.fonts[0].text + ' 号奖品')
                }
            }>

        </LuckyGrid>
    </div>

}

