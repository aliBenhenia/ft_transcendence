import React from "react";
import GameCanvas from "../../components/game/GameCanvas";

const HomePage: React.FC = () => {
    return (
      <main className="h-screen flex items-center justify-center ">
        <GameCanvas />
      </main>
    );
  };
  
  export default HomePage;