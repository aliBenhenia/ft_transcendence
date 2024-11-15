'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Player {
  id: number
  name: string
  avatar: string
  wins: number
  losses: number
  rank: string
}

interface Match {
  id: number
  round: number
  player1: Player
  player2: Player
  score?: [number, number]
  winner?: Player
  status: 'upcoming' | 'in_progress' | 'completed'
  startTime?: string
}

export default function TournamentBracket() {
  const [players] = useState<Player[]>([
    {
      id: 1,
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      wins: 28,
      losses: 5,
      rank: "Diamond"
    },
    {
      id: 2,
      name: "Sarah Smith",
      avatar: "/placeholder.svg?height=100&width=100",
      wins: 24,
      losses: 8,
      rank: "Platinum"
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      wins: 22,
      losses: 10,
      rank: "Gold"
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=100&width=100",
      wins: 20,
      losses: 12,
      rank: "Silver"
    }
  ])

  const [matches] = useState<Match[]>([
    {
      id: 1,
      round: 1,
      player1: players[0],
      player2: players[3],
      score: [11, 8],
      winner: players[0],
      status: 'completed',
      startTime: '14:00'
    },
    {
      id: 2,
      round: 1,
      player1: players[1],
      player2: players[2],
      status: 'in_progress',
      startTime: '14:30'
    },
    {
      id: 3,
      round: 2,
      player1: players[0],
      player2: undefined,
      status: 'upcoming',
      startTime: '15:00'
    }
  ])

  const MatchCard = ({ match }: { match: Match }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700 shadow-xl"
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-sm px-3 py-1 rounded-full ${
          match.status === 'completed' ? 'bg-green-500/20 text-green-400' :
          match.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
          'bg-blue-500/20 text-blue-400'
        }`}>
          {match.status === 'completed' ? 'Completed' :
           match.status === 'in_progress' ? 'In Progress' :
           'Upcoming'}
        </span>
        <span className="text-gray-400 text-sm">{match.startTime}</span>
      </div>

      <div className="space-y-4">
        {/* Player 1 */}
        <div className={`flex items-center justify-between ${
          match.winner?.id === match.player1?.id ? 'bg-green-500/10' : ''
        } p-2 rounded-lg`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <img
                src={match.player1?.avatar}
                alt={match.player1?.name}
                className="w-12 h-12 rounded-full object-cover relative"
              />
            </div>
            <div>
              <div className="font-semibold text-white">{match.player1?.name}</div>
              <div className="text-sm text-gray-400">{match.player1?.rank}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {match.score?.[0] || '-'}
          </div>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-px bg-gray-700"></div>
          <span className="mx-4 text-gray-400">VS</span>
          <div className="w-16 h-px bg-gray-700"></div>
        </div>

        {/* Player 2 */}
        <div className={`flex items-center justify-between ${
          match.winner?.id === match.player2?.id ? 'bg-green-500/10' : ''
        } p-2 rounded-lg`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
              <img
                src={match.player2?.avatar}
                alt={match.player2?.name}
                className="w-12 h-12 rounded-full object-cover relative"
              />
            </div>
            <div>
              <div className="font-semibold text-white">{match.player2?.name || 'TBD'}</div>
              <div className="text-sm text-gray-400">{match.player2?.rank || '...'}</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {match.score?.[1] || '-'}
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Tournament Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4"
          >
            Ping Pong Tournament
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            4 Players • Single Elimination • Best of 3
          </motion.div>
        </div>

        {/* Tournament Bracket */}
        <div className="grid grid-cols-2 gap-8">
          {/* Semi-finals */}
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-center mb-6 text-gray-400">Semi-finals</h2>
            <MatchCard match={matches[0]} />
            <MatchCard match={matches[1]} />
          </div>

          {/* Finals */}
          <div className="flex items-center justify-center">
            <div className="w-full">
              <h2 className="text-xl font-semibold text-center mb-6 text-gray-400">Finals</h2>
              <MatchCard match={matches[2]} />
            </div>
          </div>
        </div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          {players.map((player) => (
            <motion.div
              key={player.id}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200" />
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-16 h-16 rounded-full object-cover relative"
                  />
                </div>
                <div>
                  <div className="font-semibold text-white">{player.name}</div>
                  <div className="text-sm text-gray-400">{player.rank}</div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <div className="text-green-400 font-bold">{player.wins}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-2">
                  <div className="text-red-400 font-bold">{player.losses}</div>
                  <div className="text-xs text-gray-400">Losses</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}