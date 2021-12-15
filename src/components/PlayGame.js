import React, { useState, useEffect } from "react";
import { GameSessions } from "../models/gameSession";
import { StreamingController } from "streaming-view-sdk";
import { useNavigate } from "react-router-dom";
import AuthAmplify from "@aws-amplify/auth";
import { useStyles } from "./styles.style";
import {
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

export const PlayGame = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get("username");
  const userId = urlParams.get("userId");

  const [listGames, setListGames] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [startImmediately, setStartImmediately] = useState(false);
  const [volume, setVolume] = useState(0);
  const [showGameHeader, setShowGameHeader] = useState(false);
  const [enableGameImg, setEnableGameImg] = useState(false);
  const [nbImage, setNbImage] = useState(null);

  const FAKE_FEEDBACK = {
    ease: 5,
    email: "a@gmail.com",
    fast: 5,
    features: 5,
    feedback: "test",
    rating: 5,
    recommend: "a",
  };

  const navigate = useNavigate();
  const classes = useStyles();

  const STREAM_ENDPOINT = "https://streaming-api.appland-stream.com";

  const onClickSelectGame = (game) => {
    setSelectedGame(game);
  };

  const logout = async () => {
    await AuthAmplify.signOut();
    navigate("/");
  };

  const sendFbToGet1000Coins = async () => {
    try {
      await GameSessions.createTransactionV2(
        "FEEDBACK",
        JSON.stringify(FAKE_FEEDBACK)
      );
      alert("congrats 1000 coins have been added to your account !");
    } catch (error) {
      alert(error);
    }
  };

  const getDeviceInfo = async () => {
    const streamingController = await StreamingController({
      apiEndpoint: STREAM_ENDPOINT,
    });
    return JSON.stringify(await streamingController.getDeviceInfo());
  };

  const onClickPlayGame = async () => {
    setIsStarting(true);
    const deviceInfo = await getDeviceInfo();
    const gS = await GameSessions.playSoloMoment({
      device: { info: deviceInfo },
      gameId: selectedGame.moment.appId,
      momentId: "90e9a9ab-9cde-4cde-a97b-91df5e5420b7",
      sessionType: selectedGame.moment.momentType,
    });

    navigate(
      `/streaming-view?userId=${userId}&gameSessionId=${gS.gameSessionId}&edgeNodeId=${gS.edgeNodeId}&gameName=${selectedGame.title}&startImmediately=${startImmediately}&volume=${volume}&showGameHeader=${showGameHeader}&enableGameImg=${enableGameImg}&nbImage=${nbImage}`
    );
  };

  const selectSubwaySurfersAsDefault = () => {
    const ss = listGames?.find((game) => game.id === "152144");
    setSelectedGame(ss);
  };

  const getListGamesAndListMoments = async () => {
    const listGames = await GameSessions.listGames(["LIVE"]);
    const cloneListGames = [...listGames];
    const mapMomentToListGames = await Promise.all(
      cloneListGames.map(async (game) => {
        const listMoments = await GameSessions.getListMoment(
          game.id,
          game.status
        );
        return { ...game, moment: listMoments[0] };
      })
    );
    setListGames(mapMomentToListGames);
  };

  const onChangeStartMethod = (e) => {
    const checked = e.target.checked;
    setStartImmediately(checked);
  };

  const onChangeShowGH = (e) => {
    const checked = e.target.checked;
    setShowGameHeader(checked);
  };

  const onChangeShowGameImg = (e) => {
    const checked = e.target.checked;
    setEnableGameImg(checked);
  };

  const onChangeVolume = (e) => {
    const checked = e.target.checked;
    setVolume(checked ? 0 : 0.5);
  };

  useEffect(() => {
    getListGamesAndListMoments();
  }, []);

  useEffect(() => {
    listGames && selectSubwaySurfersAsDefault();
  }, [listGames]);

  return (
    <div className={classes.container}>
      <div className={classes.listGameContainer}>
        <Typography variant="h5">Hello {username}</Typography>
        {!listGames && <Typography>Fetching list games...</Typography>}
        <div className={classes.listGame}>
          {listGames?.map((game) => (
            <div className={classes.gameItem}>
              <Typography variant="subtitle1">{game.title}</Typography>
              <Button
                classes={{ root: classes.selectGameButton }}
                variant="outlined"
                disabled={isStarting}
                onClick={() => onClickSelectGame(game)}
              >
                Select this game
              </Button>
            </div>
          ))}
        </div>
        {listGames && (
          <FormGroup className={classes.form}>
            <FormControlLabel
              control={<Checkbox />}
              label="Start playing immediately"
              onChange={(e) => onChangeStartMethod(e)}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Turn off game sound"
              onChange={(e) => onChangeVolume(e)}
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Enable Game Header"
              onChange={(e) => onChangeShowGH(e)}
            />
            <FormControlLabel control={<Checkbox />} label="Enable Timer" />
            <div className={classes.images}>
              <FormControlLabel
                control={<Checkbox />}
                label="Enable Game Images at Background"
                onChange={(e) => onChangeShowGameImg(e)}
              />
              <input
                type="number"
                placeholder={"Enter number of images"}
                value={nbImage}
                onChange={(event) => setNbImage(event.target.value)}
              />
            </div>
          </FormGroup>
        )}

        {selectedGame && (
          <div className={classes.selectedGame}>
            <Typography>
              Game Selected:
              <span>{selectedGame.title}</span>
            </Typography>
            <Typography>
              Id:
              <span>{selectedGame.id}</span>
            </Typography>
            <Typography>
              MomentId:
              <span>{selectedGame.moment.id}</span>
            </Typography>
            <Typography>
              SnapshotId:
              <span>{selectedGame.moment.snapshotId}</span>
            </Typography>
          </div>
        )}
        {selectedGame && (
          <Button
            variant="outlined"
            disabled={isStarting}
            className={classes.startButton}
            onClick={onClickPlayGame}
          >
            {isStarting ? "Starting..." : "Start"}
          </Button>
        )}
        <Button
          variant="outlined"
          className={classes.logoutButton}
          onClick={logout}
        >
          Logout
        </Button>

        <Button
          variant="outlined"
          className={classes.get1000Coin}
          onClick={sendFbToGet1000Coins}
        >
          Get 1000 coins
        </Button>
      </div>
    </div>
  );
};

export default PlayGame;
