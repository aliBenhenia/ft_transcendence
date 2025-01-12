"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import FetchProfile from "@/services/FetchProfile";
import { RootState } from "@/store/store";
import { updateProfile } from "@/store/slices/profileSlice";
import ProfileCard from "./profileCard";
import GameStats from "./GameStates";
import LastMatchesCard from "./LastMatchesCard";
import Achievements from "../components/ach";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const profileState = useSelector((state: RootState) => state.profile);

  const handleUpdateProfile = (data: Partial<RootState["profile"]>) => {
    dispatch(updateProfile(data));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const getProfileData = async () => {
      if (!token) return;
      
      try {
        const data = await FetchProfile(token);
        handleUpdateProfile(data.informations);
      } catch (err) {
        // $1.log("Failed to fetch profile data:", err);
      }
    };

    getProfileData();
  }, [dispatch]);

  return (
    <div className="py-12 px-6 w-full flex">
      <div className="w-full">
        <ProfileCard 
          avatar={profileState.picture} 
          first_name={profileState.full_name} 
          last_name={profileState.username} 
          level={profileState.level} 
        />
        
        <div className="flex gap-3 flex-col xs:flex-col">
          <GameStats 
            level={profileState.level} 
            loss={profileState.loss} 
            matches={profileState.total_match} 
            win={profileState.win} 
          />
          <LastMatchesCard userId={profileState?.id} />
        </div>
      </div>
      
      <Achievements />
    </div>
  );
};

export default Profile;
