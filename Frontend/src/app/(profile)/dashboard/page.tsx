"use client";

import React,{useState} from 'react';
import ProfileCard from './components/profileCard';
import { useEffect } from 'react';
import FetchProfile from "@/services/FetchProfile";
import { RootState } from '@/store/store';
import { updateProfile } from "@/store/slices/profileSlice";
import { useSelector ,useDispatch} from 'react-redux';
import GameStats from '../profile/GameStates';
import LastMatchesCard from '../profile/LastMatchesCard';
import Achievements from '../components/ach';

const Dashboard = () => {
    const profileState = useSelector((state: RootState) => state.profile);
    const dispatch = useDispatch();
    useEffect(()=>{
        const token: string| null = localStorage.getItem("accessToken");  
        const getProfileData = async () => {
          if (token)
          {
            try {
              const data = await FetchProfile(token);
              dispatch(updateProfile(data.informations));
            } catch (err:any) {
              }
          };
        }
        getProfileData();
    },[])
    return (
        <div
        className="text-white text-4lg flex w-full h-screen"
        style={{
            padding: '10px',
            borderRadius: '10px',
            textAlign: 'center',
        }}
        >
               <div className='w-full '>
                <ProfileCard />
                <GameStats
                level={profileState.level}
                loss={profileState.loss}
                matches={profileState.total_match}
                win={profileState.win}
                last_match={profileState.last_match}
              />
                  <LastMatchesCard />
               </div>
                <Achievements />
    </div>
    );
};
export default Dashboard;