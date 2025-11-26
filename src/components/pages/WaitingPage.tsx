// 页面3：房间等待页 - 按钮显著化重构
import React from 'react';
import { COLORS } from '../../constants';
import { DigitalNumber } from '../DigitalNumber';
import { ActionCircle } from '../ActionCircle';
import { GamePhase } from '../../types';
import type { GameState } from '../../types';

interface WaitingPageProps {
  gameState: GameState;
  localPlayerId: string;
  onStartDealing?: () => void;
  onModifySettings: () => void;
  onLeaveRoom: () => void;
  isLoading?: boolean;
}

export const WaitingPage: React.FC<WaitingPageProps> = ({
  gameState,
  localPlayerId,
  onModifySettings,
  onLeaveRoom,
  isLoading = false
}) => {
  const isHost = gameState.hostId === localPlayerId;
  const currentCount = gameState.players.length;
  // 不再使用预设的 totalPlayers 作为限制，而是作为最大容量显示
  const maxCapacity = 12; 
  const canStart = currentCount >= 2; // 至少2人即可开始配置
  
  const isGameRunning = (
    gameState.phase === GamePhase.DEALING || 
    gameState.phase === GamePhase.PLAYING || 
    gameState.phase === GamePhase.VOTING || 
    gameState.phase === GamePhase.ELIMINATION_FEEDBACK ||
    gameState.phase === GamePhase.ENDED
  );

  const slots = Array.from({ length: maxCapacity }).map((_, i) => {
    if (i < gameState.players.length) {
      // Ensure host is always first in display logic if needed, 
      // but usually players array order determines this.
      // Let's explicitly sort players to put host first.
      const sortedPlayers = [...gameState.players].sort((a, b) => {
        if (a.isHost) return -1;
        if (b.isHost) return 1;
        return a.joinOrder - b.joinOrder;
      });
      return sortedPlayers[i];
    }
    return null;
  });

  return (
    <div style={{ 
      backgroundColor: COLORS.bgMain,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Space Mono, monospace',
      overflow: 'hidden'
    }}>
      {/* Top Info */}
      <div style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '1.25rem', color: COLORS.textMuted }}>房间号</div>
          {isHost && (
            <button 
              onClick={onLeaveRoom}
              style={{
                fontSize: '1.25rem',
                color: COLORS.textMuted,
                background: 'transparent',
                border: `1px solid ${COLORS.textMuted}`,
                padding: '0.25rem 0.75rem',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              解散
            </button>
          )}
        </div>
        <DigitalNumber value={gameState.roomId} size="xl" color={COLORS.textMain} showDecimal={false} />
        <div style={{ marginTop: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>
          {currentCount}人 已加入 (上限 {maxCapacity}人)
        </div>
      </div>

      {/* Player List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {slots.map((player, i) => {
          // Calculate gradient opacity: starts at 1.0, decreases by 0.06 per step
          const opacity = Math.max(0.2, 1.0 - (i * 0.06));
          let blockColor = player ? `rgba(93, 99, 91, ${opacity})` : 'transparent';
          
          // Override for Host: use Accent color
          if (player?.isHost) {
            blockColor = COLORS.bgAccent;
          }
          
          return (
            <div key={i} style={{ 
              display: 'flex', 
              height: '60px',
              borderBottom: `1px solid ${COLORS.borderColor}`,
              opacity: player ? 1 : 0.5
            }}>
              {/* Left Indicator Block */}
              <div style={{ 
                width: '60px', 
                backgroundColor: blockColor, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: player ? COLORS.textLight : COLORS.textMuted
              }}>
                {(i + 1).toString().padStart(2, '0')}
              </div>
              
              {/* Content */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: COLORS.textMain }}>
                  {player ? player.name.toUpperCase() : '等待中...'}
                </span>
                {player?.isHost && (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    width: 'fit-content'
                  }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: COLORS.bgAccent }}>房主</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      {isHost ? (
        <div style={{ 
          height: '160px', 
          backgroundColor: canStart ? COLORS.bgAccent : COLORS.bgDark, 
          padding: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          transition: 'background-color 0.3s'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1 }}>
              {isLoading ? '数据生成中...' : (canStart ? '开始发牌' : '等待玩家')}
            </div>
            {!isLoading && canStart && (
              <div style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '1rem' }}>
                {currentCount} 人已准备
              </div>
            )}
          </div>
          <ActionCircle 
            onClick={onModifySettings} // Change: Clicking big button now goes to Setup
            disabled={!canStart || isLoading}
            size="xl"
            color="rgba(255,255,255,0.2)"
            iconColor={COLORS.textLight}
            label="设置"
          />
        </div>
      ) : isGameRunning ? (
        <div style={{ padding: '2rem', backgroundColor: COLORS.bgAccent, color: COLORS.textLight, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '160px' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', lineHeight: 1.1 }}>游戏进行中</div>
          <div style={{ marginTop: '0.5rem', fontSize: '1.125rem', opacity: 0.8 }}>等待下一轮...</div>
          <button onClick={onLeaveRoom} style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem', color: '#fff', marginTop: '1rem', fontSize: '1rem' }}>退出</button>
        </div>
      ) : (
        <div style={{ padding: '2rem', backgroundColor: COLORS.bgDark, color: COLORS.textLight, display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '160px' }}>
          <div style={{ fontSize: '2rem', fontWeight: '700' }}>等待房主开始...</div>
          <button onClick={onLeaveRoom} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem', color: '#fff', fontSize: '1rem' }}>退出</button>
        </div>
      )}
    </div>
  );
};
