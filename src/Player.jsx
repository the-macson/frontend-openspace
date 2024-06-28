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
import { motion } from "framer-motion";
import "react-h5-audio-player/lib/styles.css";

const Player = () => {
  const [songList, setSongList] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [songIdx, setSongIdx] = useState(0);
  const playerRef = React.createRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleBottomSheet = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    if (searchValue === "") {
      fetchSongs();
      return;
    }
    const filteredSongs = songList.filter((song) =>
      song.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setSongList(filteredSongs);
  };

  const SkeletonLoader = () => {
    const skeletonVariants = {
      animate: {
        opacity: [0.1, 0.3, 0.1],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    };
    return (
      <div className="skeleton-list">
        {[...Array(9)].map((_, index) => (
          <motion.div
            key={index}
            className="skeleton-item"
            variants={skeletonVariants}
            animate="animate"
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="player max-h-screen lg:flex relative"
      style={{
        background: `linear-gradient(0deg, ${currentSong?.accent} , ${currentSong?.accent}), linear-gradient(108.18deg, ${currentSong?.accent}99 2.46%, ${currentSong?.accent}99 99.84%)`,
      }}
    >
      <div className="leftSidebar">
        <div className="leftSidebarBox">
          <img src={logo} alt="Spotify" className="spotifyLogo" />
          <img src={Profile} alt="Spotify" className="profileImg" />
        </div>
      </div>
      <div className="sidebar">
        <div className="menu">
          <div
            style={{
              opacity: activeTab === 1 ? 1 : 0.5,
            }}
            onClick={() => setActiveTab(1)}
          >
            For You
          </div>
          <div
            style={{
              opacity: activeTab === 2 ? 1 : 0.5,
            }}
            onClick={() => setActiveTab(2)}
          >
            Top Tracks
          </div>
        </div>
        <input
          type="text"
          placeholder="Search Song, Artist"
          onChange={handleSearch}
        />
        <div className="song-list">
          {songList.length > 0 ? (
            songList.map((song, index) => (
              <div
                className="song-item"
                key={index}
                onClick={() => {
                  setCurrentSong(song);
                  setSongIdx(index);
                  setIsPlaying(true);
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
            ))
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>
      <div className="main">
        {currentSong?.name ? (
          <div>
            <h2>{currentSong?.name}</h2>
            <p>{currentSong?.artist}</p>
            <img
              src={`https://cms.samespace.com/assets/${currentSong?.cover}`}
              alt="Viva La Vida"
              className="musicImg"
              style={{
                resizeMode: "contain",
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
                      onClick={toggleBottomSheet}
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
        ) : (
          <motion.div
            className="skeleton-item"
            style={{
              width: "400px",
              height: "500px",
              background: "rgba(255, 255, 255, 0.2)",
            }}
            variants={{
              animate: {
                opacity: [0.1, 0.3, 0.1],
                transition: {
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              },
            }}
            animate="animate"
          />
        )}
      </div>
      <div className={`overlay ${isOpen ? "show" : ""}`}>
        <motion.div
          style={{
            background: `linear-gradient(0deg, ${currentSong?.accent} , ${currentSong?.accent}), linear-gradient(108.18deg, ${currentSong?.accent}99 2.46%, ${currentSong?.accent}99 99.84%)`,
          }}
          className="bottom-sheet"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
        >
          <div className="sidebar_1">
            <div className="menu">
              <div
                style={{
                  opacity: activeTab === 1 ? 1 : 0.5,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(1);
                }}
              >
                For You
              </div>
              <div
                style={{
                  opacity: activeTab === 2 ? 1 : 0.5,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(2);
                }}
              >
                Top Tracks
              </div>
            </div>
            <input
              type="text"
              placeholder="Search Song, Artist"
              onChange={(e) => {
                e.stopPropagation();
                handleSearch(e);
              }}
            />
            <div className="song-list">
              {songList.length > 0 &&
                songList.map((song, index) => (
                  <div
                    className="song-item"
                    key={index}
                    onClick={() => {
                      setCurrentSong(song);
                      setSongIdx(index);
                      toggleBottomSheet();
                      setIsPlaying(true);
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
        </motion.div>
      </div>
    </div>
  );
};

export default Player;
