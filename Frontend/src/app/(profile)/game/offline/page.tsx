"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Ai from "../../components/game/OfflineGame";

const OfflineScreen = () => {

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
        <Ai/>
    </div>
  );
};

export default OfflineScreen;
