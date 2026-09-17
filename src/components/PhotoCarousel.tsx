import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHighlights } from '@/hooks/use-highlights';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const PhotoCarousel = () => {
  const { highlights, loading } = useHighlights();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const photos = useMemo(
    () => highlights.filter((highlight) => highlight.type === 'photo' && highlight.mediaUrl),
    [highlights],
  );

  const galleryPhotos = useMemo(() => photos.slice(0, 4), [photos]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index % photos.length);
    setLightboxOpen(true);
  }, [photos.length]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goToPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') goToPrev();
      if (event.key === 'ArrowRight') goToNext();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, closeLightbox, goToPrev, goToNext]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
        <div className="min-h-[460px] rounded-[16px] bg-white/[0.06] md:col-span-2 md:row-span-2" />
        <div className="min-h-[220px] rounded-[16px] bg-white/[0.06]" />
        <div className="min-h-[220px] rounded-[16px] bg-white/[0.06]" />
        <div className="min-h-[220px] rounded-[16px] bg-white/[0.06] md:col-span-2" />
      </div>
    );
  }

  if (!photos.length) return null;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
        {galleryPhotos.map((photo, index) => {
          const layoutClassName =
            index === 0
              ? 'md:col-span-2 md:row-span-2 min-h-[460px]'
              : index === 3
                ? 'md:col-span-2 min-h-[220px]'
                : 'min-h-[220px]';

          return (
            <button
              key={`${photo.$id ?? 'photo'}-${index}`}
              type="button"
              onClick={() => openLightbox(index)}
              className={`photo-frame group relative text-left ${layoutClassName}`}
            >
              <img
                src={photo.mediaUrl}
                alt={`Event highlight ${index + 1}`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/[0.45] via-transparent to-transparent" />
            </button>
          );
        })}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/[0.92] px-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/80">
            {lightboxIndex + 1} / {photos.length}
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              goToPrev();
            }}
            className="absolute left-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:left-8"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            className="max-h-[84vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={photos[lightboxIndex]?.mediaUrl}
              alt={`Event highlight ${lightboxIndex + 1}`}
              className="max-h-[84vh] max-w-full rounded-[20px] object-contain shadow-2xl"
            />
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 sm:right-8"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex max-w-[90vw] -translate-x-1/2 gap-2 overflow-x-auto rounded-[16px] border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
            {photos.map((photo, index) => (
              <button
                key={`thumb-${photo.$id ?? index}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setLightboxIndex(index);
                }}
                className={`h-12 w-16 overflow-hidden rounded-[12px] border transition-all ${index === lightboxIndex ? 'border-white/80 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                <img
                  src={photo.mediaUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoCarousel;
