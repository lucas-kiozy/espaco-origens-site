// Gallery.jsx — grade responsiva de peças com lightbox simples (sem libs)
// Zen of Python: simples e explícito; cada parte tem uma responsabilidade clara.
import { useState } from "react";

type ImageItem = { src: string; alt: string };
type Props = { images?: ImageItem[] };

export default function Gallery({ images = [] }: Props) {
  const [active, setActive] = useState<ImageItem | null>(null);

  // fecha lightbox ao apertar ESC (acessibilidade)
  function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") setActive(null);
  }

  return (
    <section
      className="max-w-6xl mx-auto px-4 py-10"
      onKeyDown={onKeyDown}
      tabIndex={-1}
    >
      <h2 className="text-2xl mb-4 lowercase text-marrom">galeria</h2>

      {/* grade das miniaturas — cada imagem tem alt descritivo para SEO/acessibilidade */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={i}
            className="group focus:outline-none"
            onClick={() => setActive(img)}
            aria-label={`ver peça ${i + 1} em tamanho maior`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              width={600}
              height={600}
              className="rounded-xl shadow object-cover w-full aspect-square group-hover:opacity-90"
            />
          </button>
        ))}
      </div>

      {/* lightbox acessível (fecha ao clicar no backdrop) */}
      {active && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label="imagem ampliada"
        >
          <img
            src={active.src}
            alt={active.alt}
            className="max-h-[85vh] rounded-xl shadow-lg"
          />
        </div>
      )}
    </section>
  );
}
