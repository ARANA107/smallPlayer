import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
    constructor(props) {
        super(props);


        this.myInput = React.createRef();
        this.myInputPlayBar = React.createRef();

        this.state = {
            remTime: 0,
            muteVol: false,
            mouseDown: false,
            shuffleSong: false,
            vol: 1
        }
    }
    componentDidMount() {
        // console.log(this.props.songList)
    }

    playSong = () => {
        this.props.play();
    }

    formatTime = (time) => {
        return Math.floor(time / 60) + ':' + ('0' + Math.floor(time % 60)).slice(-2);
    };

    handleEvent = (event) => {
        if (event.type === "mousedown") {
            this.setState({ mouseDown: true });
        }
    }
    handleEvent2 = (event) => {
        this.timeFromOffset(event, this.myInput.current.offsetWidth);
        this.setState({ mouseDown: false });
    }

    onMouseMove = (e) => {
        if (this.state.mouseDown) {
            this.timeFromOffset(e, this.myInput.current.offsetWidth);
        }
    }

    shuffleSongs = () => {
        this.setState({ shuffleSong: !this.state.shuffleSong });
        this.props.shuffleSong();
    }

    timeFromOffset(mouse, progressBar) {
        let percentage = mouse.nativeEvent.offsetX / progressBar * 100;
        let seconds = this.props.songInfo.remTime * (percentage / 100);
        this.props.setTime(seconds);
    }

    preventDefault(e) {
        e.preventDefault();
    }

    render() {


        //let remTime = this.props.songInfo.remTime;
        let currTime = this.props.songInfo.currTime;
        let progress = this.props.songInfo.currTime / this.props.songInfo.remTime * 100;
        let finalP = progress + '%';
        let finalVol = this.state.vol * 100 + '%';

        return (
            <div onMouseDown={this.preventDefault.bind(this)} onDragStart={this.preventDefault.bind(this)} onMouseMove={this.preventDefault.bind(this)} onDrag={this.preventDefault.bind(this)} ref={this.myInputPlayBar} className="player">
                <div id="nowPlayingLeft">
                    <div className="content">
                        <span className="albumLink">
                            <img src={this.props.albumPhoto} className="albumArtwork" alt="" />
                        </span>
                        <div className="trackInfo">
                            <span className="trackName">
                                <span>{this.props.albumName}</span>
                            </span>
                            <span className="artistName">
                                <span>{this.props.albumSinger}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div id="nowPlayingCenter">
                    <div className="content playerControls">
                        <div className="buttons">
                            <button onClick={this.shuffleSongs} className="controlButton shuffle" title="Shuffle button" style={{ display: this.state.shuffleSong ? 'none' : '' }}>
                                <img src="/assets/icons/shuffle.png" alt="Shuffle" />
                            </button>

                            <button onClick={this.shuffleSongs} className="controlButton shuffle" title="Shuffle button" style={{ display: this.state.shuffleSong ? '' : 'none' }}>
                                <img src="/assets/icons/shuffle-active.png" alt="Shuffle" />
                            </button>

                            <button onClick={() => { this.props.prevSong() }} className="controlButton previous" title="Previous button">
                                <img src="/assets/icons/previous.png" alt="Previous" />
                            </button>

                            <button onClick={() => { this.props.play() }} className="controlButton play" title="Play button" style={{ display: this.props.songInfo.play ? 'none' : '' }}>
                                <img src="/assets/icons/play.png" alt="Play" />
                            </button>

                            <button onClick={() => { this.props.play() }} className="controlButton pause" title="Pause button" style={{ display: this.props.songInfo.play ? '' : 'none' }}>
                                <img src="/assets/icons/pause.png" alt="Pause" />
                            </button>
                            <button onClick={() => { this.props.nextSong() }} className="controlButton next" title="Next button">
                                <img src="/assets/icons/next.png" alt="Next" />
                            </button>

                            <button onClick={() => { this.props.repeatSong() }} className="controlButton repeat" title="Repeat button" style={{ display: this.props.songInfo.repeat ? 'none' : '' }}>
                                <img src="/assets/icons/repeat.png" alt="Repeat" />
                            </button>
                            <button onClick={() => { this.props.repeatSong() }} className="controlButton repeat" title="Repeat button" style={{ display: this.props.songInfo.repeat ? '' : 'none' }}>
                                <img src="/assets/icons/repeat-active.png" alt="Repeat" />
                            </button>
                        </div>

                        <div className="playbackBar">
                            <span className="progressTime current">{this.formatTime(currTime)}</span>
                            <div onMouseUp={this.handleEvent2} onMouseDown={this.handleEvent} onMouseMove={this.onMouseMove} ref={this.myInput} className="progressBar">
                                <div className="progressBarBg">
                                    <div style={{ width: finalP }} className="progress"></div>
                                </div>
                            </div>
                            <span className="progressTime remaining">{this.formatTime(this.props.songInfo.remTime - this.props.songInfo.currTime)}</span>
                        </div>
                    </div>
                </div>

                <div id="nowPlayingRight">

                </div>
            </div>
        );
    }

}

export default Player;