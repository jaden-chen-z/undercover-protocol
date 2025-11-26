// 游戏逻辑服务
import type { GameState, Player, RoomConfig, VoteResult, Winner } from '../types';
import { Role as RoleConst, Winner as WinnerConst, GamePhase } from '../types';
import { generateWordPair } from './geminiService';

// 生成唯一ID
export const generateId = (): string => {
  return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// 生成房间号（4位数字）
export const generateRoomId = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// 验证房间配置
export const validateRoomConfig = (config: RoomConfig): { valid: boolean; error?: string } => {
  const { totalPlayers, undercoverCount, blankCount } = config;
  const civilianCount = totalPlayers - undercoverCount - blankCount;

  if (totalPlayers < 2 || totalPlayers > 12) {
    return { valid: false, error: '总人数必须在 2-12 人之间' };
  }
  if (undercoverCount < 1) {
    return { valid: false, error: '卧底人数至少为 1' };
  }
  if (blankCount < 0) {
    return { valid: false, error: '白板人数不能为负数' };
  }
  if (civilianCount < 1) {
    return { valid: false, error: '至少要有 1 个平民' };
  }

  return { valid: true };
};

// 分配身份和词语
export const assignRolesAndWords = async (
  players: Player[],
  config: RoomConfig,
  wordPair: { civilian: string; undercover: string }
): Promise<Player[]> => {
  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const assigned: Player[] = [];

  // 分配卧底
  for (let i = 0; i < config.undercoverCount; i++) {
    assigned.push({
      ...shuffled[i],
      role: RoleConst.UNDERCOVER,
      word: wordPair.undercover
    });
  }

  // 分配白板
  for (let i = config.undercoverCount; i < config.undercoverCount + config.blankCount; i++) {
    assigned.push({
      ...shuffled[i],
      role: RoleConst.BLANK,
      word: null
    });
  }

  // 剩余为平民
  for (let i = config.undercoverCount + config.blankCount; i < shuffled.length; i++) {
    assigned.push({
      ...shuffled[i],
      role: RoleConst.CIVILIAN,
      word: wordPair.civilian
    });
  }

  return assigned;
};

// 计算存活人数
export const calculateAliveCounts = (players: Player[]): {
  civilianAlive: number;
  undercoverAlive: number;
  blankAlive: number;
} => {
  return {
    civilianAlive: players.filter(p => p.alive && p.role === RoleConst.CIVILIAN).length,
    undercoverAlive: players.filter(p => p.alive && p.role === RoleConst.UNDERCOVER).length,
    blankAlive: players.filter(p => p.alive && p.role === RoleConst.BLANK).length
  };
};

// 判断胜负
export const checkWinner = (players: Player[]): Winner => {
  const { civilianAlive, undercoverAlive } = calculateAliveCounts(players);

  if (undercoverAlive === 0) {
    return WinnerConst.CIVILIANS;
  }
  if (undercoverAlive >= civilianAlive) {
    return WinnerConst.UNDERCOVERS;
  }

  return WinnerConst.NONE;
};

// 处理投票结果
export const processVotes = (
  votes: Record<string, number>,
  players: Player[],
  currentRound: number
): VoteResult => {
  const alivePlayers = players.filter(p => p.alive);
  const maxVotes = Math.max(...Object.values(votes), 0);
  const topVoted = alivePlayers.filter(p => votes[p.id] === maxVotes);

  if (topVoted.length > 1) {
    // 平票
    return {
      round: currentRound,
      votes,
      eliminatedPlayerId: null,
      isTie: true
    };
  }

  // 有人被淘汰
  const eliminated = topVoted[0];
  return {
    round: currentRound,
    votes,
    eliminatedPlayerId: eliminated.id,
    isTie: false
  };
};

// 创建初始游戏状态
export const createInitialGameState = async (
  roomId: string,
  hostId: string,
  config: RoomConfig,
  players: Player[]
): Promise<GameState> => {
  const wordPairData = await generateWordPair();
  const assignedPlayers = await assignRolesAndWords(players, config, wordPairData.words);

  return {
    phase: GamePhase.DEALING,
    roomId,
    hostId,
    config,
    players: assignedPlayers,
    localPlayerId: null,
    currentRound: 1,
    topic: wordPairData.topic,
    wordPair: wordPairData.words,
    lastVoteResult: null,
    winner: WinnerConst.NONE,
    eliminatedPlayerName: null,
    confirmedPlayerIds: [] // 初始化确认列表
  };
};

