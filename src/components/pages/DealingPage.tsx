// 页面4：发身份页 - 按钮显著化重构
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { ActionCircle } from '../ActionCircle';
import type { GameState, Role } from '../../types';
import { Role as RoleConst } from '../../types';
import { Scan } from 'lucide-react';

interface DealingPageProps {
  gameState: GameState;
  localPlayerId: string;
  onRemembered: () => void;
  onStartGame: () => void;
  onShuffleWords: () => void; // Add this
  confirmedCount: number;
}

export const DealingPage: React.FC<DealingPageProps> = ({
  gameState,
  localPlayerId,
  onRemembered,
  onStartGame,
  onShuffleWords, // Add this
  confirmedCount
}) => {
  const [showIdentity, setShowIdentity] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const isHost = gameState.hostId === localPlayerId;

  const localPlayer = gameState.players.find(p => p.id === localPlayerId);
  if (!localPlayer) return null;

  const totalPlayers = gameState.config.totalPlayers;

  const getRoleText = (role: Role): string => {
    if (role === RoleConst.CIVILIAN) return '平民';
    if (role === RoleConst.UNDERCOVER) return '卧底';
    return '白板';
  };

  const handleRemembered = () => {
    setConfirmed(true);
    // 不收起卡片
    // setShowIdentity(false);
    onRemembered();
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
        <div style={{ fontSize: '0.75rem', color: showIdentity ? 'rgba(255,255,255,0.6)' : COLORS.textMuted, letterSpacing: '0.1em', marginBottom: '0.25rem' }}>房间号</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: showIdentity ? COLORS.textLight : COLORS.textMain, lineHeight: 1 }}>{gameState.roomId}</div>
      </div>
      {/* Main Identity Area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        {showIdentity ? (
          <div style={{ 
            height: '100%', 
            backgroundColor: COLORS.bgAccent, 
            padding: '2rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            position: 'relative'
          }}>
            {isHost && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onShuffleWords(); // Call the prop
                }}
                style={{
                  position: 'absolute',
                  top: '2rem',
                  left: '2rem',
                  border: '2px solid rgba(255,255,255,0.6)',
                  padding: '0.5rem 1.5rem',
                  cursor: 'pointer',
                  color: COLORS.textLight,
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  opacity: 0.8,
                  transition: 'opacity 0.2s',
                  zIndex: 20
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
              >
                换词
              </div>
            )}
            <div style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>我的身份</div>
            <div style={{ fontSize: '3.5rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1, marginBottom: '3rem' }}>
              {getRoleText(localPlayer.role)}
            </div>
            {localPlayer.word && (
              <>
                <div style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>秘密词汇</div>
                <div style={{ fontSize: '3rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1 }}>
                  {localPlayer.word}
                </div>
              </>
            )}
          </div>
        ) : (
          <div 
            onClick={() => setShowIdentity(true)}
            style={{ 
              height: '100%', 
              backgroundColor: '#fff', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              border: `2px solid ${COLORS.borderColor}`,
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ 
              position: 'absolute', 
              top: '2rem', 
              left: '2rem', 
              fontSize: '0.75rem', 
              letterSpacing: '0.1em', 
              color: COLORS.textMuted 
            }}>
              已加密
            </div>

            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              backgroundColor: COLORS.bgMain, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '2rem',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: `2px dashed ${COLORS.textMain}`,
                opacity: 0.3,
                animation: 'spin 10s linear infinite'
              }} />
              <Scan size={48} color={COLORS.textMain} />
            </div>

            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700', 
              color: COLORS.textMain,
              letterSpacing: '-0.05em',
              marginBottom: '0.5rem'
            }}>
              点击查看
            </div>
            <div style={{ fontSize: '0.75rem', color: COLORS.textMuted }}>
              身份已隐藏
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Area */}
      <div style={{ 
        height: '160px', 
        backgroundColor: COLORS.bgDark, 
        padding: '2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1 }}>
            {confirmed ? (isHost ? '开始游戏' : '已准备') : '我记住了'}
          </div>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '1.31rem', 
            color: 'rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>已准备:</span>
            <span style={{ color: COLORS.bgAccent, fontWeight: '700' }}>
              {confirmedCount} / {totalPlayers}
            </span>
          </div>
        </div>

        {!confirmed && (
          <ActionCircle 
            onClick={handleRemembered} 
            size="xl"
            color={COLORS.bgAccent} 
            iconColor={COLORS.textLight} 
          />
        )}

        {isHost && confirmed && (
          <ActionCircle 
            onClick={onStartGame} 
            size="xl"
            color={COLORS.bgAccent} 
            iconColor={COLORS.textLight} 
          />
        )}
      </div>
    </div>
  );
};
