import React, { Component } from 'react';
import './App.css';
import Player from './components/Player/Player';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AlbumSongs from './components/albumSongs/albumSongs';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      play: false,
      showButton: false,
      remTime: 0.00,
      currTime: 0.00,
      volume: 12,
      songList: [],
      shuffleSongList: [],
      currentSongId: 0,
      shuffleSong: false,
      repeat: false,
      count: 0,
      albumName: null,
      albumPhoto: null,
      albumSinger: null,
      display: true,
      song: require('./components/shared/songs/bensound-energy.mp3'),
    };
  }


  componentDidMount() {

    this.audio = new Audio(this.state.song);
    this.setState({ volume: this.audio.volume })

    this.audio.onloadedmetadata = () => {
      this.setState({ remTime: this.audio.duration })
      this.setState({ currTime: this.audio.currentTime })

    };
    this.audio.addEventListener("canplay", () => {
      this.setState({ remTime: this.audio.duration })
    });
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio.duration) {
        this.setState({ currTime: this.audio.currentTime })
      }
    });

    this.audio.addEventListener("ended", () => {
      this.nextSong();
    })
  }


  setTime = (time) => {
    this.audio.onloadedmetadata = () => {
    };
    this.audio.currentTime = time;
  }

  setVol = (vol) => {

    if (vol) {
      if (vol < 0) {
        vol = 0
      }
      if (vol > 1) {
        vol = 1
      }
      this.audio.onloadedmetadata = () => {
      };
      this.audio.volume = vol;
    } else {
      this.audio.muted = !this.audio.muted
    }

  }
  repeatSong = () => {

    this.setState({ repeat: !this.state.repeat });

  }

  setAlbumDetails = (albumName, albumPhoto, albumSinger) => {
    this.setState({ albumName, albumPhoto, albumSinger });

  }

  shuffleSong = () => {
    this.setState({ shuffleSong: !this.state.shuffleSong });

    let shuffledList = [...this.state.songList];
    shuffledList = this.shuffleArray(shuffledList);
    this.setState({ shuffleSongList: shuffledList });

  }

  shuffleArray(array) {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }


  nextSong = () => {
    let nextSongId = null;
    let shuffledIds = null;

    if (this.state.repeat) {
      nextSongId = this.state.currentSongId;
    }

    if (this.state.shuffleSong) {
      shuffledIds = this.state.shuffleSongList.map((obj) => {
        return obj.songId
      })

      this.setState({ count: this.state.count + 1 })

      if (this.state.count > this.state.songList.length - 2) {
        this.setState({ count: 0 });
      }

      if (this.state.repeat) {
        nextSongId = this.state.currentSongId;
      } else {
        nextSongId = shuffledIds[this.state.count];

      }

      if (nextSongId > this.state.songList.length) {
        nextSongId = shuffledIds[0];
        this.setState({ currentSongId: nextSongId })

      } else {
        this.setState({ currentSongId: nextSongId })
      }

      this.state.songList.forEach(item => {
        if (item.songId === nextSongId) {
          this.setState({ song: item.songPath });
          this.audio.src = item.songPath;

          this.audio.load();
          if (this.state.play) {
            this.playSong('next');
          }

        }

      })
    }
    else {
      if (this.state.repeat) {
        nextSongId = this.state.currentSongId
      } else {
        nextSongId = this.state.currentSongId + 1;

      }

      if (nextSongId > this.state.songList.length) {
        nextSongId = 1;
        this.setState({ currentSongId: nextSongId })

      } else {
        this.setState({ currentSongId: nextSongId })
      }

      this.state.songList.forEach(item => {
        if (item.songId === nextSongId) {
          this.setState({ song: item.songPath });
          this.audio.src = item.songPath;
          this.audio.load();
          if (this.state.play) {
            this.playSong('next');
          }

        }
      })
    }
  }

  prevSong = () => {
    let prevSongId = null;
    let shuffledIds = null;

    if (this.state.repeat) {
      prevSongId = this.state.currentSongId;
    } else {
      prevSongId = this.state.currentSongId - 1;
    }



    if (this.state.shuffleSong) {
      shuffledIds = this.state.shuffleSongList.map((obj, index, array) => {
        return obj.songId
      })
      if (this.state.count === 0) {
        let num = this.state.songList.length - 1;
        this.setState({ count: num });
      } else {
        this.setState({ count: this.state.count - 1 })
      }

      if (this.state.repeat) {
        prevSongId = this.state.currentSongId;
      } else {
        prevSongId = shuffledIds[this.state.count];
      }

      if (prevSongId < 1) {
        prevSongId = shuffledIds[this.state.songList.length - 1];
        this.setState({ currentSongId: prevSongId })

      } else {
        this.setState({ currentSongId: prevSongId })
      }

      this.state.songList.forEach(item => {
        if (item.songId === prevSongId) {
          this.setState({ song: item.songPath });
          this.audio.src = item.songPath;

          this.audio.load();
          if (this.state.play) {
            this.playSong('prev');
          }

        }
      })
    } else {
      if (prevSongId < 1) {
        prevSongId = this.state.songList.length;
        this.setState({ currentSongId: prevSongId })

      } else {
        this.setState({ currentSongId: prevSongId })
      }
      this.state.songList.forEach(item => {
        if (item.songId === prevSongId) {
          this.setState({ song: item.songPath });
          this.audio.src = item.songPath;
          this.audio.load();

          if (this.state.play) {
            this.playSong('prev');

          }

        }
      })
    }
  }

  playFromAlbum = (songList, path) => {
    this.setState({ songList: songList });
    let currentSongId = 0;
    songList.forEach((item) => {
      if (item.songPath === path) {
        currentSongId = item.songId
      }

    })
    this.setState({ currentSongId: currentSongId })
    this.setState({ song: path });
    this.audio.src = path;
    this.audio.load();
    this.playSong('next');
  }


  playSong = (action) => {
    if (action === 'next' || action === 'prev') {
      this.setState({ play: true });
      this.audio.play();
    } else {
      if (this.state.play === false) {
        this.audio.play();
        this.setState({ play: true });
        this.setState({ showButton: true })
      } else {
        this.audio.pause();
        this.setState({ play: false });
        this.setState({ showButton: false })
      }
    }

  }

  setPlayList = (list) => {
    this.setState({ songList: list });
  }

  setDisplayOff = (value) => {
    this.setState({ display: value })
  }


  render() {


    return (
      <React.Fragment>
        <Router>
          <AlbumSongs setAlbumDetails={this.setAlbumDetails} setPlayList={this.setPlayList} playFromAlbum={this.playFromAlbum} setDisplayOff={this.setDisplayOff} currentSongId={this.state.currentSongId} />
          <Player setVol={this.setVol} setTime={this.setTime} audio={this.audio} play={this.playSong} songInfo={this.state} nextSong={this.nextSong} prevSong={this.prevSong} repeatSong={this.repeatSong} shuffleSong={this.shuffleSong} albumName={this.state.albumName} albumPhoto={this.state.albumPhoto} albumSinger={this.state.albumSinger} />
        </Router>


      </React.Fragment>
    );
  }

}

export default App;
