import React from 'react'
import styles from './play.module.scss';

class Monitor extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return (
            <section className={styles['screenpanel']}>

                {/* <span className={styles['refresh']+' '+styles['navbtn']}>
                    <svg className={this.props.inc ? styles['nextroundsvg']+' '+styles['blip']: styles['nextroundsvg']}
                        style={this.props.score === true || this.props.rem === 0 ? {fill: "red"}: null}
                    >
                        <use href='./assets/ico/sprite1.svg#iconextround'/>
                    </svg>
                </span> */}
            
                <div className={styles['screen']}>
                    {this.props.text}
                </div>
            </section>
        )
    }
}

export default Monitor;