"use client"

import React, {useState, useRef, useEffect} from 'react'
// @ts-ignore
import {LuckyWheel} from '@lucky-canvas/react'

import {queryRaffleAwardList, randomRaffle} from '@/apis'
import {RaffleAwardVO} from "@/types/RaffleAwardVO";

export function LuckyWheelPage() {
    const queryParams = new URLSearchParams(window.location.search);
    const strategyId = Number(queryParams.get('strategyId'));
    const [prizes, setPrizes] = useState([{}])
    const myLucky = useRef()


    const [blocks] = useState([
        {padding: '10px', background: '#869cfa', imgs: [{src: "https://bugstack.cn/images/system/blog-03.png"}]}
    ])

    const [buttons] = useState([
        {radius: '40%', background: '#617df2'},
        {radius: '35%', background: '#afc8ff'},
        {
            radius: '30%', background: '#869cfa',
            pointer: true,
            fonts: [{text: '开始', top: '-10px'}]
        }
    ])
    //查询奖品列表
    const queryRaffleAwardListHandle = async () => {
        const result = await queryRaffleAwardList(strategyId);
        const {code, info, data} = await result.json();
        if (code != "0000") {
            window.alert("获取抽奖奖品列表失败 code:" + code + " info:" + info)
            return;
        }
        const prizes = data.map((award: RaffleAwardVO, index: number) => {
            const background = index % 2 === 0 ? '#e9e8fe' : '#b8c5f2';
            return {
                background: background,
                fonts: [{id: award.awardId, text: award.awardTitle, top: '15px'}]
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
        <LuckyWheel
            ref={myLucky}
            width="300px"
            height="300px"
            blocks={blocks}
            prizes={prizes}
            buttons={buttons}
            onStart={() => { // 点击抽奖按钮会触发start回调
                // @ts-ignore
                myLucky.current.play()
                setTimeout(() => {
                    randomRaffleHandle().then(prizeIndex => {
                        // @ts-ignore
                        myLucky.current.stop(prizeIndex);
                    });
                }, 2500)
            }}
            onEnd={
                // @ts-ignore
                prize => {
                    alert('恭喜你抽到【' + prize.fonts[0].text + '】奖品ID【' + prize.fonts[0].id + '】')
                }
            }
        />
    </div>
}
