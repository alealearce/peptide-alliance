import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Peptide Alliance — The Standard in Regenerative Health';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0A1F44 0%, #1a3d8e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '50px 60px',
        }}
      >
        {/* Left: text */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            paddingRight: '40px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: '800',
              color: 'white',
              letterSpacing: '-2px',
              lineHeight: '1',
              marginBottom: '20px',
            }}
          >
            Peptide Alliance
          </div>

          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255,255,255,0.85)',
              lineHeight: '1.4',
              maxWidth: '560px',
              marginBottom: '40px',
            }}
          >
            The Standard in Regenerative Health
          </div>

          {/* URL pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '12px',
              padding: '10px 20px',
              width: 'fit-content',
            }}
          >
            <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '20px' }}>
              peptidealliance.io
            </div>
          </div>
        </div>

        {/* Right: Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://peptidealliance.io/images/mascots/peptidealliancelogo.png"
            alt="Peptide Alliance"
            width={400}
            height={520}
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
