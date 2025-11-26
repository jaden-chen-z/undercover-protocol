import { useState, useEffect, useCallback, useRef } from 'react';
import { HomePage } from './components/pages/HomePage';
import { SetupPage } from './components/pages/SetupPage';
import { WaitingPage } from './components/pages/WaitingPage';
import { DealingPage } from './components/pages/DealingPage';
import { PlayingPage } from './components/pages/PlayingPage';
import { VotingPage } from './components/pages/VotingPage';
import { EliminationFeedbackPage } from './components/pages/EliminationFeedbackPage';
import { EndPage } from './components/pages/EndPage';
import { network } from './services/networkSimulation';
import type { GameState, Player, RoomConfig, NetworkMessage } from './types';
import { GamePhase, Winner } from './types';
import { generateId, generateRoomId, createInitialGameState, processVotes, checkWinner } from './services/gameService';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 移除本地 confirmedPlayers，改为从 gameState.confirmedPlayerIds 获取
  
  // 使用 Ref 保持最新的 gameState，解决闭包问题
  const gameStateRef = useRef<GameState | null>(null);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // 处理网络消息
  useEffect(() => {
    if (!gameState?.roomId) return;

    const handleMessage = (msg: NetworkMessage) => {
      if (msg.type === 'SYNC_STATE') {
        setGameState(msg.payload as GameState);
      } else if (msg.type === 'JOIN') {
        const newPlayer = msg.payload as Player;
        
        // 房主逻辑：决定新玩家的状态并广播
        const currentState = gameStateRef.current;
        const isHost = currentState?.hostId === localPlayerId;

        if (isHost && currentState) {
          if (currentState.players.some(p => p.id === newPlayer.id)) return;

          // 如果游戏正在进行中，新加入的玩家设为不活跃（观察者），直到下一轮
          const isGameRunning = currentState.phase !== GamePhase.WAITING && currentState.phase !== GamePhase.SETUP;
          const playerToAdd = isGameRunning ? { ...newPlayer, alive: false } : newPlayer;
          
          const newState = {
            ...currentState,
            players: [...currentState.players, playerToAdd]
          };
          
          // 房主更新自己并广播
          setGameState(newState);
          network.broadcastState(currentState.roomId, newState);
        } else {
          // 非房主逻辑：暂时先添加到本地，等待 SYNC_STATE 纠正
          setGameState(prevState => {
            if (!prevState) return null;
            if (prevState.players.some(p => p.id === newPlayer.id)) return prevState;
            
            // 即使是本地预测，也可以应用同样的规则
            const isGameRunning = prevState.phase !== GamePhase.WAITING && prevState.phase !== GamePhase.SETUP;
            const playerToAdd = isGameRunning ? { ...newPlayer, alive: false } : newPlayer;
            
            return {
              ...prevState,
              players: [...prevState.players, playerToAdd]
            };
          });
        }

      } else if (msg.type === 'REQUEST_CONFIRM') {
        const playerId = msg.payload as string;
        const currentState = gameStateRef.current;
        const isHost = currentState?.hostId === localPlayerId;
        
        // 只有房主能处理确认请求
        if (isHost && currentState) {
            // 避免重复添加
            if (currentState.confirmedPlayerIds && currentState.confirmedPlayerIds.includes(playerId)) return;
            
            const newConfirmed = [...(currentState.confirmedPlayerIds || []), playerId];
            const newState = {
                ...currentState,
                confirmedPlayerIds: newConfirmed
            };
            
            setGameState(newState);
            network.broadcastState(currentState.roomId, newState);
        }
      }
    };

    const isHost = gameState.hostId === localPlayerId;
    network.connect(gameState.roomId, handleMessage, isHost);
    return () => network.close();
  }, [gameState?.roomId, localPlayerId, gameState?.hostId]);

  // 创建房间
  const handleCreateRoom = useCallback(async (name: string) => {
    const playerId = generateId();
    const roomId = generateRoomId();
    setLocalPlayerId(playerId);

    const hostPlayer: Player = {
      id: playerId,
      name,
      role: 'CIVILIAN' as const,
      word: null,
      alive: true,
      avatarSeed: Math.floor(Math.random() * 1000),
      votes: 0,
      isHost: true,
      joinOrder: 1
    };

    const initialState: GameState = {
      phase: GamePhase.WAITING, // Start directly in WAITING
      roomId,
      hostId: playerId,
      config: {
        totalPlayers: 12, // Max capacity
        undercoverCount: 1,
        blankCount: 0
      },
      players: [hostPlayer],
      localPlayerId: playerId,
      currentRound: 1,
      topic: '',
      wordPair: { civilian: '', undercover: '' },
      lastVoteResult: null,
      winner: Winner.NONE,
      eliminatedPlayerName: null,
      confirmedPlayerIds: []
    };

    setGameState(initialState);
    // network.connect handled by useEffect
  }, []);

  // 加入房间
  const handleJoinRoom = useCallback((name: string, roomId: string) => {
    const playerId = generateId();
    setLocalPlayerId(playerId);

    const newPlayer: Player = {
      id: playerId,
      name,
      role: 'CIVILIAN' as const,
      word: null,
      alive: true,
      avatarSeed: Math.floor(Math.random() * 1000),
      votes: 0,
      isHost: false,
      joinOrder: Date.now()
    };

    // 如果房间不存在，创建临时状态等待同步
    if (!gameState || gameState.roomId !== roomId) {
      const tempState: GameState = {
        phase: GamePhase.WAITING,
        roomId,
        hostId: '',
        config: { totalPlayers: 6, undercoverCount: 1, blankCount: 0 },
        players: [newPlayer],
        localPlayerId: playerId,
        currentRound: 1,
        topic: '',
        wordPair: { civilian: '', undercover: '' },
        lastVoteResult: null,
        winner: Winner.NONE,
        eliminatedPlayerName: null,
        confirmedPlayerIds: []
      };
      setGameState(tempState);
    }

    // 关键修复：延迟发送 JOIN 消息，确保 setGameState 触发的 useEffect 已经建立了网络连接（network.connect）
    // 这样才能确保能收到房主回传的 SYNC_STATE 消息
    setTimeout(() => {
      network.joinRoom(roomId, newPlayer);
    }, 500);
  }, [gameState]);

  // 确认创建房间配置 (现在是从设置页直接发牌)
  const handleConfirmSetup = useCallback(async (config: RoomConfig) => {
    if (!gameState || !localPlayerId) return;

    setIsLoading(true);
    try {
      // 使用 SetupPage 确认的配置直接开始发牌
      const newState = await createInitialGameState(
        gameState.roomId,
        gameState.hostId,
        config,
        gameState.players
      );

      setGameState(newState);
      // confirmedPlayerIds 已经在 createInitialGameState 中重置为空
      network.broadcastState(gameState.roomId, newState);
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, localPlayerId]);

  // 开始发牌
  const handleStartDealing = useCallback(async () => {
    if (!gameState || !localPlayerId || gameState.hostId !== localPlayerId) return;
    // if (gameState.players.length !== gameState.config.totalPlayers) return; // 移除严格人数限制，允许当前人数开始

    setIsLoading(true);
    try {
      const newState = await createInitialGameState(
        gameState.roomId,
        gameState.hostId,
        gameState.config,
        gameState.players
      );

      setGameState(newState);
      network.broadcastState(gameState.roomId, newState);
    } catch (error) {
      console.error("Error starting game:", error);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, localPlayerId]);

  // 重新洗牌（房主专用）
  const handleShuffleWords = useCallback(async () => {
    if (!gameState || gameState.hostId !== localPlayerId) return;
    if (gameState.phase !== GamePhase.DEALING) return;

    // 重新生成词对并分配，保持角色配置不变
    try {
      const newState = await createInitialGameState(
        gameState.roomId,
        gameState.hostId,
        gameState.config,
        gameState.players.map(p => ({ ...p, word: null, role: 'CIVILIAN' })) // Reset roles before re-assigning
      );
      
      setGameState(newState);
      network.broadcastState(gameState.roomId, newState);
    } catch (error) {
      console.error("Error shuffling words:", error);
    }
  }, [gameState, localPlayerId]);

  // 记住身份
  const handleRemembered = useCallback(() => {
    if (!gameState || !localPlayerId) return;
    
    // 发送确认请求给房主
    network.broadcast(gameState.roomId, {
      type: 'REQUEST_CONFIRM',
      payload: localPlayerId,
      roomId: gameState.roomId
    });
    
    // 如果自己是房主，需要立刻处理（因为自己收不到自己广播的消息 - 取决于 networkSimulation 实现，通常需要手动处理）
    // 这里的 networkSimulation 在 connect 时会把自己加入 listeners，但 broadcast 时会发给所有 listeners 吗？
    // 检查 services/networkSimulation.ts:
    // broadcast(roomId, message) -> channel.postMessage(message). 
    // BroadcastChannel 不会把消息发给发送者自己。
    // 所以房主需要自己处理自己的请求。
    
    if (gameState.hostId === localPlayerId) {
        const newConfirmed = [...(gameState.confirmedPlayerIds || [])];
        if (!newConfirmed.includes(localPlayerId)) {
            newConfirmed.push(localPlayerId);
            const newState = {
                ...gameState,
                confirmedPlayerIds: newConfirmed
            };
            setGameState(newState);
            network.broadcastState(gameState.roomId, newState);
        }
    }

  }, [gameState, localPlayerId]);

  // 开始游戏
  const handleStartGame = useCallback(() => {
    if (!gameState || gameState.hostId !== localPlayerId) return;

    const updatedState: GameState = {
      ...gameState,
      phase: GamePhase.PLAYING
    };
    setGameState(updatedState);
    network.broadcastState(gameState.roomId, updatedState);
  }, [gameState, localPlayerId]);

  // 自动开始游戏监听 (放在 handleStartGame 定义之后)
  useEffect(() => {
    if (!gameState || !localPlayerId) return;
    // 仅房主负责触发状态变更
    if (gameState.hostId !== localPlayerId) return;
    // 仅在发牌阶段检测
    if (gameState.phase !== GamePhase.DEALING) return;

    // 检查是否所有人都已确认
    // 参与本局游戏的玩家才需要确认
    // 我们的 assignRolesAndWords 逻辑是对所有 players 进行分配
    // 所以 totalPlayers 就是 gameState.players.length
    
    const totalPlayers = gameState.players.length;
    const confirmedCount = gameState.confirmedPlayerIds?.length || 0;

    // 只有当确实有玩家且全部确认时才触发
    if (totalPlayers > 0 && confirmedCount >= totalPlayers) {
      // 稍微延迟一下，让UI展示一下“所有人已准备”的状态，体验更好
      const timer = setTimeout(() => {
        handleStartGame();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState, localPlayerId, handleStartGame]); // 依赖项不再需要 confirmedPlayers 状态

  // 开始投票
  const handleStartVoting = useCallback(() => {
    if (!gameState || gameState.hostId !== localPlayerId) return;

    const updatedState: GameState = {
      ...gameState,
      phase: GamePhase.VOTING
    };
    setGameState(updatedState);
    network.broadcastState(gameState.roomId, updatedState);
  }, [gameState, localPlayerId]);

  // 确认投票
  const handleConfirmVotes = useCallback((votes: Record<string, number>) => {
    if (!gameState || gameState.hostId !== localPlayerId) return;

    const voteResult = processVotes(votes, gameState.players, gameState.currentRound);
    let updatedPlayers = [...gameState.players];

    // 如果有人出局，更新状态
    if (voteResult.eliminatedPlayerId) {
      updatedPlayers = updatedPlayers.map(p => 
        p.id === voteResult.eliminatedPlayerId 
          ? { ...p, alive: false, eliminatedRound: gameState.currentRound }
          : p
      );
    }

    // 检查胜负
    const winner = checkWinner(updatedPlayers);
    const nextPhase = winner !== Winner.NONE 
      ? GamePhase.ENDED 
      : GamePhase.ELIMINATION_FEEDBACK;

    const updatedState: GameState = {
      ...gameState,
      players: updatedPlayers,
      lastVoteResult: voteResult,
      phase: nextPhase,
      winner,
      eliminatedPlayerName: voteResult.eliminatedPlayerId 
        ? updatedPlayers.find(p => p.id === voteResult.eliminatedPlayerId)?.name || null
        : null
    };

    setGameState(updatedState);
    network.broadcastState(gameState.roomId, updatedState);
  }, [gameState, localPlayerId]);

  // 继续下一轮
  const handleContinue = useCallback(() => {
    if (!gameState || gameState.hostId !== localPlayerId) return;

    const updatedState: GameState = {
      ...gameState,
      phase: GamePhase.PLAYING,
      currentRound: gameState.currentRound + 1
    };
    setGameState(updatedState);
    network.broadcastState(gameState.roomId, updatedState);
  }, [gameState, localPlayerId]);

  // 新游戏
  const handleNewGame = useCallback(() => {
    if (!gameState || gameState.hostId !== localPlayerId) return;

    const updatedState: GameState = {
      ...gameState,
      phase: GamePhase.SETUP,
      currentRound: 1,
      players: gameState.players.map(p => ({
        ...p,
        role: 'CIVILIAN',
        word: null,
        alive: true,
        votes: 0,
        eliminatedRound: undefined
      })),
      winner: Winner.NONE,
      lastVoteResult: null,
      eliminatedPlayerName: null,
      confirmedPlayerIds: [] // Reset confirmed list
    };
    setGameState(updatedState);
    network.broadcastState(gameState.roomId, updatedState);
  }, [gameState, localPlayerId]);

  // 退出/离开房间
  const handleLeaveRoom = useCallback(() => {
    network.close();
    setGameState(null);
    setLocalPlayerId(null);
  }, []);

  // 修改设置
  const handleModifySettings = useCallback(() => {
    if (!gameState || gameState.hostId !== localPlayerId) return;

    const updatedState: GameState = {
      ...gameState,
      phase: GamePhase.SETUP
    };
    setGameState(updatedState);
  }, [gameState, localPlayerId]);

  // 渲染当前页面
  if (!gameState || !localPlayerId) {
    return <HomePage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }

  // Check for mid-game joiners (Observers)
  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  
  const isMidGame = (
    gameState.phase === GamePhase.DEALING || 
    gameState.phase === GamePhase.PLAYING || 
    gameState.phase === GamePhase.VOTING || 
    gameState.phase === GamePhase.ELIMINATION_FEEDBACK || 
    gameState.phase === GamePhase.ENDED
  );
  
  // Observer condition: Game is running AND player has no word (and is not BLANK role)
  // Default new players are CIVILIAN with null word
  const isObserver = isMidGame && localPlayer?.role === 'CIVILIAN' && localPlayer?.word === null;

  if (isObserver) {
    return (
      <WaitingPage
        gameState={gameState}
        localPlayerId={localPlayerId}
        onStartDealing={() => {}}
        onModifySettings={() => {}}
        onLeaveRoom={handleLeaveRoom}
        isLoading={isLoading}
      />
    );
  }

  switch (gameState.phase) {
    case GamePhase.SETUP:
      // 只有房主能看到设置页
      if (gameState.hostId === localPlayerId) {
        return (
          <SetupPage
            roomId={gameState.roomId}
            onConfirm={handleConfirmSetup}
            onCancel={() => {
              const updatedState: GameState = { ...gameState, phase: GamePhase.WAITING };
              setGameState(updatedState);
              network.broadcastState(gameState.roomId, updatedState);
            }}
          fixedTotalPlayers={gameState.players.length} // Lock player count to current
          confirmText="开始发牌" // Button says DEAL
        />
        );
      } else {
        // 非房主显示等待页
        return (
          <WaitingPage
            gameState={gameState}
            localPlayerId={localPlayerId}
            onStartDealing={() => {}}
            onModifySettings={() => {}}
            onLeaveRoom={handleLeaveRoom}
            isLoading={isLoading}
          />
        );
      }

    case GamePhase.WAITING:
      return (
        <WaitingPage
          gameState={gameState}
          localPlayerId={localPlayerId}
          onStartDealing={handleStartDealing}
          onModifySettings={handleModifySettings}
          onLeaveRoom={handleLeaveRoom}
          isLoading={isLoading}
        />
      );

    case GamePhase.DEALING:
      return (
        <DealingPage
          gameState={gameState}
          localPlayerId={localPlayerId}
          onRemembered={handleRemembered}
          onStartGame={handleStartGame}
          onShuffleWords={handleShuffleWords} // Add this
          confirmedCount={gameState.confirmedPlayerIds?.length || 0} // Use global count
        />
      );

    case GamePhase.PLAYING:
      return (
        <PlayingPage
          gameState={gameState}
          localPlayerId={localPlayerId}
          onStartVoting={handleStartVoting}
        />
      );

    case GamePhase.VOTING:
      return (
        <VotingPage
          gameState={gameState}
          localPlayerId={localPlayerId}
          onConfirmVotes={handleConfirmVotes}
        />
      );

    case GamePhase.ELIMINATION_FEEDBACK:
      return (
        <EliminationFeedbackPage
          gameState={gameState}
          onContinue={handleContinue}
        />
      );

    case GamePhase.ENDED:
  return (
        <EndPage
          gameState={gameState}
          localPlayerId={localPlayerId}
          onNewGame={handleNewGame}
          onLeaveRoom={handleLeaveRoom}
        />
      );

    default:
      return <HomePage onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} />;
  }
}

export default App;
