import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';

const testimonials = [
  {
    text: 'We wanted to take a moment to express our heartfelt gratitude to you for your tireless efforts in making our trip truly exceptional. Your remarkable skill in planning our itinerary was so impressive, and your care and dedication in putting together our schedule were immensely appreciated. We firmly believe our trip wouldn\'t have gone as smoothly as it did without your expertise.'
  },
  {
    text: 'Everyone at King + Carter has been unfailingly kind, patient and efficient in handling my various – often unusual – requests. I am grateful for their support and would unhesitatingly recommend King + Carter Elite membership to everyone seeking to lead a more productive life.'
  },
  {
    text: 'The level of service provided by King + Carter is truly unparalleled. From securing impossible reservations to arranging bespoke travel experiences, they consistently exceed expectations. Their attention to detail and commitment to excellence is remarkable.'
  },
  {
    text: 'As a busy executive, having King + Carter as my lifestyle partner has been transformative. They handle everything seamlessly, allowing me to focus on what matters most. Their global network and expertise are invaluable.'
  },
  {
    text: 'King + Carter has opened doors I never knew existed. Their connections and insider access to exclusive events and experiences have enriched my life immeasurably. I cannot imagine life without their support.'
  }
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className={styles.testimonialsSection}>
      <h2 className={styles.sectionTitle}>Here's what our members have to say</h2>
      <p className={styles.testimonialText}>{testimonials[current].text}</p>
      <div className={styles.dots}>
        {testimonials.map((_, i) => (
          <button
            key={i}
            className={i === current ? styles.activeDot : styles.dot}
            onClick={() => setCurrent(i)}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
