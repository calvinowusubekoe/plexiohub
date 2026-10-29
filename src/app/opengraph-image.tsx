import { ImageResponse } from 'next/og';

export const alt = 'PlexioHub — We Build. You Grow.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default social share image (logo-style wordmark) until the founder supplies brand artwork. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F5F7FB 0%, #E2E8F0 100%)',
          color: '#0F1E4A',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 120, fontWeight: 800 }}>
          <div style={{ display: 'flex', position: 'relative', width: 70, height: 70, marginRight: 20 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 52, height: 52, borderRadius: 26, background: '#0F1E4A' }} />
            <div style={{ position: 'absolute', right: 0, bottom: 0, width: 40, height: 40, borderRadius: 20, background: '#2563EB' }} />
          </div>
          <span>Plexio</span>
          <span style={{ color: '#2563EB' }}>hub</span>
        </div>
        <div style={{ marginTop: 24, fontSize: 40, letterSpacing: 6 }}>WE BUILD. YOU GROW.</div>
        <div style={{ marginTop: 36, fontSize: 30, color: '#475569' }}>Websites · WhatsApp Chatbots · Automation · Design</div>
      </div>
    ),
    size,
  );
}
