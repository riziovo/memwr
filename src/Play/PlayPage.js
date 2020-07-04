import React, { Component } from 'react';
import styles from './play.module.scss';

import MainPanel from './MainPanel'
import StatusPanel from './StatusPanel'
import BoardPanel from './BoardPanel'
import GameInfo from '../GameInfo'
import Monitor from './Monitor'

import {webc} from './wcc';

// push task

// async
// 	8
// 	await process
// 	push processed[]
// 	8

// 	return [processed]
// async


class PlayPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            clvl: 0,
            unm: props.unm,
            attempts: 0,
            trk: [],
            rem: 0,
            timer: false,
            badge: props.badge,
            welcome: false,
            completed: 0,
            bounce: 3,
            toggleclock: false,
            lock:true,

            round: 0,
            score: true,
            connected: false,
            freeze: true,
            won: 0,
            lost: 0,

            flashscreen: 'are we on? ;>',
            opprem: null
        }
        this.badgelen = GameInfo.badges.length-1;
        this.cli = null;
    }

    togglelock = () => {
        this.setState({lock: !this.state.lock})
    }

    toggleclock = () => {
        this.setState({toggleclock: !this.state.toggleclock});
    }

    flash = (e) => {
        this.setState({flashscreen: e})
    }

    bounce = (e) => {
        this.setState({bounce: e});
    }

    nextseries = (e) =>{
        let badge =  this.state.badge%this.badgelen;
        let lvl = (this.state.clvl+1)%2;

        this.setState({
            round: this.state.round+1,
            trk: e,
            attempts: 0,
            rem: e.length,
            unm: this.state.unm,
            timer: false,
            welcome: false,
            badge: badge,
            lock: false,
            
            score: false,
            connected: true,
            freeze: true,
            clvl: lvl
        })

    }

    genPocks = () => {
        let lvl = (this.state.clvl+1)%2, badge = this.state.badge%this.badgelen;

        let grc = GameInfo.lvls[lvl].r*GameInfo.lvls[lvl].c;

        let al = [];

        [...Array(Math.floor(Math.random() * (9 - 5 + 1) + 5))]
            .map((v) => {
                let vv = Math.floor(Math.random()*grc+1);
                while(al.includes(vv))
                    vv = Math.floor(Math.random()*grc+1);
                
                al.push(vv);
                return null;
            });
        
        this.setState({
            trk: al,
            attempts: 0,
            clvl:lvl,
            round: this.state.round+1,
            rem: al.length,
            unm: this.state.unm,
            welcome: false,
            badge: badge,
            lock: false,

            timer: false,
            freeze: true,
            score: false
        });
    }

    componentDidMount(){
        if(this.props.strOpt === 2){
            this.cli = new webc(this.flash, this.nextseries, this.switchScore, this.switchConnected, this.bounce);
            // this.cli.sendJoinReq();
            this.setState({bounce: 1, unm: this.props.unm});
        }
        else
            this.genPocks();
    }

    hndleClk = (e) => {
        this.setState({attempts: this.state.attempts+1});

        if(this.state.trk.includes(e))
            return true;

        return false;
    }

    hndleRem = () => {
        if(this.state.rem === 1){
            if(this.props.strOpt === 2){
                this.setState({
                    rem: 0,
                    timer: false,
                    freeze: true
                })
                this.submit(0);
            }
            else
                this.setState({rem: 0, completed: this.state.completed+1, timer: false, score: true, freeze: true});    
        }
        else
            this.setState({rem: this.state.rem-1});
    }

    hndleTimer = () => {
        this.setState({timer: !this.state.timer});
    }

    hndleWelcome = () => {
        this.setState({welcome: !this.state.welcome});
    }

    switchFreeze = () => {
        this.setState({freeze: !this.state.freeze});
    }

    switchScore = (e) => {
        let wonn = e === 1 ? this.state.won + 1 : this.state.won;
        let lostt = e === -1 ? this.state.lost + 1 : this.state.lost;

        this.setState({score: !this.state.score, won: wonn, lost: lostt});
    }

    switchConnected = () => {
        this.setState({freeze: false, connected: true, score: false});
    }

    join = () => {
        if(this.props.strOpt === 1)
            return;
            
        if(this.state.connected){
            this.flash('You are already connected. Click on Quit button to find a new match.');
        }
        else{
            console.log(this.state.unm);
            this.cli.sendJoinReq(this.state.unm);
            this.flash('Looking for an opponent.Please wait...');
        }
    }

    next = () => {
        console.log('client side NEXT');
        if(this.state.score === false){
            if(this.state.connected)
                this.flash('Please wait for the score');
            else
                this.flash('please wait until we connect you');
        }
        else{
            this.flash('Please wait until opponent Clicks <NEXT>');
            console.log('about to next lvl', this.state.clvl);
            this.cli.sendNextReq((this.state.clvl+1)%2);
        }
    }

    quit = () => {
        console.log('client side QUIT');
        if(this.props.strOpt === 2){
            if(this.state.connected === true)
                this.cli.sendQuitReq();
        }

        this.props.home();
    }

    submit = (e) => {
        console.log('client side SUBMIT');
        this.flash('Waiting for opponent score');

        this.cli.sendSubReq(e);
    }

    timeup = () => {
        
        if(this.props.strOpt === 2) {
            this.setState({
                timer: false,
                freeze: true
            })
            this.submit(this.state.rem);
        }
        else{
            this.setState({
                timer: false,
                freeze: true,
                score: true,
                flashscreen: 'Click next to proceed to next round'
            })
        }
    }

    render(){
        return (
            <div className={styles['PlayPage']}>

                <MainPanel key={1} lvl={this.state.clvl}
                    timer={this.state.timer}
                    timeup={this.timeup}
                    unm={this.state.unm}
                    badge={this.state.badge}
                    toggleclock={this.state.toggleclock}

                    hndlegen={this.props.strOpt === 1 ? this.genPocks : this.next}
                    hndlewelcome={this.hndleWelcome}
                    hndleHome={this.props.home}
                />

                {
                    // this.state.trk.length === 0 ? null:
                    <StatusPanel key={2} strOpt={this.props.strOpt} score={this.state.score}
                        lvl={this.state.clvl}
                        attempts={this.state.attempts}
                        rem={this.state.rem}
                        badge={this.state.badge}
                        round={this.state.round}
                        won={this.state.won}
                        lost={this.state.lost}
                        completed={this.state.completed}
                />
                }
                {
                    this.state.trk.length === 0 && this.props.strOpt === 1 ? null:
                    (<BoardPanel key={3} clvl={this.state.clvl} 
                        watch={this.state.trk} hndle={this.hndleClk}
                        
                        hndlerem={this.hndleRem}
                        hndlegen={this.props.strOpt === 1 ? this.genPocks : this.next}
                        hndleHome={this.quit}
                        hndleLookup={this.join}
                        hndleTimer={this.hndleTimer}
                        hndleClockReset={this.toggleclock}
                        hndleFreeze={this.switchFreeze}
                        hndleLock={this.togglelock}

                        badge={this.state.badge}
                        rem={this.state.rem}
                        bounce={this.state.bounce}
                        strOpt={this.props.strOpt}
                        score={this.state.score}
                        freeze={this.state.freeze}
                        lock={this.state.lock}
                    />)
                }

                <Monitor key={4} text={this.state.flashscreen}/>

            </div>
        )
    }
}

export default PlayPage