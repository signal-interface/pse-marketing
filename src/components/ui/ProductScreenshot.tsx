import Image from 'next/image';

interface Props {
  src: string;
  alt: string;
  caption?: string;
}

export default function ProductScreenshot({ src, alt, caption }: Props) {
  return (
    <figure className="pss-frame">
      <div className="pss-toolbar">
        <span className="pss-dot" style={{ background: '#ff5f57' }} />
        <span className="pss-dot" style={{ background: '#ffbd2e' }} />
        <span className="pss-dot" style={{ background: '#28c840' }} />
        <span className="pss-toolbar-title">PSE Platform</span>
      </div>
      <div className="pss-viewport">
        <Image
          src={src}
          alt={alt}
          width={1280}
          height={800}
          className="pss-image"
          quality={90}
        />
      </div>
      {caption && <figcaption className="pss-caption">{caption}</figcaption>}
    </figure>
  );
}
