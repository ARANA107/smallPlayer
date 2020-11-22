import React, { Component } from 'react';
import './albumSongs.css';
import { songList } from './../list-component';

class AlbumSongs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            albumName: "some album",
            albumSinger: "Rey",
            songList: []
        }

    }


    componentDidMount() {
        this.setState({ songList: songList });

    }

    imageClick(songList, item) {
        console.log("play song: ", item.songName);
        this.props.playFromAlbum(songList, item.songPath);
    }


    render() {


        return (
            <div>
                <div className="tracklistContainer">
                    <ul className="tracklist">
                        {this.state.songList.map((item, id) => {

                            if (this.props.currentSongId === item.songId) {
                                return (
                                    <li key={id} className='tracklistRow currentPlaying'>
                                        <div className='trackCount'>
                                            <img onClick={() => this.imageClick(this.state.songList, item)} className='play' alt="something" src="/assets/icons/play-white.png" />
                                        </div>
                                        <div className='trackInfo'>
                                            <span className='trackName'>{item.songName}</span>
                                        </div>
                                    </li>
                                )
                            }
                            return (
                                <li key={id} className='tracklistRow'>
                                    <div className='trackCount'>
                                        <img onClick={() => this.imageClick(this.state.songList, item)} className='play' alt="something" src="/assets/icons/play-white.png" />
                                    </div>
                                    <div className='trackInfo'>
                                        <span className='trackName'>{item.songName}</span>
                                    </div>
                                </li>
                            )

                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

export default AlbumSongs;