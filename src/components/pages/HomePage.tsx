// 页面1：主页（输入昵称，创建/加入房间）- 按钮显著化重构
import React, { useState, useEffect, useRef } from 'react';
import { COLORS } from '../../constants';
import { ActionCircle } from '../ActionCircle';
import { VerticalBars } from '../VerticalBars';

interface HomePageProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (name: string, roomId: string) => void;
}

import { InstructionModal } from '../InstructionModal';

export const HomePage: React.FC<HomePageProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [isInstructionOpen, setIsInstructionOpen] = useState(false);
  const [readmeContent] = useState(`
# 🕵️‍♂️ 谁是卧底 (Undercover) - 聚会/团建神器

欢迎使用**谁是卧底**在线辅助工具！这是一个专为线下聚会、朋友吃饭、公司团建设计的网页版游戏助手。

**不用找纸笔、不用当法官、不用买卡牌**，只要每人有一部手机，打开网页就能立刻开始“互飙演技”！

## 🎮 游戏简介

“谁是卧底”是一个比拼语言表述能力、知识面与想象力的游戏。
*   **场景**：多人围坐在一起（线下）。
*   **工具**：每人一部手机，打开本网站。
*   **目的**：平民要找出卧底，卧底要隐藏身份并活到最后。

---

## 🧑‍🤝‍🧑 角色说明

在游戏中，你会被随机分配到以下三种身份之一：

1.  **平民 (Civilian)** 😐
    *   **人数**：大多数。
    *   **任务**：大家拿到的是同一个词语（例如“饺子”）。你的目标是通过描述自己的词语，找出谁拿到了不同的词语（卧底），并投票将其淘汰。
    *   **注意**：描述不能太直白（防卧底猜到），也不能太模糊（防被当成卧底）。

2.  **卧底 (Undercover)** 😎
    *   **人数**：少数（通常 1-3 人）。
    *   **任务**：你拿到的词语与平民相似但不同（例如“包子”）。你需要根据别人的描述，伪装自己是平民，误导大家，坚持到最后。

3.  **白板 (Blank)** 🌫️ (可选)
    *   **人数**：0 或 2 人（可在设置中开启）。
    *   **任务**：你**没有词语**！你只能听到别人的描述，然后假装自己知道词语，并在描述时不要露馅。极其考验心理素质！

---

## 🚀 快速开始指南

### 第一步：创建/加入房间

**如果你是组织者（房主）：**
1.  输入你的昵称。
2.  点击深灰色的 **“创建房间”** 区域。
3.  告诉大家屏幕右上角的 **4位数字房间号**。

**如果你是参与者：**
1.  输入你的昵称。
2.  点击橙色的 **“加入房间”** 区域。
3.  输入房主提供的 **4位房间号**，点击进入。

### 第二步：游戏设置（仅房主）

所有人进入房间后，房主可以在设置页面调整：
*   **卧底人数**：想要几个卧底？
*   **白板人数**：是否加入“白板”角色？
*   **确认设置**：点击开始发牌。

### 第三步：查看词语 & 描述

1.  **翻牌**：屏幕上会出现一张卡片，**长按**或**点击**查看你的词语。
2.  **保密**：看完记得隐藏，别让旁边的人偷看！
3.  **描述**：按照屏幕上的顺序，大家依次描述自己的词语。

### 第四步：投票 & 淘汰

1.  **发起投票**：一轮描述结束后，房主点击“开始投票”。
2.  **投票**：觉得谁是卧底？点击那个人的名字/头像进行投票。
3.  **结果**：得票最多的人会被淘汰（出局）。系统会自动判断游戏是否结束。
    *   如果卧底全部出局 ➡️ **平民胜利** 🎉
    *   如果卧底人数 >= 平民人数 ➡️ **卧底胜利** 😈

---

## 💡 常见问题 (FAQ)

**Q: 我们需要连同一个 Wi-Fi 吗？**
A: **不需要！** 只要大家的手机能上网（4G/5G/Wi-Fi 均可），就可以通过互联网连接。

**Q: 为什么我进不去房间？**
A: 请确认房间号是否输入正确。如果还是不行，尝试刷新页面，让房主重新建立一个房间。

**Q: 房间会过期吗？**
A: 会。如果房间内连续 **30分钟** 没有任何操作（如投票、开始新游戏），为了节省资源，房间会自动解散。

**Q: 我不小心退出了怎么办？**
A: 只要游戏还没结束，重新输入昵称和房间号，通常可以重连回来（如果房间没满且你使用的设备没变）。

---

## 🛠️ 技术支持

本项目由 [Jaden] 开发。如果你在使用中遇到 Bug，请联系开发者或在 GitHub 提交 Issue。

*祝大家玩得开心，演技爆棚！* 🎭
  `);
  
  // useEffect(() => {
  //   // Load README content
  //   fetch('/README.md')
  //     .then(res => res.text())
  //     .then(text => setReadmeContent(text))
  //     .catch(err => console.error('Failed to load README:', err));
  // }, []);

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
      minHeight: '-webkit-fill-available',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 顶部 Header - 保持简洁 */}
      <div style={{ padding: 'min(2rem, 5vw) min(2rem, 5vw) min(1rem, 2.5vw)', flexShrink: 0 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'baseline',
          marginBottom: '0.5rem'
        }}>
          <div style={{ fontSize: 'min(1.5rem, 6vw)', letterSpacing: '0.1em', color: COLORS.textMuted }}>
            谁是卧底
          </div>
          <button 
            onClick={() => setIsInstructionOpen(true)}
            style={{ 
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: 'min(1.5rem, 6vw)', 
              letterSpacing: '0.1em', 
              color: COLORS.textMuted,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'inherit'
            }}
          >
            游戏说明
          </button>
        </div>
        <div style={{ borderBottom: `2px solid ${COLORS.textMain}`, paddingBottom: 'min(1rem, 2.5vw)' }}>
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleBlur}
            placeholder="怎么称呼您？"
            style={{
              width: '100%',
              fontSize: 'min(2.5rem, 10vw)',
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
      <div className="scrollable-content" style={{ 
        padding: '0 min(2rem, 5vw) min(2rem, 5vw)', 
        display: 'flex', 
        flexDirection: 'column',
        flex: 1,
        overflowY: 'auto'
      }}>
        {/* CREATE ROOM CARD */}
        <div 
          onClick={() => {
            setMode('create');
            // 切换模式时自动聚焦输入框（可选，但体验更好）
            // inputRef.current?.focus();
          }}
          style={{
            flex: mode === 'create' ? 2 : 1,
            minHeight: mode === 'create' ? 'min(240px, 35vh)' : 'min(100px, 15vh)', // 确保最小高度
            backgroundColor: mode === 'create' ? COLORS.bgAccent : COLORS.bgDark,
            margin: 'min(1rem, 2.5vw) 0',
            borderRadius: '0',
            padding: 'min(2rem, 5vw)',
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
              fontSize: 'min(3rem, 12vw)', 
              fontWeight: '700', 
              lineHeight: 0.9, 
              color: mode === 'create' ? COLORS.textLight : 'rgba(255,255,255,0.3)',
              transition: 'color 0.3s'
            }}>
              创建<br/>房间
            </div>
            {mode === 'create' && (
              <div style={{ height: 'min(40px, 10vw)' }}>
                <VerticalBars value={100} max={100} color={COLORS.textLight} height="h-full" />
              </div>
            )}
          </div>
          
          {mode === 'create' && (
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: 'min(2rem, 5vw)' }}>
              <ActionCircle 
                onClick={(e) => {
                  e?.stopPropagation();
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
            minHeight: mode === 'join' ? 'min(240px, 35vh)' : 'min(100px, 15vh)',
            backgroundColor: mode === 'join' ? COLORS.bgAccent : COLORS.bgDark,
            marginBottom: 'min(1rem, 2.5vw)', // 底部留白，防止贴底
            padding: 'min(2rem, 5vw)',
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
              fontSize: 'min(3rem, 12vw)', 
              fontWeight: '700', 
              lineHeight: 0.9, 
              color: mode === 'join' ? COLORS.textLight : COLORS.textMuted,
              transition: 'color 0.3s'
            }}>
              加入<br/>房间
            </div>
          </div>

          {mode === 'join' && (
            <div style={{ marginTop: 'min(0.5rem, 1.5vw)' }} onClick={e => e.stopPropagation()}>
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
                  fontSize: 'min(4rem, 16vw)',
                  fontWeight: '700',
                  color: COLORS.textLight,
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${COLORS.textLight}`,
                  outline: 'none',
                  fontFamily: 'Space Mono, monospace',
                  marginBottom: 'min(0.5rem, 1.5vw)',
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

      <InstructionModal 
        isOpen={isInstructionOpen} 
        onClose={() => setIsInstructionOpen(false)} 
        content={readmeContent} 
      />
    </div>
  );
};
