// 页面7：淘汰反馈页 - 按钮显著化重构
import React from 'react';
import { COLORS } from '../../constants';
import { ActionCircle } from '../ActionCircle';
import type { GameState } from '../../types';

interface EliminationFeedbackPageProps {
  gameState: GameState;
  onContinue: () => void;
}

export const EliminationFeedbackPage: React.FC<EliminationFeedbackPageProps> = ({
  gameState,
  onContinue
}) => {
  const isTie = gameState.lastVoteResult?.isTie;
  const eliminatedName = gameState.eliminatedPlayerName;

  const bgColor = isTie ? COLORS.bgMain : COLORS.bgAccent;
  const textColor = isTie ? COLORS.textMain : COLORS.textLight;

  return (
    <div style={{ 
      backgroundColor: bgColor,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Space Mono, monospace',
      padding: '2rem',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: '2rem', right: '2rem', textAlign: 'right', zIndex: 10 }}>
        <div style={{ fontSize: '0.75rem', color: isTie ? COLORS.textMuted : 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>房间号</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: textColor, lineHeight: 1 }}>{gameState.roomId}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.75rem', color: isTie ? COLORS.textMuted : 'rgba(255,255,255,0.7)', marginBottom: '1rem' }}>投票结果</div>
        {isTie ? (
          <div>
            <div style={{ fontSize: '4rem', fontWeight: '700', color: textColor, lineHeight: 0.9, marginBottom: '1rem' }}>平票</div>
            <div style={{ fontSize: '1.5rem' }}>无人出局</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '4rem', fontWeight: '700', color: textColor, lineHeight: 0.9, marginBottom: '1rem' }}>
              {eliminatedName?.toUpperCase()}
            </div>
            <div style={{ fontSize: '1.5rem', color: textColor, opacity: 0.8 }}>被淘汰</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ActionCircle 
          onClick={onContinue} 
          size="xl"
          color={isTie ? COLORS.bgAccent : "rgba(255,255,255,0.2)"} 
          iconColor={COLORS.textLight} 
        />
      </div>
    </div>
  );
};
