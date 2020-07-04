import React, { Component } from 'react';
import styles from './play.module.scss';

import GameInfo from '../GameInfo'

class BoardPanel extends Component{

    // refreshh = false;

    constructor(props){
        super(props);

        this.state = {
            clvl: props.clvl,
            h: [],
            p: []
        }

        this.refreshh = false;
    }

    componentDidMount(){
        let pl = [...Array(this.props.rem)].map(e=> Math.floor(Math.random()*11)+1);

        this.setState({p:pl, h:[]});
        
        // setTimeout(() => {
        //     this.setState({p:pl, h:[]});
        // }, GameInfo.badges[this.props.badge-1]);
    }

    componentDidUpdate(prevProps) {
        if(this.props.watch === prevProps.watch)
            return;

        let pl = [...Array(this.props.rem)].map(e=> Math.floor(Math.random()*11)+1);
        this.setState({p:pl, h:[]});

    }

    refresh = () => {
        
        if(this.refreshh === true || this.props.lock === true)
            return;
        
        this.refreshh = true;
        setTimeout(()=> this.refreshh=false, 1000);
        
        let ph = this.state.h;
        
        this.setState({h:this.props.watch, lock: !this.state.lock});
        this.props.hndleTimer();
        this.props.hndleFreeze();
        this.props.hndleLock();

        setTimeout(()=>{
            this.setState({h:ph});
        }, GameInfo.badges[this.props.badge-1]);
    }

    hndleCk = (e) => {
        if(this.props.freeze === true)
            return;

        if(this.state.h.includes(e))
            return;
        
        let hl = [...this.state.h];
        hl.push(e);

        if(this.props.watch.includes(e))this.props.hndlerem();
        this.setState({h: hl});
    }

    welcome = () => {
        this.props.hndleHome();
    }

    lookup = () => {
        this.props.hndleLookup();
    }

    fastforward = () => {
        if(this.props.freeze === false)
            return;

        this.props.hndleClockReset();

        this.setState({lock: !this.state.lock});
        if(this.props.strOpt === 2){
            if(this.props.score === true)
                this.props.hndlegen();
        }
        else{
                this.props.hndlegen();
        }
    }

    render(){

        let ee=-1;
        
        let pocks = [...Array(GameInfo.lvls[this.props.clvl].r)].map((vl,locl)=>
        {
            let ck = locl*GameInfo.lvls[this.props.clvl].c;

            return (
                <div key={locl} className={styles['pocklw']}>
                {
                    [...Array(GameInfo.lvls[this.props.clvl].c)].map((vc,locc)=>
                    {
                        return (
                            <div key={ck+locc+1}
                                style={this.state.h.includes(ck+locc+1) ? {background:"#b52e31"} : null}
                                className={styles['pock']} onClick={()=>{this.hndleCk(ck+locc+1)}} id='pocc'>
                            
                                {
                                    !this.props.watch.includes(ck+locc+1) ? ck+locc+1 : 
                                    (
                                        <div key={++ee}
                                            className={styles['inset']}
                                        >
                                        {
                                            !this.state.h.includes(ck+locc+1) ? ck+locc+1 :
                                            (
                                                <img key={ck+locc} src={`./assets/misc/${this.state.p[ee]}.svg`} alt='' />
                                            )
                                        }
                                        </div>
                                    )
                                }
                            </div>
                        )
                    })
                }
                </div>
            )
        })

        return (

            <div className={styles['boardPanel']} id='boardpoc'>
                <section className={styles['beacons']}>

                    <div className={this.props.bounce === 1 ? styles['bounce']+' '+styles['navbtn'] : styles['navbtn']} onClick={()=>this.lookup()}>
                        <svg className={styles['quitsvg']} style={{fill: 'yellow'}}>
                            <use href='./assets/ico/sprite2.svg#icobinoculars'/>
                        </svg>
                    </div>

                    <div className={this.props.bounce === 2 ? styles['bounce']+' '+styles['navbtn'] : styles['navbtn']} onClick={()=>this.welcome()}>
                        <svg className={styles['quitsvg']} style={{fill: 'navy'}}>
                            <use href='./assets/ico/sprite1.svg#icoquit'/>
                        </svg>
                    </div>

                    <div className={(this.props.bounce === 3 && this.props.lock === false) ? styles['bounce']+' '+styles['navbtn'] : styles['navbtn']} onClick={()=>{this.refresh()}}>
                        <svg className={styles['refreshsvg']}
                            // style={this.props.freeze === false ? {fill: "green"}: null}
                        >
                            <use href='./assets/ico/sprite.svg#icorefresh'/>
                        </svg>
                    </div>

                    <div className={this.props.bounce === 4 ? styles['bounce']+' '+styles['navbtn'] : styles['navbtn']} onClick={()=>{this.fastforward()}}>
                        <svg className={styles['nextroundsvg']}
                        style={this.props.score === true || this.props.rem === 0 ? {fill: "red"}: null}
                        >
                            <use href='./assets/ico/sprite1.svg#iconextround'/>
                        </svg>
                    </div>

                </section>

                <div className={styles['board']}>
                    {[...pocks]}
                </div>
            </div>
        )
    }
}

export default BoardPanel