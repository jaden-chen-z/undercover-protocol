// 页面6：投票统计页 - 按钮显著化重构
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { VerticalBars } from '../VerticalBars';
import { ActionCircle } from '../ActionCircle';
import type { GameState } from '../../types';

interface VotingPageProps {
  gameState: GameState;
  localPlayerId: string;
  onConfirmVotes: (votes: Record<string, number>) => void;
}

export const VotingPage: React.FC<VotingPageProps> = ({
  gameState,
  localPlayerId,
  onConfirmVotes
}) => {
  const isHost = gameState.hostId === localPlayerId;
  const alivePlayers = gameState.players.filter(p => p.alive);
  const [votes, setVotes] = useState<Record<string, number>>(
    alivePlayers.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {})
  );

  const maxAllowedVotes = alivePlayers.length;
  const currentTotalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);

  const handleIncrement = (playerId: string) => {
    if (currentTotalVotes >= maxAllowedVotes) return;
    
    setVotes(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  // const handleClear = () => {
  //   setVotes(alivePlayers.reduce((acc, p) => ({ ...acc, [p.id]: 0 }), {}));
  // };

  const handleConfirm = () => {
    onConfirmVotes(votes);
  };

  const maxVotes = Math.max(...Object.values(votes), 1);

  // Guest View
  if (!isHost) {
    return (
      <div style={{ 
        backgroundColor: COLORS.bgMain,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Space Mono, monospace'
      }}>
        <div style={{ fontSize: '3rem', fontWeight: '700', color: COLORS.textMain }}>投票中</div>
        <div style={{ marginTop: '1rem' }}>房主计票中...</div>
      </div>
    );
  }

  // Host View
  return (
    <div style={{ 
      backgroundColor: COLORS.bgMain,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Space Mono, monospace',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', textAlign: 'right', zIndex: 10 }}>
        <div style={{ fontSize: '0.75rem', color: COLORS.textMuted, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>房间号</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.textMain, lineHeight: 1 }}>{gameState.roomId}</div>
      </div>
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '1.25rem', color: COLORS.textMuted }}>计票 ({currentTotalVotes}/{maxAllowedVotes})</div>
          <div style={{ fontSize: '3rem', fontWeight: '700', color: COLORS.textMain }}>第{gameState.currentRound}轮</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {alivePlayers.map((player) => {
          const voteCount = votes[player.id] || 0;
          const isSelected = voteCount > 0;
          return (
            <div 
              key={player.id} 
              onClick={() => handleIncrement(player.id)}
              style={{ 
                display: 'flex', 
                height: '80px', 
                borderBottom: `1px solid ${COLORS.borderColor}`,
                backgroundColor: isSelected ? '#fff' : 'transparent',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              <div style={{ width: '80px', backgroundColor: isSelected ? COLORS.bgAccent : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#fff' : COLORS.textMuted, fontSize: '1.5rem', fontWeight: '700' }}>
                {voteCount > 0 ? voteCount : '+'}
              </div>
              <div style={{ flex: 1, padding: '0 1rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>{player.name.toUpperCase()}</div>
                <div style={{ height: '10px', width: '100%', marginTop: '0.5rem' }}>
                   <VerticalBars value={voteCount} max={Math.max(maxVotes, 5)} color={COLORS.textMain} height="h-full" />
                </div>
              </div>
              
              {voteCount > 0 && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setVotes(prev => ({ ...prev, [player.id]: 0 }));
                  }}
                  style={{
                    padding: '0 1.5rem',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: COLORS.textMuted,
                    textDecoration: 'underline',
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  重置
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ 
        height: '160px', 
        backgroundColor: COLORS.bgAccent, 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        opacity: currentTotalVotes === 0 ? 0.8 : 1 // Visual cue
      }}>
        <div style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1 }}>
          确认记票
        </div>
        <ActionCircle 
          onClick={handleConfirm} 
          size="xl"
          color="rgba(255,255,255,0.2)" 
          iconColor={COLORS.textLight} 
          disabled={currentTotalVotes === 0} // Prevent confirming with 0 votes? Optional.
        />
      </div>
    </div>
  );
};
