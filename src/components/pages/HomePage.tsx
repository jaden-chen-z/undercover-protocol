// 页面1：主页（输入昵称，创建/加入房间）- 按钮显著化重构
import React, { useState, useEffect, useRef } from 'react';
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
  
  // 移动端键盘优化
  const inputRef = useRef<HTMLInputElement>(null);
  const roomInputRef = useRef<HTMLInputElement>(null);

  // 监听可视视口变化，动态调整布局高度，防止键盘遮挡
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        document.documentElement.style.setProperty('--vh', `${window.visualViewport.height}px`);
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    handleResize();

    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

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

  // 修复iOS键盘收起后页面留白问题
  const handleBlur = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="page-container" style={{ 
      backgroundColor: COLORS.bgMain,
      // 使用 dvh 确保在移动端浏览器中填满可见区域
      height: '100dvh', 
      minHeight: '-webkit-fill-available'
    }}>
      {/* 顶部 Header - 保持简洁 */}
      <div style={{ padding: '2rem 2rem 1rem', flexShrink: 0 }}>
        <div style={{ fontSize: '1.5rem', letterSpacing: '0.1em', color: COLORS.textMuted, marginBottom: '0.5rem' }}>
          谁是卧底
        </div>
        <div style={{ borderBottom: `2px solid ${COLORS.textMain}`, paddingBottom: '1rem' }}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleBlur}
            placeholder="怎么称呼您？"
            style={{
              width: '100%',
              fontSize: '2.5rem',
              fontWeight: '700',
              color: COLORS.textMain,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'Space Mono, monospace',
              borderRadius: 0 // iOS fix
            }}
          />
        </div>
      </div>

      {/* 主要功能区 - 可滚动区域，确保键盘弹起时可以滚动查看内容 */}
      <div className="scrollable-content" style={{ padding: '0 2rem 2rem', display: 'flex', flexDirection: 'column' }}>
        {/* CREATE ROOM CARD */}
        <div 
          onClick={() => {
            setMode('create');
            // 切换模式时自动聚焦输入框（可选，但体验更好）
            // inputRef.current?.focus();
          }}
          style={{
            flex: mode === 'create' ? 2 : 1,
            minHeight: mode === 'create' ? '240px' : '100px', // 确保最小高度
            backgroundColor: mode === 'create' ? COLORS.bgAccent : COLORS.bgDark,
            margin: '1rem 0',
            borderRadius: '0',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', // 更平滑的动画
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
            flexShrink: 0 // 防止被压缩
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              lineHeight: 0.9, 
              color: mode === 'create' ? COLORS.textLight : 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s'
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
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '2rem' }}>
              <ActionCircle 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction();
                }}
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
          onClick={() => {
            setMode('join');
            // 延迟聚焦，等待动画完成
            setTimeout(() => roomInputRef.current?.focus(), 100);
          }}
          style={{
            flex: mode === 'join' ? 2 : 1,
            minHeight: mode === 'join' ? '240px' : '100px',
            backgroundColor: mode === 'join' ? COLORS.bgAccent : COLORS.bgDark,
            marginBottom: '1rem', // 底部留白，防止贴底
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              lineHeight: 0.9, 
              color: mode === 'join' ? COLORS.textLight : COLORS.textMuted,
              transition: 'color 0.3s'
            }}>
              加入<br/>房间
            </div>
          </div>

          {mode === 'join' && (
            <div style={{ marginTop: '2rem' }} onClick={e => e.stopPropagation()}>
              <input
                ref={roomInputRef}
                type="tel" // 使用数字键盘
                pattern="[0-9]*" // 触发纯数字键盘
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.slice(0, 4))}
                onBlur={handleBlur}
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
                  marginBottom: '1rem',
                  borderRadius: 0
                }}
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
        {/* 底部垫片，确保最后的内容不被某些浏览器的底部栏完全遮挡 */}
        <div style={{ height: '20px' }} />
      </div>
    </div>
  );
};
