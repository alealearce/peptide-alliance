import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'InfoSylvita — Latin Business Directory Canada';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #2B5EBE 0%, #1a3d8e 100%)',
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
              fontSize: '80px',
              fontWeight: '800',
              color: 'white',
              letterSpacing: '-2px',
              lineHeight: '1',
              marginBottom: '20px',
            }}
          >
            InfoSylvita
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
            Tu directorio de negocios latinos en Canadá
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
              infosylvita.com
            </div>
          </div>
        </div>

        {/* Right: Sylvita mascot with phone */}
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
            src="https://infosylvita.com/images/mascots/brand-logo.png"
            alt="Sylvita"
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
