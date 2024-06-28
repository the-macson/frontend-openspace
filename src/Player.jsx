import React, { useEffect, useState } from "react";
import "./Player.css";
import albumCover from "./../public/Cover.png"; // replace with the actual path to your album cover
import logo from "../public/Logo.png";
import Profile from "../public/Profile.png";
import AudioPlayer from "react-h5-audio-player";
import Play from "../public/play.png";
import Volume from "../public/volume.png";
import Next from "../public/next.png";
import Prev from "../public/previous.png";
import Three from "../public/three.png";
import Pause from "../public/pause.png";

import "react-h5-audio-player/lib/styles.css";

const Player = () => {
  const [songList, setSongList] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [songIdx, setSongIdx] = useState(0);
  const playerRef = React.createRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const songs = [
    { title: "Starboy", artist: "The Weeknd", duration: "4:16" },
    { title: "Demons", artist: "Imagine Dragons", duration: "5:24" },
    {
      title: "Mouth of the river",
      artist: "Imagine Dragons",
      duration: "6:23",
    },
    { title: "Ghost Stories", artist: "Coldplay", duration: "3:10" },
    { title: "Sparks", artist: "Coldplay", duration: "4:23" },
    { title: "Viva La Vida", artist: "Coldplay", duration: "5:32" },
    { title: "Hymn for the weekend", artist: "Coldplay", duration: "2:23" },
    { title: "Pain", artist: "Ryan Jones", duration: "3:12" },
    { title: "Origin", artist: "Imagine Dragons", duration: "3:43" },
  ];

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const response = await fetch("https://cms.samespace.com/items/songs");
    const { data } = await response.json();
    console.log(data);
    setSongList(data);
    setCurrentSong(data[0]);
  };

  return (
    <div
      className="player max-h-screen lg:flex relative"
      style={{
        background: `linear-gradient(0deg, ${currentSong?.accent} , ${currentSong?.accent}), linear-gradient(108.18deg, ${currentSong?.accent}99 2.46%, ${currentSong?.accent}99 99.84%)`,
      }}
    >
      <div className="leftSidebar">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <img src={logo} alt="Spotify" className="spotifyLogo" />
          <img src={Profile} alt="Spotify" className="profileImg" />
        </div>
      </div>
      <div className="sidebar">
        <div className="menu">
          <div>For You</div>
          <div>Top Tracks</div>
        </div>
        <input type="text" placeholder="Search Song, Artist" />
        <div className="song-list">
          {songList.length > 0 &&
            songList.map((song, index) => (
              <div
                className="song-item"
                key={index}
                onClick={() => {
                  setCurrentSong(song);
                  setSongIdx(index);
                }}
              >
                <img
                  src={`https://cms.samespace.com/assets/${song.cover}`}
                  alt={song.title}
                />
                <div className="song-info">
                  <div>{song.name}</div>
                  <div>{song.artist}</div>
                </div>
                <div className="song-duration">04:00</div>
              </div>
            ))}
        </div>
      </div>
      <div className="main">
        <div>
          <h2>{currentSong?.name}</h2>
          <p>{currentSong?.artist}</p>
          <img
            src={`https://cms.samespace.com/assets/${currentSong?.cover}`}
            alt="Viva La Vida"
            style={{
              width: "480px",
              resizeMode: "contain",
              height: "480px",
              borderRadius: "10px",
            }}
          />
          <div className="controls">
            <AudioPlayer
              autoPlay
              ref={playerRef}
              showSkipControls={true}
              showJumpControls={false}
              onEnded={() => {
                if (songIdx < songList.length - 1) {
                  setCurrentSong(songList[songIdx + 1]);
                  setSongIdx(songIdx + 1);
                } else {
                  setCurrentSong(songList[0]);
                  setSongIdx(0);
                }
              }}
              src={currentSong?.url}
              loop={false}
              onPlay={(e) => console.log("onPlay")}
              customControlsSection={[
                <div>
                  <img
                    src={Three}
                    alt="three"
                    className="iconBig"
                    onClick={() => {
                      console.log("Three Dots");
                    }}
                  />
                </div>,
                <div>
                  <img
                    src={Prev}
                    alt="three"
                    className="icon"
                    onClick={() => {
                      if (songIdx > 0) {
                        setCurrentSong(songList[songIdx - 1]);
                        setSongIdx(songIdx - 1);
                      } else {
                        setCurrentSong(songList[songList.length - 1]);
                        setSongIdx(songList.length - 1);
                      }
                    }}
                  />
                </div>,
                <div>
                  {isPlaying ? (
                    <img
                      src={Pause}
                      alt="Pause"
                      className="iconBig"
                      onClick={() => {
                        // pause the song
                        playerRef.current.audio.current.pause();
                        setIsPlaying(false);
                      }}
                    />
                  ) : (
                    <img
                      src={Play}
                      alt="Play"
                      className="iconBig"
                      onClick={() => {
                        // play the song
                        playerRef.current.audio.current.play();
                        setIsPlaying(true);
                      }}
                    />
                  )}
                </div>,
                <div>
                  <img
                    src={Next}
                    alt="three"
                    className="icon"
                    onClick={() => {
                      if (songIdx < songList.length - 1) {
                        setCurrentSong(songList[songIdx + 1]);
                        setSongIdx(songIdx + 1);
                      } else {
                        setCurrentSong(songList[0]);
                        setSongIdx(0);
                      }
                    }}
                  />
                </div>,
                <div>
                  <img src={Volume} alt="Volume" className="iconBig" />
                </div>,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
