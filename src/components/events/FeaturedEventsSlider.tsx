'use client';

import React, { useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Event } from '@/types';

type Props = {
  events: Partial<Event>[];
  renderCard: (event: Partial<Event>) => React.ReactNode;
};

export default function FeaturedEventsSlider({ events, renderCard }: Props) {
  const autoplay = useRef(
    Autoplay({
      delay: 2500,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef] = useEmblaCarousel(
    {
      align: 'start',
      loop: true,
      containScroll: false,
      skipSnaps: false,
      dragFree: false,
    },
    [autoplay.current]
  );

  return (
    <div className="py-16">
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden touch-pan-y">
        {/* Track */}
        <div className="flex -ml-4">
          {events.map((event, index) => (
            <div
              key={event.id ?? event.title ?? index}
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
