import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Scissors, 
  HeartHandshake, 
  Flame, 
  Eye, 
  Palette, 
  Home, 
  Clock, 
  Plus, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  UserCheck
} from 'lucide-react';
import { ServiceItem, ServiceCategory } from '../types';
import { SERVICE_CATEGORIES, SERVICES_DATA } from '../data/salonData';

interface ServiceCatalogProps {
  selectedServices: { [serviceId: string]: number };
  onUpdateQuantity: (serviceId: string, delta: number) => void;
  onOpenCalculator: () => void;
  onBookService?: (serviceId: string) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  selectedServices,
  onUpdateQuantity,
  onOpenCalculator,
  onBookService
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'unisex' | 'female' | 'male'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'duration'>('featured');
  const [expandedInclusions, setExpandedInclusions] = useState<{ [id: string]: boolean }>({});

  const toggleInclusions = (id: string) => {
    setExpandedInclusions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered and sorted services
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      // Category filter
      if (activeCategory !== 'all' && service.category !== activeCategory) {
        return false;
      }

      // Gender filter
      if (genderFilter !== 'all') {
        if (service.gender !== 'unisex' && service.gender !== genderFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDesc = service.description.toLowerCase().includes(query);
        const matchesCat = service.categoryName.toLowerCase().includes(query);
        const matchesInclusions = service.inclusions.some(inc => inc.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCat && !matchesInclusions) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'duration') return a.durationMinutes - b.durationMinutes;
      // Default: featured first, then popular
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return 0;
    });
  }, [activeCategory, searchQuery, genderFilter, sortBy]);

  // Count active selected services
  const totalSelectedCount = Object.values(selectedServices).reduce((sum, qty) => sum + qty, 0);

  return (
    <section id="catalog" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold uppercase tracking-wider">
            <Scissors className="w-3.5 h-3.5" />
            Complete Salon Menu · 5 Categories
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Categorized Service Catalog
          </h2>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Browse our full transparent pricing menu. Tap any service to add it to your Pamper Package Estimator and check bundle savings.
          </p>
        </div>

        {/* Category Navigation Tabs */}
        <div className="mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max p-1 bg-stone-200/60 rounded-2xl">
            {SERVICE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-300/50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-stone-800 text-stone-300' : 'bg-stone-300 text-stone-700'
                  }`}>
                    {cat.id === 'all' 
                      ? SERVICES_DATA.length 
                      : SERVICES_DATA.filter(s => s.category === cat.id).length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. rebond, gel nails, massage, wax, lash)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-800 placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div className="md:col-span-3">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="all">Clients: All (Male & Female)</option>
                <option value="unisex">Unisex Services</option>
                <option value="female">Female Specialized</option>
                <option value="male">Male Friendly</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                <option value="featured">Sort: Featured & Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="duration">Duration: Shortest First</option>
              </select>
            </div>
          </div>

          {/* Quick Active Filter Bar */}
          <div className="flex flex-wrap items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100 gap-2">
            <div>
              Showing <strong className="text-stone-800">{filteredServices.length}</strong> services 
              {activeCategory !== 'all' && (
                <span> in <strong className="text-stone-800 capitalize">{activeCategory.replace('-', ' ')}</strong></span>
              )}
              {searchQuery && (
                <span> matching &quot;{searchQuery}&quot;</span>
              )}
            </div>

            {totalSelectedCount > 0 && (
              <button
                onClick={onOpenCalculator}
                className="text-rose-800 hover:text-rose-950 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{totalSelectedCount} service(s) in Package Estimator · View Total →</span>
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8">
            <Scissors className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-stone-800">No Services Found</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-4">
              We couldn&apos;t find any service matching your current filters. Try resetting your search query or selecting &quot;All Services&quot;.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setGenderFilter('all');
              }}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const selectedQty = selectedServices[service.id] || 0;
              const isSelected = selectedQty > 0;
              const isExpanded = !!expandedInclusions[service.id];

              return (
                <div
                  key={service.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                    isSelected ? 'border-rose-400 ring-2 ring-rose-200/60' : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Card Content Top */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Header line: Category & Duration */}
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-rose-800 uppercase tracking-wider text-[11px]">
                        {service.categoryName}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-stone-600">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {service.durationMinutes} mins
                      </span>
                    </div>

                    {/* Title & Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                          {service.name}
                        </h3>
                        {service.isPopular && (
                          <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Inclusions Dropdown */}
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={() => toggleInclusions(service.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors py-1"
                      >
                        <span>What&apos;s included ({service.inclusions.length})</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <ul className="mt-2 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100 animate-fade-in">
                          {service.inclusions.map((inc, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{inc}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Pricing & Action */}
                  <div className="p-5 sm:p-6 pt-0 mt-auto">
                    <div className="pt-4 border-t border-stone-100 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-[11px] text-stone-400 uppercase font-semibold tracking-wider">
                          {service.gender === 'unisex' ? 'Unisex' : service.gender === 'female' ? 'Female' : 'Male'}
                        </div>
                        <div className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
                          ₱{service.price.toLocaleString()}
                        </div>
                        {service.priceRange && (
                          <div className="text-[10px] text-stone-500">
                            {service.priceRange}
                          </div>
                        )}
                      </div>

                      {/* Action buttons: Book Now & Add to Package */}
                      <div className="flex items-center gap-1.5">
                        {onBookService && (
                          <button
                            onClick={() => onBookService(service.id)}
                            className="px-3 py-2 rounded-xl bg-rose-800 hover:bg-rose-900 text-white text-xs font-semibold transition-colors shadow-2xs"
                          >
                            Book Now
                          </button>
                        )}

                        {isSelected ? (
                          <div className="flex items-center gap-1 bg-stone-100 border border-stone-200 rounded-xl p-1">
                            <button
                              onClick={() => onUpdateQuantity(service.id, -1)}
                              className="w-6 h-6 rounded-lg bg-white text-stone-700 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-stone-900">
                              {selectedQty}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(service.id, 1)}
                              className="w-6 h-6 rounded-lg bg-stone-900 text-white hover:bg-stone-800 flex items-center justify-center font-bold text-xs"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onUpdateQuantity(service.id, 1)}
                            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
                            title="Add to package basket"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Add</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Floating Bottom Bar when services are added */}
        {totalSelectedCount > 0 && (
          <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-30 max-w-md mx-auto">
            <div className="bg-stone-900 text-white p-4 rounded-2xl shadow-2xl border border-stone-800 flex items-center justify-between gap-4 animate-slide-up">
              <div className="space-y-0.5">
                <div className="text-xs text-rose-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{totalSelectedCount} Service{totalSelectedCount > 1 ? 's' : ''} Selected</span>
                </div>
                <div className="text-xs text-stone-300">
                  Ready to compute total & draft message
                </div>
              </div>

              <button
                onClick={onOpenCalculator}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm shrink-0"
              >
                View Pamper Estimate →
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
