import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface VehicleGalleryProps {
  images: string[];
  vehicleName?: string;
}

export default function VehicleGallery({
  images,
  vehicleName = "Vehicle",
}: VehicleGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const validImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80",
        ];

  const currentImage = validImages[selectedIndex];

  const previousImage = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1,
    );
  };

  const nextImage = () => {
    setSelectedIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <>
      <div className="w-full">
        {/* Main Image */}
        <div className="group relative h-[420px] overflow-hidden rounded-2xl bg-slate-100">
          <img
            src={currentImage}
            alt={`${vehicleName} ${selectedIndex + 1}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80";
            }}
          />

          {/* Zoom Button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute right-4 top-4 flex items-center gap-2 rounded-xl bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-lg backdrop-blur hover:bg-white"
          >
            <ZoomIn size={18} />
            View
          </button>

          {/* Previous */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Next */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur transition hover:bg-white"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1.5 text-sm font-semibold text-white">
              {selectedIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {validImages.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {validImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                  selectedIndex === index
                    ? "border-blue-600 ring-2 ring-blue-100"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${vehicleName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=80";
                  }}
                />

                {selectedIndex === index && (
                  <div className="absolute inset-0 bg-blue-600/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Gallery */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4">
          {/* Close */}
          <button
            type="button"
            onClick={() => setIsFullscreen(false)}
            className="absolute right-5 top-5 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X size={26} />
          </button>

          {/* Previous */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={previousImage}
              className="absolute left-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronLeft size={30} />
            </button>
          )}

          {/* Fullscreen Image */}
          <img
            src={currentImage}
            alt={`${vehicleName} fullscreen`}
            className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
          />

          {/* Next */}
          {validImages.length > 1 && (
            <button
              type="button"
              onClick={nextImage}
              className="absolute right-5 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <ChevronRight size={30} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
            {selectedIndex + 1} / {validImages.length}
          </div>
        </div>
      )}
    </>
  );
}
