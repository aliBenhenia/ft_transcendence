export const createWebSocketConnection = (token: string | null): WebSocket => {
    if (!token) {
      throw new Error("Invalid token: WebSocket connection cannot be created");
    }
    const url = process.env.NEXT_PUBLIC_API_URL || "localhost:9003";
    return new WebSocket(`ws://${url.slice(7)}/ws/pingpong/?token=${token}`);
  };