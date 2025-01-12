"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaTimesCircle } from "react-icons/fa";
// import moment from 'moment';
import axios from "axios";

interface LastMatchesCardProps {
  userId: number; 
}
const LastMatchesCard = ({ userId }:LastMatchesCardProps) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (userId === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pingpong/match_history/?user_id=${userId}`);
        // let date = new Date()
        if (response.status !== 200) {
            return;
        }
        if (response.data.error === "No games found") {
          setMatches([]);
          return;
        }
        const formattedMatches = response.data.map((match:any) => {
          // Check if necessary properties exist
          if (!match.loser || !match.winner) {
            return null;
          }
          
          return {
            player1: {
              username: match.winner.username || "Unknown",
              avatar: match.winner.photo_url,
              score: match.winner_score,
            },
            player2: {
              username: match.loser.username || "Unknown",
              avatar: match.loser.photo_url,
              score: match.loser_score,
            },
            date: new Date(match.end_time).toString(), // to modify
            // date: new Date().getDate(),// match.time_ago,
            result: match.winner.id === userId ? "Win" : "Loss",
          };
        }).filter(Boolean);

        setMatches(formattedMatches);
      } catch (error) {
        console.error("Error fetching match history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [userId]);
  const formdate = (date:any) => {
     const d = new Date(date);
      return d.toLocaleDateString("en-US",{
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
  }

  if (loading) {
    return (
      <div className="relative bg-[#00152993] rounded-2xl shadow-lg overflow-hidden mt-5 w-full p-6">
        <h2 className="text-2xl font-semibold text-white">Loading...</h2>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="relative bg-[#00152993] rounded-2xl shadow-lg overflow-hidden mt-5 w-full p-6">
        <h2 className="text-2xl font-semibold text-white">No Matches Found</h2>
      </div>
    );
  }

  return (
    <div className="relative bg-[#00152993] rounded-2xl shadow-lg overflow-hidden mt-5 w-full">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-[#00152993] p-6 w-full z-10">
        <h2 className="text-2xl font-semibold text-white">Last Matches</h2>
      </div>

      {/* Matches List (Scrollable Section) */}
      <div className="p-6 overflow-y-auto max-h-[400px]">
        <div className="space-y-4">
          {matches.map((match:any, index) => (
            <motion.div
              key={index}
              className={`p-4 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 transition-all duration-300 ease-in-out transform hover:bg-opacity-90 ${
                match.result === "Win" ? "bg-[#07325F] border-l-4 border-green-500" : "bg-[#07325F] border-l-4 border-red-500"
              }`}
            >
              {/* Date */}
              <div className="absolute top-1 right-4 text-gray-300 text-xs">
                {formdate(match.date)}
              </div>

              {/* Match Details (Players and Scores) */}
              <div className="flex flex-col md:flex-row items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <img
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                    src={match.player1.avatar}
                    alt={`Avatar of ${match.player1.username}`}
                  />
                  <div className="text-white text-lg font-semibold">{match.player1.username}</div>
                  <div className={`text-lg font-bold ${match.result === "Win" ? "text-green-500" : "text-red-500"}`}>
                    {match.player1.score}
                  </div>
                </div>

                {/* Vs Separator */}
                <div className="text-white text-xl font-bold mx-2">vs</div>

                <div className="flex items-center space-x-4">
                  <img
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                    src={match.player2.avatar}
                    alt={`Avatar of ${match.player2.username}`}
                  />
                  <div className="text-white text-lg font-semibold">{match.player2.username}</div>
                  <div className={`text-lg font-bold ${match.result === "Loss" ? "text-green-500" : "text-red-500"}`}>
                    {match.player2.score}
                  </div>
                </div>
              </div>

              {/* Result Icon */}
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${match.result === "Win" ? "text-green-500" : "text-red-500"}`}>
                  {match.result === "Win" ? <FaTrophy /> : <FaTimesCircle />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastMatchesCard;