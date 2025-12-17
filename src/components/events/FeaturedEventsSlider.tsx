'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Event } from '@/types';

type Props = {
  events: Partial<Event>[];
  renderCard: (event: Partial<Event>) => React.ReactNode;
};

export default function FeaturedEventsSlider({ events, renderCard }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    loop: events.length > 4, // loop only when it makes sense
    skipSnaps: false,
    dragFree: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  const canScrollPrev = useMemo(() => emblaApi?.canScrollPrev() ?? false, [emblaApi, selectedIndex]);
  const canScrollNext = useMemo(() => emblaApi?.canScrollNext() ?? false, [emblaApi, selectedIndex]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setSnapCount(emblaApi.scrollSnapList().length);
    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', () => {
      setSnapCount(emblaApi.scrollSnapList().length);
      onSelect();
    });

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);

  return (
    <div className="space-y-6 py-16">
      {/* Viewport */}
      <div
        ref={emblaRef}
        className="overflow-hidden"
      >
        {/* Track */}
        <div className="flex touch-pan-y -ml-4">
          {events.map((event) => (
            <div
              key={event.id || event.title}
              className="
                pl-4
                flex-[0_0_88%]
                sm:flex-[0_0_62%]
                md:flex-[0_0_48%]
                lg:flex-[0_0_34%]
                xl:flex-[0_0_28%]
              "
            >
              <div className="cursor-grab active:cursor-grabbing select-none">
                {renderCard(event)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
