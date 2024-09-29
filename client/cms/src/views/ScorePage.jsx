import { useContext, useEffect, useState } from "react";
import { themeMode } from "../context/ThemeMode";
import axios from "axios";

export default function ScorePage() {
  const { currentTheme, theme } = useContext(themeMode);
  const [highScore, setHighScore] = useState([]);
  async function score() {
    try {
      const { data } = await axios.get("https://click.daseas.cloud/score", {
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      console.log(data);
      setHighScore(data);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(highScore);

  useEffect(() => {
    score();
  }, []);
  return (
    <>
      <div className="h-screen w-screen" data-theme={theme[currentTheme]?.dataTheme}>
        <div className="overflow-x-auto flex flex-wrap justify-center mx-4 my-4 ">
          <table className="table-auto w-3/4 text-center border-2">
            {/* head */}
            <thead className="bg-gray-800 text-white border-3">
              <tr>
                <th className="px-4 py-2">No</th>
                <th className="px-4 py-2">Nama</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {highScore.map((hs) => {
                return (
                  <tr className="bg-gray-600 hover:bg-gray-300 font-bold text-white ">
                    <th className="px-4 py-2">{hs.id}</th>
                    <td className="px-4 py-2">{hs.User.username}</td>
                    <td className="px-4 py-2">{hs.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
