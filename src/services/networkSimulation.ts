import Peer, { DataConnection } from 'peerjs';
import type { GameState, NetworkMessage, Player } from '../types';

/**
 * PEERJS NETWORK LAYER
 * 
 * Replaces Simulated Network with real P2P networking.
 * Uses PeerJS public cloud.
 */

// Unique prefix to namespace room IDs on the public PeerServer
const ROOM_ID_PREFIX = 'ucgame_v1_';

class PeerNetworkService {
  private peer: Peer | null = null;
  private connections: Map<string, DataConnection> = new Map(); // Host: Guest Peer ID -> Connection
  private hostConnection: DataConnection | null = null; // Guest: Connection to Host
  private onMessageCallback: ((msg: NetworkMessage) => void) | null = null;
  private isHost: boolean = false;
  private currentRoomId: string | null = null;

  /**
   * Connect to the network.
   * @param roomId The room ID (e.g. "1234")
   * @param onMessage Callback for incoming messages
   * @param isHost Whether this client is the Host
   */
  connect(roomId: string, onMessage: (msg: NetworkMessage) => void, isHost: boolean = false) {
    // Prevent reconnecting if already connected to same room with same role
    if (this.peer && !this.peer.disconnected && !this.peer.destroyed && this.currentRoomId === roomId && this.isHost === isHost) {
        // Update callback even if already connected, as the callback reference might change
        this.onMessageCallback = onMessage;
        return;
    }

    this.close();
    this.currentRoomId = roomId;
    this.onMessageCallback = onMessage;
    this.isHost = isHost;

    const options = {
      debug: 1
    };

    if (isHost) {
        this.peer = new Peer(`${ROOM_ID_PREFIX}${roomId}`, options);
    } else {
        this.peer = new Peer(options);
    }

    this.peer.on('open', (id) => {
      console.log(`[Network] Connected to PeerServer. My ID: ${id}`);
      
      if (!this.isHost) {
        this.connectToHost(roomId);
      }
    });

    this.peer.on('connection', (conn) => {
      if (this.isHost) {
        console.log(`[Network] Incoming connection from ${conn.peer}`);
        this.handleIncomingConnection(conn);
      } else {
        // Guests generally don't accept incoming connections in this architecture,
        // but PeerJS is symmetric. If Host connects to Guest (unlikely here), handle it.
        conn.close();
      }
    });

    this.peer.on('error', (err: any) => {
      console.error('[Network] Peer error:', err);
      if (err.type === 'unavailable-id') {
        console.error('[Network] Room ID already taken. Someone else is hosting this room?');
        // Handle collision or notify user? 
        // For now, we just log. App might need UI for "Room Busy".
      }
    });

    this.peer.on('disconnected', () => {
        console.log('[Network] Peer disconnected from server.');
        // Auto-reconnect logic could go here
    });
  }

  private connectToHost(roomId: string) {
    if (!this.peer) return;
    const hostPeerId = `${ROOM_ID_PREFIX}${roomId}`;
    console.log(`[Network] Connecting to Host: ${hostPeerId}`);
    
    const conn = this.peer.connect(hostPeerId, {
        reliable: true
    });

    this.hostConnection = conn;
    this.setupConnection(conn);
  }

  private handleIncomingConnection(conn: DataConnection) {
    this.connections.set(conn.peer, conn);
    this.setupConnection(conn);
  }

  private setupConnection(conn: DataConnection) {
    conn.on('open', () => {
      console.log(`[Network] Connection opened: ${conn.peer}`);
      // If we are Guest, we might want to send a "HELLO" or just wait for JOIN to be sent manually.
    });

    conn.on('data', (data) => {
      // console.log(`[Network] Received data from ${conn.peer}:`, data);
      if (this.onMessageCallback) {
        this.onMessageCallback(data as NetworkMessage);
      }
    });

    conn.on('close', () => {
      console.log(`[Network] Connection closed: ${conn.peer}`);
      this.connections.delete(conn.peer);
      if (this.hostConnection === conn) {
        this.hostConnection = null;
      }
    });

    conn.on('error', (err) => {
      console.error(`[Network] Connection error with ${conn.peer}:`, err);
    });
  }

  // Called by Guest to tell Host "I'm here"
  joinRoom(roomId: string, player: Player) {
    // Retry until connected
    const attemptJoin = (attempts = 0) => {
        if (this.hostConnection && this.hostConnection.open) {
            this.hostConnection.send({ type: 'JOIN', payload: player, roomId });
        } else {
            if (attempts < 20) {
                setTimeout(() => attemptJoin(attempts + 1), 200);
            } else {
                console.error('[Network] Failed to send JOIN: Connection to host not ready.');
            }
        }
    };
    attemptJoin();
  }

  // Called by Host to broadcast "Here is the new game state"
  broadcastState(roomId: string, state: GameState) {
    if (!this.isHost) return;
    const msg: NetworkMessage = { type: 'SYNC_STATE', payload: state, roomId };
    this.connections.forEach(conn => {
      if (conn.open) conn.send(msg);
    });
  }

  // General broadcast
  broadcast(_roomId: string, message: NetworkMessage) {
    if (this.isHost) {
      // Host broadcasts to all guests
      this.connections.forEach(conn => {
        if (conn.open) conn.send(message);
      });
    } else {
      // Guest sends to Host
      if (this.hostConnection && this.hostConnection.open) {
        this.hostConnection.send(message);
      } else {
          console.warn('[Network] Cannot broadcast: Not connected to host');
      }
    }
  }

  close() {
    this.connections.forEach(conn => conn.close());
    this.connections.clear();
    
    if (this.hostConnection) {
        this.hostConnection.close();
        this.hostConnection = null;
    }
    
    if (this.peer) {
        this.peer.destroy();
        this.peer = null;
    }
    this.onMessageCallback = null;
    this.currentRoomId = null;
  }
}

export const network = new PeerNetworkService();
