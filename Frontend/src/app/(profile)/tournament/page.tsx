'use client'
import React, {useState} from 'react';
import RegistrationForm from '../components/game/TournamentForm';

function tournament() {
   
    return (
        <div className='max-w-4xl p-8 mx-auto space-y-8'>
            <RegistrationForm/>
        </div>
    );
}

export default tournament;


// const generatedMatches = generateMatches(players);
//     setMatches(generatedMatches);

//     // Redirect to the game with the first match's players
//     const firstMatch = generatedMatches[0];
//     router.push(
//       `/game/TournamentGame?player1=${encodeURIComponent(
//         JSON.stringify(firstMatch.player1)
//       )}&player2=${encodeURIComponent(JSON.stringify(firstMatch.player2))}`
//     );

