// 页面5：对局进行中页 - 按钮显著化重构
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { ActionCircle } from '../ActionCircle';
import type { GameState, Role } from '../../types';
import { Role as RoleConst } from '../../types';

interface PlayingPageProps {
  gameState: GameState;
  localPlayerId: string;
  onStartVoting: () => void;
}

export const PlayingPage: React.FC<PlayingPageProps> = ({
  gameState,
  localPlayerId,
  onStartVoting
}) => {
  const [showIdentity, setShowIdentity] = useState(false);
  const isHost = gameState.hostId === localPlayerId;

  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  
  if (!localPlayer) {
    return (
      <div style={{ 
        backgroundColor: COLORS.bgMain, 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: COLORS.textMain,
        fontFamily: 'Space Mono, monospace'
      }}>
        <div>ERROR: PLAYER NOT FOUND</div>
        <button onClick={() => window.location.reload()} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: COLORS.bgDark, color: COLORS.textLight, border: 'none' }}>
          REFRESH
        </button>
      </div>
    );
  }

  const alivePlayers = gameState.players.filter(p => p.alive);
  // Filter out observers (who are not alive, but have no word) from the eliminated list
  const eliminatedPlayers = gameState.players.filter(p => 
    !p.alive && !(p.role === 'CIVILIAN' && p.word === null)
  );

  const getRoleText = (role: Role): string => {
    if (role === RoleConst.CIVILIAN) return '平民';
    if (role === RoleConst.UNDERCOVER) return '卧底';
    return '白板';
  };

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
      <div style={{ padding: '2rem' }}>
        <div style={{ fontSize: '1.25rem', color: COLORS.textMuted }}>状态</div>
        <div style={{ fontSize: '3rem', fontWeight: '700', color: COLORS.textMain }}>
          第{gameState.currentRound}轮
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {alivePlayers.map((player) => (
          <div key={player.id} style={{ 
            display: 'flex', 
            height: '60px', 
            borderBottom: `1px solid ${COLORS.borderColor}`,
            alignItems: 'center'
          }}>
            <div style={{ width: '60px', height: '100%', backgroundColor: COLORS.textMain, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#fff' }} />
            </div>
            <div style={{ paddingLeft: '1rem', fontSize: '1.25rem', fontWeight: '700', color: COLORS.textMain }}>
              {player.name.toUpperCase()}
            </div>
          </div>
        ))}
        {eliminatedPlayers.map((player) => (
          <div key={player.id} style={{ 
            display: 'flex', 
            height: '60px', 
            borderBottom: `1px solid ${COLORS.borderColor}`,
            alignItems: 'center',
            opacity: 0.4
          }}>
            <div style={{ width: '60px', height: '100%', backgroundColor: '#ccc' }} />
            <div style={{ paddingLeft: '1rem', fontSize: '1.25rem', textDecoration: 'line-through' }}>
              {player.name.toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Action Bar */}
      <div style={{ 
        height: showIdentity ? '200px' : '160px', 
        backgroundColor: showIdentity ? COLORS.bgAccent : COLORS.bgDark, 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        transition: 'all 0.3s ease'
      }}>
        <div>
          {showIdentity ? (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>我的身份</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.textLight }}>{getRoleText(localPlayer.role)}</div>
              <div style={{ fontSize: '1.5rem', color: COLORS.textLight }}>{localPlayer.word}</div>
            </div>
          ) : (
            <div style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1 }}>
              {isHost ? '开始投票' : '等待投票'}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => setShowIdentity(!showIdentity)} style={{ width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', background: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            👁
          </button>
          {isHost && (
            <ActionCircle 
              onClick={onStartVoting} 
              size="xl"
              color={showIdentity ? '#fff' : COLORS.bgAccent} 
              iconColor={showIdentity ? COLORS.bgAccent : COLORS.textLight} 
            />
          )}
        </div>
      </div>
    </div>
  );
};
