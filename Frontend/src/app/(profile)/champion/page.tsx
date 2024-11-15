'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function TournamentBracket() {
  const [players] = useState([
    { 
      id: 1, 
      name: 'Alex Chen', 
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg', 
      stats: { wins: 28, rank: 'Elite' },
      status: 'online'
    },
    { 
      id: 2, 
      name: 'Sarah Kim', 
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg', 
      stats: { wins: 24, rank: 'Master' },
      status: 'online'
    },
    { 
      id: 3, 
      name: 'Mike Ross', 
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg', 
      stats: { wins: 22, rank: 'Expert' },
      status: 'offline'
    },
    { 
      id: 4, 
      name: 'Emma Liu', 
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg', 
      stats: { wins: 20, rank: 'Pro' },
      status: 'online'
    }
  ])

  const [winners, setWinners] = useState<{ left?: string; right?: string; final?: string }>({})

  const PlayerCard = ({ player, side, onClick }: { player: any; side: 'left' | 'right'; onClick?: () => void }) => (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
      <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 hover:border-pink-500/50 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300" />
            <img 
              src={player.avatar} 
              className="relative w-12 h-12 rounded-full object-cover"
              alt={player.name}
            />
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900 ${
              player.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
            }`} />
          </div>
          <div>
            <h3 className="font-bold text-white group-hover:text-pink-400 transition-colors">
              {player.name}
            </h3>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">{player.stats.rank}</span>
              <span className="text-gray-600">•</span>
              <span className="text-purple-400">{player.stats.wins} wins</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const ConnectorLine = ({ side }: { side: 'left' | 'right' }) => (
    <div className="relative">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`absolute w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 top-1/2 ${
          side === 'left' ? 'right-0' : 'left-0'
        }`}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute w-2 h-2 rounded-full bg-pink-500 top-1/2 -translate-y-1/2 right-0"
      />
    </div>
  )

  const handleWinner = (side: 'left' | 'right', player: string) => {
    setWinners(prev => ({
      ...prev,
      [side]: player,
      final: side === 'left' ? player : prev.right // Set final only if right side was already set
    }))
  }

  const handleFinal = () => {
    if (winners.left && winners.right) {
      const winner = Math.random() > 0.5 ? winners.left : winners.right // Randomly determine final winner
      setWinners(prev => ({ ...prev, final: winner }))
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] bg-gradient-to-b from-purple-900/20 to-pink-900/20 p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Ping Pong
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-gray-400 mt-2"
        >
          Tournament Finals
        </motion.p>
      </motion.div>

      {/* Tournament Bracket */}
      <div className="max-w-7xl mx-auto relative">
        {/* Center Trophy */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500 blur-2xl opacity-20" />
            <div className="relative bg-gradient-to-b from-yellow-400 to-yellow-600 w-32 h-32 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-6xl">🏆</span>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-4 bg-yellow-500/20 rounded-3xl blur-xl"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="text-yellow-500 font-bold">FINAL MATCH</div>
            <div className="text-gray-500 text-sm">Best of 3</div>
          </div>
        </motion.div>

        {/* Bracket Structure */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Side */}
          <div className="space-y-24">
            <div className="relative">
              <PlayerCard player={players[0]} side="left" onClick={() => handleWinner('left', players[0].name)} />
              <ConnectorLine side="left" />
            </div>
            <div className="relative">
              <PlayerCard player={players[1]} side="left" onClick={() => handleWinner('left', players[1].name)} />
              <ConnectorLine side="left" />
            </div>
          </div>

          {/* Center - Finals */}
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-full h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent"
            />
            {winners.final ? (
              <div className="text-3xl font-bold text-yellow-500 mt-4">{winners.final} is the Champion!</div>
            ) : (
              <button onClick={handleFinal} className="mt-4 bg-purple-600 text-white py-2 px-4 rounded-full hover:bg-purple-700 transition duration-300">
                Determine Final Winner
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="space-y-24">
            <div className="relative">
              <PlayerCard player={players[2]} side="right" onClick={() => handleWinner('right', players[2].name)} />
              <ConnectorLine side="right" />
            </div>
            <div className="relative">
              <PlayerCard player={players[3]} side="right" onClick={() => handleWinner('right', players[3].name)} />
              <ConnectorLine side="right" />
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-700">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-purple-400">4 Players</span>
              <span className="text-gray-600">•</span>
              <span className="text-pink-400">Single Elimination</span>
              <span className="text-gray-600">•</span>
              <span className="text-purple-400">Best of 3</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-pink-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}