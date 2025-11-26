// 类型定义文件

// 使用 const 对象替代 enum（因为 erasableSyntaxOnly 不允许 enum）
export const GamePhase = {
  HOME: 'HOME',
  SETUP: 'SETUP',
  WAITING: 'WAITING',
  DEALING: 'DEALING',
  PLAYING: 'PLAYING',
  VOTING: 'VOTING',
  ELIMINATION_FEEDBACK: 'ELIMINATION_FEEDBACK',
  ENDED: 'ENDED'
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];

export const Role = {
  CIVILIAN: 'CIVILIAN',
  UNDERCOVER: 'UNDERCOVER',
  BLANK: 'BLANK'
} as const;

export type Role = typeof Role[keyof typeof Role];

export const Winner = {
  NONE: 'none',
  CIVILIANS: 'civilians',
  UNDERCOVERS: 'undercovers'
} as const;

export type Winner = typeof Winner[keyof typeof Winner];

export interface Player {
  id: string;
  name: string;
  role: Role;
  word: string | null;
  alive: boolean;
  avatarSeed: number; 
  votes: number;
  isHost: boolean;
  joinOrder: number;
  eliminatedRound?: number; // 出局轮次
}

export interface RoomConfig {
  totalPlayers: number;
  undercoverCount: number;
  blankCount: number; // 白板人数
}

export interface WordPairData {
  topic: string;
  words: {
    civilian: string;
    undercover: string;
  };
}

export interface NetworkMessage {
  type: 'JOIN' | 'SYNC_STATE' | 'START_DEALING' | 'START_VOTING' | 'SUBMIT_VOTES' | 'NEXT_ROUND' | 'CONFIRM_IDENTITY' | 'REQUEST_CONFIRM';
  payload: Player | GameState | any;
  roomId: string;
}

export interface VoteResult {
  round: number;
  votes: Record<string, number>; // playerId -> vote count
  eliminatedPlayerId: string | null;
  isTie: boolean;
}

export interface GameState {
  phase: GamePhase;
  roomId: string;
  hostId: string;
  config: RoomConfig;
  players: Player[];
  localPlayerId: string | null;
  currentRound: number;
  topic: string;
  wordPair: {
    civilian: string;
    undercover: string;
  };
  lastVoteResult: VoteResult | null;
  winner: Winner;
  eliminatedPlayerName: string | null; // 当前被淘汰的玩家名字
  confirmedPlayerIds: string[]; // 已确认身份的玩家ID列表
}
