import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, Tag, Eye } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/salonData';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Photos' },
    { id: 'hair', label: 'Hair Transformations' },
    { id: 'nails', label: 'Nail Care & Art' },
    { id: 'lashes-brows', label: 'Lashes & Eyebrows' },
    { id: 'ambience', label: 'Salon Ambience & Stations' }
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === selectedCategory);

  const handleNextPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!activePhoto) return;
    const currentIndex = filteredPhotos.findIndex(p => p.id === activePhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setActivePhoto(filteredPhotos[prevIndex]);
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Priority: Should · Real Client Work
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Salon MD Photo Gallery
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Take a look at our recent hair transformations, artistic nail sets, lash extensions, and relaxing atmosphere on the 2nd Floor of Circle C Mall.
          </p>
        </div>

        {/* Gallery Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {filterTabs.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPhotos.map((item) => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative aspect-square shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300">
                  {item.categoryLabel}
                </span>
                <h4 className="font-serif font-bold text-base text-white mt-0.5 line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                  {item.description}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-stone-300 font-medium">
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  <span>Click to view large</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activePhoto && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={() => setActivePhoto(null)}
          >
            <div 
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-stone-200 grid md:grid-cols-12"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo Area */}
              <div className="md:col-span-7 bg-stone-950 flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-full object-cover max-h-[500px]"
                />

                {/* Prev / Next controls */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Information Area */}
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold tracking-wider text-rose-700">
                      {activePhoto.categoryLabel}
                    </span>
                    <button
                      onClick={() => setActivePhoto(null)}
                      className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors"
                      aria-label="Close dialog"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      {activePhoto.title}
                    </h3>
                    <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                      {activePhoto.description}
                    </p>
                  </div>

                  {/* Service tags */}
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                      Services Shown:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activePhoto.serviceTags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs text-stone-500">
                    Circle C Mall, 2nd Floor
                  </div>
                  <a
                    href="#catalog"
                    onClick={() => setActivePhoto(null)}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold transition-colors"
                  >
                    View in Catalog →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
