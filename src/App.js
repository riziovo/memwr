import React, { useState, useEffect } from 'react';
import styles from './App.css';

import WelcomePage from './Welcome/WelcomePage';
import PlayPage from './Play/PlayPage';

function App() {
  const [menuopt, setMenuopt] = useState(0);
  const [gamestart, setGamestart] = useState(false);
  const [name, setName] = useState('');

  useEffect(()=>{
    // let el = document.documentElement;
    // let maxheight = Math.max(el.clientHeight, el.scrollHeight, el.offsetHeight);
    // document.getElementById('gof').style.height = maxheight+'px';
    // document.getElementById('app').style.height = maxheight+'px';
  });

  const strtOpt = (opt, unm) => {
    if(opt === 2)
      setName(unm);

    setMenuopt(opt);
    if (opt === 1 || opt === 2)
      setGamestart(!gamestart);
  }

  const home = () => {
    setGamestart(false);
  }

  return (
    <div className="App" id='app'>
            <div className='fog' id='gof'>
        <div className='back1'>&nbsp;</div>
        <div className='back2'>&nbsp;</div>
      </div>

      {
        gamestart === true?
          (<PlayPage strOpt={menuopt} clvl={0} score={4377} unm={name} badge={1} home={home}/>)
          :
          (<WelcomePage strtOpt={strtOpt}/>)

      }
      </div>
  );
}

export default App;
