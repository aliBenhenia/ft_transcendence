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