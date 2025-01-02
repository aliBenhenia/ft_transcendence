export const createWebSocketConnection = (token: string | null, room_name : string | undefined): WebSocket => {
    if (!token) {
      throw new Error("Invalid token: WebSocket connection cannot be created");
    }
    const url = process.env.NEXT_PUBLIC_API_URL || "localhost:9003";
    const query = room_name ? `token=${token}&roon_name=${room_name}`:`token=${token}`;
    return new WebSocket(`ws://${url.slice(7)}/ws/pingpong/?${query}`);
  };