
const ACN = {
    "DISCS": -1,
    "KEYR": 9,
    "INVALID": 0,
    "JOIN": 1,
    "JOINR": 2,
    "DISC": 3,
    "DISCR": 4,
    "SUB": 5,
    "SUBR": 6,
    "NEXT": 7,
    "NEXTR": 8,
}

Object.freeze(ACN);

const ACND = {
    "FAIL": 0,
    "SUCCESS": 1
}

Object.freeze(ACND);

export class webc {

    constructor (e, nextserie, swtchscore, swtchconnected, bounce) {
        // this.url = 'ws://localhost:8000';
        this.url = 'wss://young-headland-11317.herokuapp.com/';
        this.readyToRec = true;

        this.opp = null;
        this.opprem = null;

        this.myrem = null;
        this.flash = e;
        this.playing = false;

        this.switchconnected = swtchconnected;
        this.switchscr = swtchscore;
        this.nextserie = nextserie;
        this.bounce = bounce;

        this.req = {
            h: null,
            c: null,
            d: null
        }

        this.wc = new WebSocket(this.url);
        this.wc.onopen = () => {
            console.log('init client handshake');
        }

        this.wc.onmessage = event => {
            if(this.readyToRec === true){
                console.log('received client ', event.data);
                // this.readyToRec = false;
            }

            this.processResponse(JSON.parse(event.data));
        };

        this.wc.onerror= (err) =>{
            console.log('error', err.error);
        };

        console.log('webclient started');
    }

    set playing(e){
        this._playing = e;
    }

    get playing(){
        return this._playing;
    }

    set opp(e){
        this._opp = e;
    }

    get opp(){
        return this._opp;
    }

    set myrem(e){
        this._myrem = e;
    }

    get myrem(){
        return this._myrem;
    }

    set opprem(e){
        this._opprem = e;
    }

    get opprem(){
        return this._opprem;
    }

    set readyToRec(e){
        this._readyToRec = e;
    }

    get readyToRec(){
        return this._readyToRec;
    }

    sendit = (lvl) => {
        if(this.wc.readyState === 1)
            this.sndc(lvl);
        else {
            setInterval(()=>{
                this.sendit(lvl);
            }, 1500);
        }

        this.readyToRec = true;
    }
    
    sndc = (lvl) =>{
        console.log('init client sending ', lvl);
    };
    
    recc = () => {
        this.readyToRec = true;
    }

    ///////////////////////////////////////////////////////

    resinvalid = (e) =>{
        if(!e.hasOwnProperty('h') || !e.hasOwnProperty('c') || !e.hasOwnProperty('d'))
            return true;
        else if(e['h'] === null || e['h'] === undefined)
            return true;
        else
            return false;
    }

    processResponse(e){
        if(this.resinvalid(e))
            this.flash('Uh oh.....wrong address');
        
        switch(e.c){
            case ACN.KEYR:
                console.log('KEYR\n=======');
                if(this.req.h === null)
                    this.req.h = e.h;
                
                this.bounce(1);
                this.flash('connected to the server :)');
                console.log(e);

                break;

            case ACN.JOINR:
                console.log('JOINR WCC side\n======');
                if(e.d === ACND.FAIL)
                    this.flash('you are in waiting..please wait until you are connected');
                else{
                    this.opp = e.d;
                    this.flash(`You have connected to ${this.opp} . Press play to start the round`);

                    this.nowplaying();
                    
                    this.bounce(4);
                    // this.switchscr();
                }
                
                console.log(e);
                console.log('JOINR WCC END\n======');
                break;

            case ACN.DISCR:
                this.wc.close();
                this.req.c = this.opp = this.req.d = null;
                this.notplaying();
                this.flash('you quit the match');

                this.switchconnected();
                break;

            case ACN.DISCS:
                this.wc.close();
                this.req.c = this.opp = this.req.d = null;
                this.notplaying();
                
                this.bounce(2);
                this.flash('game disconnected! Opponent left the game!');
    
                this.switchconnected();
                break;

            case ACN.SUBR:
                this.opprem = e.d;
                console.log('opprem:', e.d);
                if(this.myrem !== null){
                    let inc = 0;
                    let score = '';
                    if(this.myrem === this.opprem)
                        score = 'You drew';
                    else if(this.myrem < this.opprem){
                        score =  'You won!';
                        inc = 1;
                    }
                    else{
                        inc = -1;
                        score = 'You lost!';
                    }
                    
                    this.bounce(4);
                    this.flash(score);
                    this.switchscr(inc);
                    this.myrem = this.opprem = null;
                }
                break;
            
            case ACN.NEXTR:
                this.flash('proceeding to new round');
                console.log('NEXTR===',e);
                this.nextserie(e.d);
                // this.switchconnected();

                this.bounce(3);
                break;
                
            default:
                console.log(e);
                this.flash('Ill-formed response');
                break;
        }
    }

    waittoclose = () => {
        return new Promise(resolve => {

            if (this.wc.readyState === this.wc.CLOSING) {
                const tid = setInterval(() => {
                    if (this.wc.readyState === this.wc.CLOSED) {
                        clearInterval(tid);
                    }
                }, 1000);
            }

            resolve(true);
        });
    }

    waittoopen = () => {
        return new Promise(resolve => {

            if(this.wc.readyState === this.wc.CLOSED)
                this.wc = new WebSocket(this.url);

            if (this.wc.readyState === this.wc.CONNECTING) {
                const tid = setInterval(() => {
                    if (this.wc.readyState === this.wc.OPEN) {
                        clearInterval(tid);
                    }
                }, 1000);
            }

            resolve(true);
        });
    }

    connectifbroken = () => {
        return new Promise(resolve=>{
            let connected = this.waittoclose().then(this.waittoopen());
            resolve(connected);
        })
    }

    blockfor = () =>{
        this.readyToRec = false;
        setTimeout(()=>{
            this.readyToRec = true;
        }, 3000);
    }

///////////////////////////////////////////////////////
    nowplaying = () => this.playing = true;
    notplaying = () => this.playing = false;

    sendJoinReq = async(e) => {
        console.log('JOIN WCC');
        console.log(e);

        if(this.readyToRec === false){
            this.flash('lets offer a peace prayer for 3s for all the servers in the world...')
            return;
        }
        
        if(this.playing){
           this.flash("Press <Quit> to join play a new opponent");
            return;
        }

        let connected = true;
        if(this.wc.readyState !== this.wc.OPEN)
            connected = this.connectifbroken().then();

        if (connected === true) {
            this.req.c = ACN.JOIN;
            this.req.d = e;
            this.wc.send(JSON.stringify(this.req));

            this.blockfor();
        }

        this.bounce(0);
        console.log('JOINEND WCC');
    }

    sendQuitReq = async() => {
        console.log('WCC side QUIT');

        if(this.readyToRec === false){
            this.flash('lets offer a peace prayer for 3s for all the servers in the world...')
            return;
        }
        
        if(!this.playing){
           this.flash("You are not playing a Multiplayer match");
            return;
        }
        
        if(this.wc.readyState !== this.wc.OPEN)
            this.connectifbroken().then();

        this.req.c = ACN.DISC;
        this.wc.send(JSON.stringify(this.req));
        this.notplaying();

        this.switchconnected();
        this.bounce(0);
        this.wc.close();
        
        this.blockfor();
    }

    sendSubReq = async(e) => {
        console.log('WCC side SUB');

        if(this.readyToRec === false){
            this.flash('lets offer a peace prayer for 3s for all the servers in the world...')
            return;
        }

        this.myrem = e;

        if(!this.playing){
           this.flash("You are not playing a Multiplayer match");
            return;
        }
        else if (this.opprem !== null) {
            let score = '';
            let inc = 0;
            if (this.myrem === this.opprem)
                score = 'You drew';
            else if (this.myrem < this.opprem) {
                score = 'You won!';
                inc = 1;
            }
            else{
                inc = -1;
                score = 'You lost!';
            }

            this.bounce(4);
            this.flash(score);
            this.switchscr(inc);

            this.myrem = this.opprem = null;
        }
        
        if(this.wc.readyState !== this.wc.OPEN)
            this.connectifbroken().then();

        this.req.c = ACN.SUB;
        this.req.d = e;
        this.wc.send(JSON.stringify(this.req));

        this.blockfor();
    }

    sendNextReq = async(e) => {
        console.log('WCC side NEXT', this.readyToRec);
        
        if(this.readyToRec === false){
            this.flash('lets offer a peace prayer for 3s for all the servers in the world...')
            return;
        }
        
        if(!this.playing){
           this.flash("You are not playing a Multiplayer match");
            return;

        }

        if(this.wc.readyState !== this.wc.OPEN)
            this.connectifbroken().then();

        this.req.c = ACN.NEXT;
        this.req.d = e;
        this.wc.send(JSON.stringify(this.req));
        this.switchscr(0);
        this.bounce(0);

        this.blockfor();
    }
}