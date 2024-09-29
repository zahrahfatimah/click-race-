import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import dinoA from "../assets/DinoSprites_tard.gif";
import dinoB from "../assets/DinoSprites_vita.gif";
import axios from "axios";
import background from "../assets/background.gif";

export default function HomePage({ socket }) {
  const [myCount, setMyCount] = useState(0);
  const [otherCount, setOtherCount] = useState(0);
  const [room, setRoom] = useState("");
  const [isWaiting, setIsWaiting] = useState(true);
  const [timer, setTimer] = useState(10);
  const [otherVote, setOtherVote] = useState(0);
  const [myVote, setMyVote] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [otherScore, setOtherScore] = useState(0);
  const [myName, setMyName] = useState("");
  const [otherName, setOtherName] = useState("");
  const [score, setScore] = useState(0);

  function handleAdd() {
    if (room) {
      socket.emit("count:add", { room });
    }
  }

  function handleVote() {
    if (room) {
      socket.emit("vote", { room });
    }
  }

  function handleScore() {
    if (room) {
      axios.post(
        "https://click.daseas.cloud/score",
        { score: myScore },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setMyScore(0);
    }
  }

  function handleSwalWin() {
    Swal.fire({
      title: "You Win",
      icon: "success",
      timer: 4000,
    });
  }

  function handleSwalLose() {
    Swal.fire({
      title: "You Lose",
      icon: "error",
      timer: 4000,
    });
  }

  function handleDraw() {
    Swal.fire({
      title: "Draw",
      icon: "question",
      timer: 4000,
    });
  }

  useEffect(() => {
    const username = localStorage.getItem("username");
    setMyName(username);

    socket.auth = {
      access_token: localStorage.getItem("access_token"),
      username: username,
    };

    socket.connect();

    socket.on("message", (message) => {
      const matched = message.match(/room (\d+)/);
      if (matched) {
        setRoom(`room-${matched[1]}`);
      }

      if (message.includes("Waiting")) {
        setIsWaiting(true);
      } else {
        setIsWaiting(false);
      }
    });

    socket.on("usernames", (names) => {
      setMyName(names.myName);
      setOtherName(names.otherName);
    });

    socket.on("count:update", (counts, score) => {
      const userIds = Object.keys(counts);
      const myId = socket.id;

      setMyCount(counts[myId]);
      const otherUserId = userIds.find((id) => id !== myId);
      if (otherUserId) {
        setOtherCount(counts[otherUserId]);
      }
      setMyScore(counts[myId]);
      const otherScore = userIds.find((id) => id !== myId);
      if (otherScore) {
        setOtherScore(counts[otherScore]);
      }
    });

    socket.on("vote:update", (vote) => {
      const userIds = Object.keys(vote);
      const myId = socket.id;

      setMyVote(vote[myId]);
      const otherUserId = userIds.find((id) => id !== myId);
      if (otherUserId) {
        setOtherVote(vote[otherUserId]);
      }
    });

    socket.on("timer:update", (timeLeft) => {
      setTimer(timeLeft);
      if (timeLeft <= 0) {
        setTimer(timeLeft);
      }
    });

    return () => {
      socket.off("message");
      socket.off("usernames");
      socket.off("count:update");
      socket.off("timer:update");
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (timer <= 0) {
      const updatedScore = myCount;
      setScore(myCount);
      if (updatedScore > otherScore) {
        handleSwalWin();
      } else if (updatedScore < otherScore) {
        handleSwalLose();
      } else if (updatedScore == otherScore) {
        handleDraw();
      }
    }

    if (myScore === score) {
      handleScore();
    }
  }, [myScore, score, timer]);

  return (
    <div className="text-center w-screen h-screen ">
      <img
        className="w-screen h-screen object-cover absolute  left-5 z-[-1]  "
        src={background}
        alt="background"
      />

      {/* Scores and Timer */}
      <div className="flex justify-center space-x-10  pt-52">
        {/* Player 1 */}
        <div>
          <h2
            className="text-5xl font-bold"
            style={{
              color: "#fe502d",
            }}
          >
            You
          </h2>
          <p
            className="text-8xl font-bold"
            style={{
              color: "#fe502d",
            }}
          >
            {myCount}
          </p>

          <img src={dinoA} alt="Superman Dino" className="w-24 h-24 " />
        </div>
        <div>
          <h2
            className="text-8xl font-bold"
            style={{
              color: "#cc9900",
            }}
          >
            VS
          </h2>
        </div>
        <div>
          <h2
            className="text-5xl font-bold"
            style={{
              color: "#fe502d",
            }}
          >
            {otherName === localStorage.getItem("username")
              ? myName
              : otherName}
          </h2>
          <p
            className="text-8xl font-bold"
            style={{
              color: "#fe502d",
            }}
          >
            {otherCount}
          </p>
          <img src={dinoB} alt="Batman Dino" className="w-24 h-24" />
        </div>
      </div>

      {/* Timer */}
      <span className="countdown font-mono text-4xl text-white font-bold pb-3">
        <span style={{ "--value": `${timer}`, color: "#FCF3D4" }}></span>
      </span>

      {/* Action Buttons */}

      <div className="flex items-center justify-center space-x-8 mb-4">
        {timer === 0 || (timer < 11 && timer >= 10) ? (
          <button
            onClick={handleVote}
            className="bg-gray-800 rounded-full w-20 h-20 hover:scale-110 transition duration-300"
          >
            READY
          </button>
        ) : (
          <button
            onClick={handleAdd}
            className="bg-green-500 rounded-full w-20 h-20 hover:scale-110 transition duration-300"
          >
            CLICK
          </button>
        )}
      </div>
    </div>
  );
}
