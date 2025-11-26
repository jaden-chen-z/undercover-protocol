import type { GameState, NetworkMessage, Player } from '../types';

/**
 * SIMULATED NETWORK LAYER
 * 
 * In a real production app, this would be replaced by Socket.io, Firebase, or PartyKit.
 * Currently, it uses the BroadcastChannel API.
 * 
 * CAPABILITY:
 * - Works between TABS in the same browser.
 * - Does NOT work across different devices (Phone A <-> Phone B) without a real server.
 */

class NetworkSimulation {
  private channel: BroadcastChannel | null = null;
  private onMessageCallback: ((msg: NetworkMessage) => void) | null = null;

  connect(roomId: string, onMessage: (msg: NetworkMessage) => void) {
    if (this.channel) {
      this.channel.close();
    }
    this.channel = new BroadcastChannel(`undercover_room_${roomId}`);
    this.onMessageCallback = onMessage;
    
    this.channel.onmessage = (event) => {
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data as NetworkMessage);
      }
    };
  }

  // Called by Guest to tell Host "I'm here"
  joinRoom(roomId: string, player: Player) {
    const tempChannel = new BroadcastChannel(`undercover_room_${roomId}`);
    tempChannel.postMessage({ type: 'JOIN', payload: player, roomId });
    tempChannel.close();
  }

  // Called by Host to broadcast "Here is the new game state"
  broadcastState(roomId: string, state: GameState) {
    if (!this.channel) return;
    this.channel.postMessage({ type: 'SYNC_STATE', payload: state, roomId });
  }

  // General broadcast for other events
  broadcast(roomId: string, message: NetworkMessage) {
    if (!this.channel) {
      // Fallback if channel isn't open (shouldn't happen if connected)
      const tempChannel = new BroadcastChannel(`undercover_room_${roomId}`);
      tempChannel.postMessage(message);
      tempChannel.close();
      return;
    }
    this.channel.postMessage(message);
  }

  close() {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

export const network = new NetworkSimulation();// 网络模拟服务

