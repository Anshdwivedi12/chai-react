import React from 'react';

export const Placeholder: React.FC<{ title: string }> = ({ title }) => {
  return (
    <section style={{ background: '#ffffff', borderRadius: 12, padding: 16, border: '1px solid #eaecee' }}>
      <h3 style={{ marginTop: 0, marginBottom: 12 }}>{title}</h3>
      <p style={{ margin: 0, color: '#475569' }}>This section is intentionally left blank.</p>
    </section>
  );
};

