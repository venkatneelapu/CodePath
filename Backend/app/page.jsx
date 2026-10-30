export default function ApiRoot() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif', padding: '2rem', maxWidth: '600px', margin: '40px auto', background: '#0f172a', color: '#f8fafc', borderRadius: '12px' }}>
      <h1 style={{ color: '#a855f7' }}>CodePath API Server</h1>
      <p style={{ color: '#94a3b8' }}>Status: <strong>Active & Healthy</strong> (Port 5000)</p>
      <hr style={{ borderColor: '#334155', margin: '1.5rem 0' }} />
      <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>Available API namespaces:</p>
      <ul style={{ fontSize: '0.85rem', color: '#38bdf8', lineHeight: '1.8' }}>
        <li><code>/api/courses</code></li>
        <li><code>/api/auth/*</code></li>
        <li><code>/api/gemini/*</code></li>
        <li><code>/api/roadmaps/*</code></li>
        <li><code>/api/gamification/*</code></li>
      </ul>
    </main>
  );
}

