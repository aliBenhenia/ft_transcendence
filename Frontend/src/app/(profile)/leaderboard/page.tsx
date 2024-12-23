'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

const timeFilters = ['All', 'This Month', 'This Week', 'Today']
const regionFilters = ['Global', 'Europe', 'N. America', 'Asia', 'Other']
const categories = ['Overall', 'Wins', 'Score', 'Time Played']

export default function Leaderboard() {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [hoveredUser, setHoveredUser] = useState(null)

  const [players] = useState([
    {
      id: 1,
      rank: 1,
      username: 'ProGamer123',
      avatar: 'https://picsum.photos/200/300',
      score: 15780,
      wins: 342,
      winRate: 76,
      level: 99,
      region: 'Europe',
      recentActivity: 'Won 5 matches',
      isOnline: true,
      trend: 'up',
    },
    // Add more players as needed
  ])

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredPlayers = players.filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            Global Rankings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 mt-2 hidden md:block"
          >
            Compete with the best players worldwide
          </motion.p>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 bg-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <LayoutGroup>
                <table className="w-full">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-700">
                      <th className="px-2 py-4 md:px-6 text-left">Rank</th>
                      <th className="px-2 py-4 md:px-6 text-left">Player</th>
                      <th className="px-2 py-4 md:px-6 text-center">Score</th>
                      <th className="px-2 py-4 md:px-6 text-center">Win Rate</th>
                      <th className="px-2 py-4 md:px-6 text-center">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filteredPlayers.map((player) => (
                        <motion.tr
                          key={player.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          whileHover={{ scale: 1.01 }}
                          className="border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors"
                          // onHoverStart={() => setHoveredUser(player.id)}
                          onHoverEnd={() => setHoveredUser(null)}
                        >
                          <td className="px-2 py-4 md:px-6">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                #{player.rank}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 py-4 md:px-6 flex items-center gap-4">
                            <div className="relative">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                              <img
                                src={player.avatar}
                                alt={player.username}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover relative"
                              />
                              {player.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                              )}
                            </div>
                            <div className="hidden md:block">
                              <div className="font-semibold">{player.username}</div>
                              <div className="text-sm text-gray-400">{player.region}</div>
                            </div>
                            <div className="block md:hidden">
                              <div className="font-semibold">{player.username.slice(0, 8)}...</div>
                              <div className="text-sm text-gray-400">{player.region.slice(0, 6)}</div>
                            </div>
                          </td>
                          <td className="px-2 py-4 md:px-6 text-center">
                            <div className="font-mono text-lg">{player.score.toLocaleString()}</div>
                          </td>
                          <td className="px-2 py-4 md:px-6">
                            <div className="flex justify-center">
                              <div className="relative w-20 md:w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-blue-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${player.winRate}%` }}
                                  transition={{ duration: 1, ease: 'easeOut' }}
                                />
                              </div>
                              <span className="ml-2 text-sm">{player.winRate}%</span>
                            </div>
                          </td>
                          <td className="px-2 py-4 md:px-6 text-center">
                            <motion.div
                              animate={{
                                y: player.trend === 'up' ? [-2, 2] : [2, -2],
                              }}
                              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                              className={`inline-block ${
                                player.trend === 'up' ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {player.trend === 'up' ? '↑' : '↓'}
                            </motion.div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </LayoutGroup>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Total Players</h3>
            <div className="text-3xl font-bold text-purple-400">
              {players.length.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Avg. Score</h3>
            <div className="text-3xl font-bold text-blue-400">
              {Math.round(
                players.reduce((acc, player) => acc + player.score, 0) / players.length
              ).toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">Online</h3>
            <div className="text-3xl font-bold text-pink-400">
              {players.filter((p) => p.isOnline).length.toLocaleString()}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}