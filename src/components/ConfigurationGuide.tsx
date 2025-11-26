import React from 'react';
import { COLORS } from '../constants';
import { X, Zap, CheckCircle, Shield, Flame, Star, Scale, Swords, Target, MessageCircle, Hourglass } from 'lucide-react';

interface ConfigurationGuideProps {
  onClose: () => void;
}

const CONFIGS = [
  { total: 3, civilian: 2, undercover: 1, blank: 0, label: '极速局', icon: <Zap size={16} color="#f59e0b" /> },
  { total: 4, civilian: 3, undercover: 1, blank: 0, label: '入门局', icon: <CheckCircle size={16} color="#10b981" /> },
  { total: 5, civilian: 4, undercover: 1, blank: 0, label: '防守局', icon: <Shield size={16} color="#64748b" /> },
  { total: 6, civilian: 4, undercover: 2, blank: 0, label: '对抗局', icon: <Flame size={16} color="#ef4444" /> },
  { total: 7, civilian: 4, undercover: 2, blank: 1, label: '黄金配置', icon: <Star size={16} color="#eab308" /> },
  { total: 8, civilian: 5, undercover: 2, blank: 1, label: '标准平衡', icon: <Scale size={16} color="#94a3b8" /> },
  { total: 9, civilian: 5, undercover: 3, blank: 1, label: '乱斗开始', icon: <Swords size={16} color="#64748b" /> },
  { total: 10, civilian: 6, undercover: 3, blank: 1, label: '十人标准', icon: <Target size={16} color="#ef4444" /> },
  { total: 11, civilian: 6, undercover: 3, blank: 2, label: '口才考验', icon: <MessageCircle size={16} color="#3b82f6" /> },
  { total: 12, civilian: 7, undercover: 3, blank: 2, label: '马拉松局', icon: <Hourglass size={16} color="#a8a29e" /> },
];

export const ConfigurationGuide: React.FC<ConfigurationGuideProps> = ({ onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: COLORS.bgMain,
        width: '100%',
        maxWidth: '500px',
        maxHeight: '80vh',
        borderRadius: '1rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          backgroundColor: COLORS.bgDark,
          color: COLORS.textLight,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>人数配置推荐</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.textLight, cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2.5fr',
          padding: '1rem',
          backgroundColor: 'rgba(0,0,0,0.05)',
          fontSize: '0.875rem',
          fontWeight: '700',
          color: COLORS.textMuted,
          borderBottom: `1px solid ${COLORS.borderColor}`
        }}>
          <div>总人数</div>
          <div style={{textAlign: 'center'}}>平民</div>
          <div style={{textAlign: 'center'}}>卧底</div>
          <div style={{textAlign: 'center'}}>白板</div>
          <div style={{textAlign: 'right'}}>类型</div>
        </div>

        {/* List */}
        <div style={{ overflowY: 'auto', padding: '0 1rem 1rem 1rem' }}>
          {CONFIGS.map((config, index) => (
            <div key={config.total} style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr 1fr 2.5fr',
              padding: '1rem 0',
              borderBottom: index < CONFIGS.length - 1 ? `1px solid ${COLORS.borderColor}` : 'none',
              alignItems: 'center',
              fontSize: '1rem',
              color: COLORS.textMain
            }}>
              <div style={{ fontWeight: '700', fontSize: '1.125rem' }}>{config.total} 人</div>
              <div style={{ textAlign: 'center' }}>{config.civilian}</div>
              <div style={{ textAlign: 'center', color: COLORS.bgAccent, fontWeight: '700' }}>{config.undercover}</div>
              <div style={{ textAlign: 'center', opacity: config.blank > 0 ? 1 : 0.3 }}>{config.blank}</div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'flex-end', 
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '700'
              }}>
                {config.icon}
                <span>{config.label}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

