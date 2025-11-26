// 页面2：房主创建设置页 - 按钮显著化重构
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { DigitalNumber } from '../DigitalNumber';
import { ActionCircle } from '../ActionCircle';
import { ConfigurationGuide } from '../ConfigurationGuide';
import { validateRoomConfig } from '../../services/gameService';
import type { RoomConfig } from '../../types';
import { Minus, Plus } from 'lucide-react';

interface SetupPageProps {
  onConfirm: (config: RoomConfig) => void;
  onCancel: () => void;
  fixedTotalPlayers?: number;
  confirmText?: string;
  roomId: string;
}

export const SetupPage: React.FC<SetupPageProps> = ({ 
  onConfirm, 
  onCancel,
  fixedTotalPlayers,
  confirmText = 'START',
  roomId
}) => {
  const [totalPlayers, setTotalPlayers] = useState(fixedTotalPlayers || 6);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [blankCount, setBlankCount] = useState(0);
  const [activeField, setActiveField] = useState<'total' | 'undercover' | 'blank'>(
    fixedTotalPlayers ? 'undercover' : 'total'
  );

  const [showGuide, setShowGuide] = useState(false);

  const civilianCount = totalPlayers - undercoverCount - blankCount;
  const validation = validateRoomConfig({ totalPlayers, undercoverCount, blankCount });

  const handleAdjust = (delta: number) => {
    if (activeField === 'total' && !fixedTotalPlayers) {
      const newVal = Math.max(2, Math.min(12, totalPlayers + delta));
      setTotalPlayers(newVal);
    } else if (activeField === 'undercover') {
      const newVal = Math.max(1, Math.min(Math.floor(totalPlayers / 2), undercoverCount + delta));
      setUndercoverCount(newVal);
    } else if (activeField === 'blank') {
      const newVal = Math.max(0, Math.min(2, blankCount + delta));
      setBlankCount(newVal);
    }
  };

  const handleConfirm = () => {
    if (validation.valid) {
      onConfirm({ totalPlayers, undercoverCount, blankCount });
    }
  };

  const renderField = (id: 'total' | 'civilian' | 'undercover' | 'blank', label: string, value: number) => {
    const isActive = activeField === id;
    const isLocked = id === 'total' || id === 'civilian' || (id === 'total' && !!fixedTotalPlayers);
    
    return (
      <div 
        onClick={() => !isLocked && setActiveField(id as any)}
        style={{ 
          marginBottom: '1rem', // Reduced from 1.5rem
          cursor: isLocked ? 'default' : 'pointer',
          padding: '0.7rem 1rem', // Reduced padding slightly
          backgroundColor: isActive ? '#D1D3C8' : 'transparent',
          borderLeft: isActive ? `4px solid ${COLORS.textMain}` : '4px solid transparent',
          transition: 'all 0.2s',
          opacity: isLocked && !isActive ? 0.5 : 1
        }}
      >
        <div style={{ fontSize: '1.125rem', color: COLORS.textMuted, marginBottom: '0.1rem' }}>
          {label} {isLocked && '(已锁定)'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <DigitalNumber value={value} size="lg" color={COLORS.textMain} showDecimal={true} />
        </div>
      </div>
    );
  };

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
      {showGuide && <ConfigurationGuide onClose={() => setShowGuide(false)} />}

      {/* Top Control Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.25rem', color: COLORS.textMuted }}>游戏设置</span>
            <span 
              onClick={() => setShowGuide(true)}
              style={{ 
                fontSize: '1rem', 
                color: COLORS.bgAccent, 
                textDecoration: 'underline', 
                cursor: 'pointer',
                fontWeight: 'bold',
                letterSpacing: '0.05em'
              }}
            >
              推荐配置
            </span>
          </div>
          <span onClick={onCancel} style={{ fontSize: '1.25rem', textDecoration: 'underline', cursor: 'pointer' }}>返回</span>
        </div>

        <div style={{ flex: 1 }}>
          {renderField('total', '玩家总数', totalPlayers)}
          {renderField('civilian', '平民人数', civilianCount)}
          {renderField('undercover', '卧底人数', undercoverCount)}
          {renderField('blank', '白板人数', blankCount)}
        </div>

        {/* Giant Control Buttons */}
        <div style={{ display: 'flex', gap: '1rem', padding: '0 1rem' }}>
           <button 
             onClick={() => handleAdjust(-1)}
             style={{
               flex: 1,
               height: '80px',
               backgroundColor: COLORS.bgDark,
               border: 'none',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               cursor: 'pointer'
             }}
           >
             <Minus color={COLORS.textLight} size={32} />
           </button>
           <button 
             onClick={() => handleAdjust(1)}
             style={{
               flex: 1,
               height: '80px',
               backgroundColor: COLORS.textMain,
               border: 'none',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               cursor: 'pointer'
             }}
           >
             <Plus color={COLORS.textLight} size={32} />
           </button>
        </div>
      </div>

      {/* Bottom Confirm Area (Huge) */}
      <div style={{ 
        backgroundColor: COLORS.bgAccent,
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '160px'
      }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: COLORS.textLight, lineHeight: 1, whiteSpace: 'pre-wrap' }}>
            {confirmText}
          </div>
          {!validation.valid && (
             <div style={{ color: '#fff', marginTop: '0.5rem', fontSize: '0.75rem' }}>
               ! {validation.error?.toUpperCase()}
             </div>
          )}
        </div>
        
        <ActionCircle 
          onClick={handleConfirm}
          disabled={!validation.valid}
          size="xl"
          color="rgba(255,255,255,0.2)"
          iconColor={COLORS.textLight}
        />
      </div>
    </div>
  );
};
