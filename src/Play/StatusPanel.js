import React, { Component } from 'react';
import styles from './play.module.scss';

import GameInfo from '../GameInfo'

class StatusPanel extends Component {

    constructor(props) {
        super(props);
        this.state = {
            lvl: 0,
            score: 0,
            unm: '',
            attempts: 0,
            rem: 0
        }
    }

    componentDidMount() {
        this.setState({
            lvl: this.props.lvl,
            score: this.props.score,
            unm: this.props.unm
        })
    }

    render() {
        return (
            <div className={styles['statusPanel']}>
                {
                    this.props.strOpt === 1 ?
                        <div key={2} className={styles['lvlw']}>
                            <span className={styles['lvll']}>
                                Level
                    </span>

                            <span className={styles['lvlv']}>
                                {this.props.lvl + 1}
                            </span>
                        </div>
                        : null
                }

                {
                    this.props.strOpt === 1 ? null :

                        <div className={styles['roundw']}>
                            <span className={styles['roundl']}>
                                Round
                    </span>

                            <span className={styles['roundv']}>
                                {this.props.round}
                            </span>
                        </div>
                }


                <div className={styles['attemptw']}>
                    <span className={styles['attemptl']}>
                        Attempt
                    </span>

                    <span className={styles['attemptv']}>
                        {this.props.attempts}
                    </span>
                </div>

                <div className={styles['remw']}>
                    <span className={styles['reml']}>
                        Remaining
                    </span>

                    <span className={styles['remv']}>
                        {this.props.rem}
                    </span>
                </div>



                {
                    this.props.strOpt === 2 ? null :

                        <div className={styles['scorew']}>
                            <span className={styles['scorel']}>
                                Completed
                    </span>

                            <span className={styles['scorev']}>
                                {this.props.completed}
                            </span>
                        </div>
                }

                {
                    this.props.strOpt === 1 ? null :

                        <div className={styles['scorew']}>
                            <span className={styles['scorel']}>
                                Won
                        </span>

                            <span className={styles['scorev']}>
                                {this.props.won}
                            </span>
                        </div>

                }

                {
                    this.props.strOpt === 1 ? null :

                        <div className={styles['scorew']}>
                            <span className={styles['scorel']}>
                                Lost
                    </span>

                            <span className={styles['scorev']}>
                                {this.props.lost}
                            </span>
                        </div>
                }
                {
                    // this.props.strOpt === 1 ?
                    //     <div className={styles['badgew']}>
                    //         <span className={styles['badgel']}>
                    //             Badge
                    // </span>

                    //         <span className={styles['badgev']}>
                    //             {this.props.badge}
                    //         </span>
                    //     </div>
                    //     : null
                }

                {/* <div className={styles['badgew']}>
                    <span className={styles['badgel']}>
                        Time
                    </span>

                    <span className={styles['badgev']}>
                        {GameInfo.badges[this.props.badge - 1]}
                    </span>
                </div> */}
            </div>
        )
    }
}

export default StatusPanel