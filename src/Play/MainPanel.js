import React, { Component } from 'react';
import styles from './play.module.scss';

class MainPanel extends Component{

    constructor(props){
        super(props);
        this.state = {
            min: 0,
            sec: 0
        }
        this.timeid = null;
    }

    componentDidMount(){
        // console.log('cdm');
        if(!this.props.timer)
            return;

        // this.spin();
    }

    componentDidUpdate(prevProps){
        if(prevProps.toggleclock !== this.props.toggleclock)
            this.setState({min: 0, sec: 0});
            
        if(this.props.timer === false && prevProps.timer === true){
            clearInterval(this.timeid);
            this.timeid = null;
        }
        else if(this.props.timer === true && this.timeid === null)
            this.spin();
        else if(this.props.timer === true && this.state.sec === 6){
            clearInterval(this.timeid);
            this.timeid = null;
            this.props.timeup();
        }
    }

    spin = () => {
        this.setState({min: 0, sec: 0})
        let tid = setInterval(() => {
            
            if(this.state.sec === 59)
                this.setState({min: this.state.min+1, sec: 0});
            else
                this.setState({sec: this.state.sec+1});

        }, 1000);

        // this.setState({timeid: tid});
        this.timeid = tid;
    }

    welcome = () => {
        this.props.hndlewelcome();
        this.props.hndleHome();
    }

    fastforward = () => {
        if(!this.props.timer)
            this.props.hndlegen();
    }

    render(){

        return (
            <div className={styles['mainPanel']}>

                <nav className={styles['navbtn']} onClick={()=>{this.welcome()}}>
                    <svg>
                        <use href='./assets/ico/sprite.svg#icohome' />
                    </svg>
                </nav>

                <div key={1} className={styles['timew']}>
                    <span key={11} className={styles['minl']}>
                        {this.state.min}
                    </span>
                    
                    <span key={10}>
                        :
                    </span>

                    <span key={12} className={styles['secl']}>
                        {this.state.sec}    
                    </span>
                </div>

                <nav 
                    className={!this.props.timer ? styles['btnUp']+' '+styles['navbtn'] : styles['navbtn']}
                    onClick={()=>{this.fastforward()}}
                >
                    <svg >
                        <use href='./assets/ico/sprite.svg#icofastforward' />
                    </svg>
                </nav>

            </div>   
        )
    }
}

export default MainPanel