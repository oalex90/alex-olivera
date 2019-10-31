const KEYS = {
  'Q': [81, "Heater 1", "Chord 1", 
       'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'],
  'W': [87, "Heater 2", "Chord 2",
       'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'],
  'E': [69, "Heater 3", "Chord 3",
       'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'],
  'A': [65, "Heater 4", "Shaker",
       'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'],
  'S': [83, "Clap", "Open HH",
       'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'],
  'D': [68, "Open HH", "Closed HH",
       'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'],
  'Z': [90, "Kick 'n Hat", "Punchy Kick",
       'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'],
  'X': [88, "Kick", "Side Stick",
       'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'],
  'C': [67, "Closed HH", "Snare",
       'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
       'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3']
};

class DrumMachine extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {
      isPowerOn: true,
      isBankOn: false,
      volume: 50,
      display: "",
      keyPressed: ""
    };
    this.handlePowerToggle = this.handlePowerToggle.bind(this);
    this.handleBankToggle = this.handleBankToggle.bind(this);
    this.handleVolumeChange = this.handleVolumeChange.bind(this);
  };
  
  handlePowerToggle(){   
    this.setState({
      isPowerOn: !this.state.isPowerOn,
      display: ""});
  }
  
  handleBankToggle(){
    if(this.state.isPowerOn){
      if(this.state.isBankOn){
        this.setState({isBankOn: !this.state.isBankOn,
                      display: "Heater Kit"});
      }else{
        this.setState({isBankOn: !this.state.isBankOn,
                      display: "Smooth Piano Kit"});
      }
    }
  }
  
  onMouseDownHandler(event){
    let val = "";
    switch(event.target.id){
      case "drum-pad-Q":
        val = "Q";
        break;
      case "drum-pad-W":
        val = "W";
        break;
      case "drum-pad-E":
        val = "E";
        break;
      case "drum-pad-A":
        val = "A";
        break;
      case "drum-pad-S":
        val = "S";
        break;
      case "drum-pad-D":
        val = "D";
        break;
      case "drum-pad-Z":
        val = "Z";
        break;
      case "drum-pad-X":
        val = "X";
        break;
      case "drum-pad-C":
        val = "C";
        break;
    }
    this.pressKey(val);
  }
  
  pressKey(val){
    if(this.state.isPowerOn && this.state.keyPressed != val){
      let aud = document.getElementById(val);
      
      let audio = new Audio(aud.src);
      audio.volume = this.state.volume/100;
      audio.play();
      
      
      this.setState({
        display: this.state.isBankOn ? KEYS[val][2] : KEYS[val][1], 
        keyPressed: val});
    }
    else{
      this.setState({keyPressed: val});
    }
  }
  
  handleVolumeChange(event){
    if(this.state.isPowerOn){
      this.setState({volume: event.target.value,
                    display: "Volume: " + event.target.value});
    }
    
  }
  
  onKeyUpHandler(){
    this.setState({keyPressed: ""});
  }
  
  onKeyDownHandler(keyCode){
    let val = "";
    switch(keyCode){
      case KEYS['Q'][0]:
        val = "Q";
        break;
      case KEYS['W'][0]:
        val = "W";
        break;
      case KEYS['E'][0]:
        val = "E";
        break;
      case KEYS['A'][0]:
        val = "A";
        break;
      case KEYS['S'][0]:
        val = "S";
        break;
      case KEYS['D'][0]:
        val = "D";
        break;
      case KEYS['Z'][0]:
        val = "Z";
        break;
      case KEYS['X'][0]:
        val = "X";
        break;
      case KEYS['C'][0]:
        val = "C";
        break;
    }
    this.pressKey(val);
  }
  
  componentDidMount(){ //activate listner right after component is mounted
    window.addEventListener('keydown', (e)=>(this.onKeyDownHandler(e.keyCode)))
    window.addEventListener('keyup', (e)=>(this.onKeyUpHandler(e.keyCode)))//run handler after every keydown event
    window.addEventListener('mousedown', (e)=>(this.onMouseDownHandler(e)))
    window.addEventListener('mouseup', (e)=>(this.onKeyUpHandler(e)))//run
  }

  render() {
    let keys = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
    let keysClass = (isKeyPressed, isPowerOn)=>{
      let ret = "drum-pad";
      if(isKeyPressed){
        ret += " key-pressed";
        if(isPowerOn){ret +=" key-pressed-power-on";}
      }
      return ret;
    }
    let keyDivs = keys.map((key)=>{
      return (
        <div id={"drum-pad-"+key} 
          className={keysClass(this.state.keyPressed == key, this.state.isPowerOn)}
          >
          {key}
              <audio id={key} className="clip"
                src={this.state.isBankOn ? KEYS[key][4]:KEYS[key][3]} type="audio/mpeg"/>
            </div>);
    });
        
    return ( 
      <div id="drum-machine" 
        className={this.state.isPowerOn ? "dm-power-on" : "dm-power-off"}>
        <div id="logo">FCC <i className="fab fa-free-code-camp"></i></div>
        <div id="contents">
          <div id="drum-pad-keys">
            {keyDivs}
          </div>
          <div align="center" id="options">
            <div id="div-power">
              <div className="option-title">Power</div>
              <label className="switch">
                <input id="power" type="checkbox" checked={this.state.isPowerOn} onChange={this.handlePowerToggle}/>
                <span className="toggle"></span>
              </label>
            </div>
            <div id="display">{this.state.display}</div>
            <div id="div-volume">
              <input type="range" min="0" max="100" 
                value={parseInt(this.state.volume)} 
                className="slider" id="volume" onChange={this.handleVolumeChange}/>
            </div>
            <div id="div-bank">
              <div className="option-title">Bank</div>
              <label className="switch">
                <input id="bank" type="checkbox" checked={this.state.isBankOn} onChange={this.handleBankToggle}/>
                <span className="toggle"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      );
  }
}
        
ReactDOM.render(<DrumMachine/>, document.getElementById('body'));