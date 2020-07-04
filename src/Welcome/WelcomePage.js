import React, { Component } from 'react';
import styles from './Welcome.module.scss';

class WelcomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            swipe: false,
            loadc: false,
            askname: false
        }
        this.name = null;
    }

    componentDidMount() {
        this.name = document.getElementById("name");

        this.name.addEventListener("keydown", (e) => {
            if (e.keyCode === 13 && this.name.value.length > 0)
                this.hndleClk(2, this.name.value);
        })

        document.getElementById('logo').style.marginTop = (document.documentElement.scrollHeight/5)+'px';
    }

    toggle = () => {
        if (this.state.loadc)
            this.setState({ swipe: !this.state.swipe });
        else
            this.setState({ loadc: true, swipe: !this.state.swipe });
    }

    hndleClk = (opt, nm) => {

        if (opt === 3) {// ask box
            this.setState({ askname: !this.state.askname });
        }
        else if (opt === 2) { //click next
            if (nm === null || nm.length === 0 || nm.length > 10)
                return;

            this.setState({ askname: !this.state.askname });
            this.props.strtOpt(opt, nm);
        }
        else// single player
            this.props.strtOpt(opt);
    }

    render() {
        return (
            <div className={styles['welcomePage']}>
                <div className={styles['welcomelogo']} id='logo'>
                    <img src='./assets/logo/m1.png' alt='memwr'></img>
                </div>

                    <div className={
                        !this.state.loadc ? styles['container'] :

                            (this.state.swipe ? styles['container'] + ' ' + styles['slideleft'] :
                                styles['container'] + ' ' + styles['slideright']
                            )
                    }>

                        <div className={styles['home']}>
                            <nav className={styles['nav']}>
                                <div className={styles['navItem_single'] + ' ' + styles['navItem']}
                                    onClick={() => this.hndleClk(1)}>
                                    <span>Single Player</span>
                                </div>

                                <div className={styles['navItem_multi'] + ' ' + styles['navItem']}
                                >
                                    <span className={this.state.askname !== false ? styles['multiplayer'] : null}
                                        onClick={() => this.hndleClk(3)}
                                    >
                                        Multiplayer</span>
                                    <span className={this.state.askname !== true ? styles['displayNone'] : styles['entername']}>
                                        <input type="text" id="name" placeholder='n a m e' maxLength='10'></input>
                                        <span><svg className={styles['namebtn']}
                                            onClick={() => this.hndleClk(2, document.getElementById('name').value)}
                                        >
                                            <use href='./assets/ico/sprite1.svg#iconextround' />
                                        </svg></span>
                                    </span>
                                </div>

                                <div className={styles['navItem_credits'] + ' ' + styles['navItem']}
                                    onClick={() => this.toggle()}
                                >
                                    <span>Credits</span>
                                </div>
                            </nav>
                        </div>

                        <div className={styles['creditpagew']}>
                            <div className={styles['creditpage']}>
                                <div className={styles['backbtn']} onClick={() => this.toggle()}>
                                    <svg className={styles['refreshsvg']}>
                                        <use href='./assets/ico/sprite1.svg#icoquit' />
                                    </svg>
                                </div>
                                {/* II */}
                                <div className={styles['devcredit']}>
                                    <div className={styles['lvw']}>
                                        <span className={styles['label']}>Developer </span>
                                        <a href='http://www.riziovo.com' className={styles['val']}>Rishi</a>
                                    </div>
                                </div>

                                <div className={styles['imagecredit']}>
                                    <div className={styles['lvw']}>
                                        <span className={styles['label']}>Photographer </span>
                                        <span className={styles['val']}>Joe deSousa</span>
                                    </div>

                                    <div className={styles['lvw']}>
                                        <span className={styles['label']}>Place </span>
                                        <span className={styles['val']}>Kirkjufell Mountain, Grundarfjörður, Iceland</span>
                                    </div>

                                    <div className={styles['lvw']}>
                                        <span className={styles['val']}>
                                            We were approaching Grundarfjörður harbour and the sun began breaking through the clouds.
                            </span>
                                    </div>

                                    <a className={styles['more']} href='https://www.flickr.com/photos/mustangjoe/42317168545/'>
                                        Link
                        </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default WelcomePage