import logging
from typing import Dict, List
from fastapi import WebSocket, WebSocketDisconnect

logger = logging.getLogger("kitchora.websocket")

class ConnectionManager:
    def __init__(self):
        # order_id -> list of WebSockets
        self.active_order_connections: Dict[str, List[WebSocket]] = {}
        # kitchen_id -> list of WebSockets
        self.kitchen_connections: Dict[str, List[WebSocket]] = {}

    async def connect_order(self, websocket: WebSocket, order_id: str):
        await websocket.accept()
        if order_id not in self.active_order_connections:
            self.active_order_connections[order_id] = []
        self.active_order_connections[order_id].append(websocket)
        logger.info(f"WebSocket connected for Order ID: {order_id}")

    def disconnect_order(self, websocket: WebSocket, order_id: str):
        if order_id in self.active_order_connections:
            if websocket in self.active_order_connections[order_id]:
                self.active_order_connections[order_id].remove(websocket)
            if not self.active_order_connections[order_id]:
                del self.active_order_connections[order_id]
        logger.info(f"WebSocket disconnected for Order ID: {order_id}")

    async def broadcast_order_update(self, order_id: str, status: str, eta_mins: int = 25):
        payload = {
            "order_id": order_id,
            "status": status,
            "eta_mins": eta_mins,
            "timestamp": str(logging.Formatter().formatTime(logging.LogRecord("", 0, "", 0, "", (), None)))
        }
        if order_id in self.active_order_connections:
            disconnected = []
            for connection in self.active_order_connections[order_id]:
                try:
                    await connection.send_json(payload)
                except Exception as e:
                    logger.warning(f"Error sending WS message: {e}")
                    disconnected.append(connection)
            for dead in disconnected:
                self.disconnect_order(dead, order_id)

manager = ConnectionManager()
