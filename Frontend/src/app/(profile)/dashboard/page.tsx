"use client";

import React, { useEffect } from "react";
import ProfileCard from "./components/profileCard";
import FetchProfile from "@/services/FetchProfile";
import { RootState } from "@/store/store";
import { updateProfile } from "@/store/slices/profileSlice";
import { useSelector, useDispatch } from "react-redux";
import GameStats from "../profile/GameStates";
import LastMatchesCard from "../profile/LastMatchesCard";
import Achievements from "../components/ach";

const Dashboard = (): JSX.Element => {
  const profileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Environment Mode:", process.env.NODE_ENV);

    const token: string | null = localStorage.getItem("accessToken");

    const getProfileData = async () => {
      if (token) {
        try {
          const data = await FetchProfile(token);
          if (data?.informations) {
            dispatch(updateProfile(data.informations));
          } else {
            console.error("No profile data returned");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      } else {
        console.warn("No access token found in localStorage");
      }
    };

    getProfileData();
  }, [dispatch]);

  if (!profileState) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p>Loading profile data...</p>
      </div>
    );
  }

  return (
    <div
      className="text-white text-4lg flex w-full h-screen"
      style={{
        padding: "10px",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <div className="w-full">
        <ProfileCard />
        <GameStats
          level={profileState.level}
          loss={profileState.loss}
          matches={profileState.total_match}
          win={profileState.win}
          last_match={profileState.last_match}
        />
        {/* {profileState?.id && <LastMatchesCard userId={profileState.id} />} */}
      </div>
      <Achievements />
    </div>
  );
};

export default Dashboard;
