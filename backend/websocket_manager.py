import asyncio
import json
import logging
from typing import Set, Dict, Any
from starlette.websockets import WebSocket, WebSocketState

logger = logging.getLogger("MLVS.WebSocket")

class WebSocketManager:
    """
    Manages active WebSocket connections for real-time telemetry streaming to Control Room.
    """

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket client connected. Total active clients: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Total active clients: {len(self.active_connections)}")

    async def broadcast(self, payload: Dict[str, Any]):
        """Broadcasts telemetry packet to all connected clients."""
        if not self.active_connections:
            return

        message_str = json.dumps(payload)
        dead_sockets = set()

        for connection in list(self.active_connections):
            try:
                if connection.client_state == WebSocketState.CONNECTED:
                    await connection.send_text(message_str)
                else:
                    dead_sockets.add(connection)
            except Exception as e:
                logger.debug(f"Error sending to WebSocket client: {e}")
                dead_sockets.add(connection)

        for dead in dead_sockets:
            self.disconnect(dead)

ws_manager = WebSocketManager()
