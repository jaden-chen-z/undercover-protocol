import React from 'react';
import ReactMarkdown from 'react-markdown';
import { COLORS } from '../constants';
import { X } from 'lucide-react';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const InstructionModal: React.FC<InstructionModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '2rem'
    }} onClick={onClose}>
      <div style={{
        backgroundColor: COLORS.bgMain,
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        borderRadius: '12px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${COLORS.borderColor}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.bgAccent,
          color: COLORS.textLight
        }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>游戏说明</h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: COLORS.textLight,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{
          padding: '1.5rem',
          overflowY: 'auto',
          color: COLORS.textMain,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          lineHeight: 1.6
        }}>
          <ReactMarkdown 
            components={{
              h1: ({node, ...props}) => <h1 style={{ fontSize: '1.8rem', marginBottom: '1rem', borderBottom: `2px solid ${COLORS.bgAccent}`, paddingBottom: '0.5rem' }} {...props} />,
              h2: ({node, ...props}) => <h2 style={{ fontSize: '1.4rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: COLORS.bgAccent }} {...props} />,
              h3: ({node, ...props}) => <h3 style={{ fontSize: '1.1rem', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 'bold' }} {...props} />,
              p: ({node, ...props}) => <p style={{ marginBottom: '0.8rem' }} {...props} />,
              ul: ({node, ...props}) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
              li: ({node, ...props}) => <li style={{ marginBottom: '0.25rem' }} {...props} />,
              strong: ({node, ...props}) => <strong style={{ color: COLORS.bgDark }} {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

