export const createWebSocketConnection = (token: string | null, room_name : string | undefined): WebSocket => {
    if (!token) {
      throw new Error("Invalid token: WebSocket connection cannot be created");
    }
    const url = process.env.NEXT_PUBLIC_WS_URL || "localhost:9003";
    const query = room_name ? `token=${token}&room_name=${room_name}`:`token=${token}`;
    return new WebSocket(`${url}/pingpong/?${query}`);
  };