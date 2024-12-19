export const createWebSocketConnection = (token: string | null): WebSocket => {
    if (!token) {
      throw new Error("Invalid token: WebSocket connection cannot be created");
    }
    return new WebSocket(`ws://127.0.0.1:9003/ws/pingpong/?token=${token}`);
  };