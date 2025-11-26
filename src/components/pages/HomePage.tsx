// 页面1：主页（输入昵称，创建/加入房间）- 按钮显著化重构
import React, { useState } from 'react';
import { COLORS } from '../../constants';
import { ActionCircle } from '../ActionCircle';
import { VerticalBars } from '../VerticalBars';

interface HomePageProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (name: string, roomId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');

  const handleAction = () => {
    if (!name.trim()) return;
    if (mode === 'create') {
      onCreateRoom(name.trim());
    } else {
      if (roomId.length === 4) {
        onJoinRoom(name.trim(), roomId);
      }
    }
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
      {/* 顶部 Header - 保持简洁 */}
      <div style={{ padding: '2rem 2rem 1rem' }}>
        <div style={{ fontSize: '1.5rem', letterSpacing: '0.1em', color: COLORS.textMuted, marginBottom: '0.5rem' }}>
          谁是卧底
        </div>
        <div style={{ borderBottom: `2px solid ${COLORS.textMain}`, paddingBottom: '1rem' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="怎么称呼您？"
            style={{
              width: '100%',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: COLORS.textMain,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Space Mono, monospace'
            }}
          />
        </div>
      </div>

      {/* 主要功能区 - 巨大的切换卡片 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 2rem 2rem' }}>
        {/* CREATE ROOM CARD */}
        <div 
          onClick={() => setMode('create')}
          style={{
            flex: mode === 'create' ? 2 : 1,
            backgroundColor: mode === 'create' ? COLORS.bgAccent : COLORS.bgDark,
            margin: '1rem 0',
            borderRadius: '0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              lineHeight: 0.9, 
              color: mode === 'create' ? COLORS.textLight : 'rgba(255,255,255,0.3)' 
            }}>
              创建<br/>房间
            </div>
            {mode === 'create' && (
              <div style={{ height: '40px' }}>
                <VerticalBars value={100} max={100} color={COLORS.textLight} height="h-full" />
              </div>
            )}
          </div>
          
          {mode === 'create' && (
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
              <ActionCircle 
                onClick={handleAction} 
                disabled={!name.trim()}
                size="xl"
                color="rgba(255,255,255,0.2)"
                iconColor={COLORS.textLight}
                label="开始"
              />
            </div>
          )}
        </div>

        {/* JOIN ROOM CARD */}
        <div 
          onClick={() => setMode('join')}
          style={{
            flex: mode === 'join' ? 2 : 1,
            backgroundColor: mode === 'join' ? COLORS.bgAccent : COLORS.bgDark,
            marginBottom: '1rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              lineHeight: 0.9, 
              color: mode === 'join' ? COLORS.textLight : COLORS.textMuted
            }}>
              加入<br/>房间
            </div>
          </div>

          {mode === 'join' && (
            <div style={{ marginTop: '2rem' }}>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.slice(0, 4))}
                placeholder="ID"
                maxLength={4}
                style={{
                  width: '100%',
                  fontSize: '4rem',
                  fontWeight: '700',
                  color: COLORS.textLight,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${COLORS.textLight}`,
                  outline: 'none',
                  fontFamily: 'Space Mono, monospace',
                  marginBottom: '1rem'
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <ActionCircle 
                  onClick={handleAction} 
                  disabled={!name.trim() || roomId.length !== 4}
                  size="xl"
                  color="rgba(255,255,255,0.2)"
                  iconColor={COLORS.textLight}
                  label="进入"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
