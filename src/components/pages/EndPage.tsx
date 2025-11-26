// 页面8：结算页 - 按钮显著化重构
import React from 'react';
import { COLORS } from '../../constants';
import { X } from 'lucide-react';
import { ActionCircle } from '../ActionCircle';
import type { GameState, Role } from '../../types';
import { Role as RoleConst, Winner } from '../../types';

interface EndPageProps {
  gameState: GameState;
  localPlayerId: string;
  onNewGame: () => void;
  onLeaveRoom: () => void;
}

export const EndPage: React.FC<EndPageProps> = ({
  gameState,
  localPlayerId,
  onNewGame,
  onLeaveRoom
}) => {
  const isHost = gameState.hostId === localPlayerId;
  const isCiviliansWin = gameState.winner === Winner.CIVILIANS;

  const getRoleText = (role: Role): string => {
    if (role === RoleConst.CIVILIAN) return '平民';
    if (role === RoleConst.UNDERCOVER) return '卧底';
    return '白板';
  };

  const sortedPlayers = [...gameState.players]
    .filter(p => !(p.role === RoleConst.CIVILIAN && p.word === null && !p.alive)) // 过滤掉未参与本局游戏的观察者
    .sort((a, b) => {
      // 定义角色优先级：平民 (1) > 卧底 (2) > 白板 (3)
      const rolePriority = {
        [RoleConst.CIVILIAN]: 1,
        [RoleConst.UNDERCOVER]: 2,
        [RoleConst.BLANK]: 3
      };
      const priorityA = rolePriority[a.role] || 99;
      const priorityB = rolePriority[b.role] || 99;

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // 如果角色相同，按加入顺序排
      return a.joinOrder - b.joinOrder;
    });

  return (
    <div className="page-container" style={{ 
      backgroundColor: COLORS.bgMain,
      height: '100dvh'
    }}>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', textAlign: 'right', zIndex: 10 }}>
        <div style={{ fontSize: '0.75rem', color: isCiviliansWin ? COLORS.textMuted : 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>房间号</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: isCiviliansWin ? COLORS.textMain : COLORS.textLight, lineHeight: 1 }}>{gameState.roomId}</div>
      </div>
      <div style={{ 
        padding: '2rem', 
        backgroundColor: isCiviliansWin ? COLORS.bgMain : COLORS.bgDark,
        color: isCiviliansWin ? COLORS.textMain : COLORS.textLight,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        flexShrink: 0
      }}>
        <div style={{ fontSize: '1.25rem', opacity: 0.6, marginBottom: '0.5rem' }}>任务结算</div>
        <div style={{ fontSize: '3.5rem', fontWeight: '700', lineHeight: 0.9 }}>
          {isCiviliansWin ? '平民\n获胜' : '卧底\n获胜'}
        </div>
      </div>

      <div className="scrollable-content">
        {sortedPlayers.map((player) => (
          <div key={player.id} style={{ 
            padding: '1rem 2rem', 
            borderBottom: `1px solid ${COLORS.borderColor}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.textMain, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {player.name.toUpperCase()}
                {!player.alive && <X color="#ef4444" size={28} strokeWidth={3} />}
              </div>
              <div style={{ fontSize: '1.25rem', color: COLORS.bgAccent }}>{getRoleText(player.role)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', color: COLORS.textMain }}>{player.word || '无词'}</div>
              <div style={{ fontSize: '1.25rem', color: COLORS.textMuted }}>{player.alive ? '存活' : `第${player.eliminatedRound}轮淘汰`}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        height: '160px', 
        backgroundColor: COLORS.bgAccent, 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexShrink: 0
      }}>
        <button onClick={onLeaveRoom} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'rgba(255,255,255,0.6)', fontSize: '1.5rem' }}>
          {isHost ? '解散房间' : '退出房间'}
        </button>

        {isHost && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: COLORS.textLight }}>再来一局</span>
            <ActionCircle 
              onClick={onNewGame} 
              size="xl"
              color="rgba(255,255,255,0.2)" 
              iconColor={COLORS.textLight} 
            />
          </div>
        )}
      </div>
    </div>
  );
};
