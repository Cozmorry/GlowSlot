import React from 'react';
import { useTheme } from '../context/ThemeContext';

const faqs = [
  {
    name: 'Don Lucas',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    q: 'Do you require deposits for appointments?',
    a: 'Yes, a deposit should be made while booking appointments.',
  },
  {
    name: 'Anne Shirley',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    q: 'What is your cancellation policy?',
    a: 'We require at least 24 hours’ notice for cancellations. Late cancellations or no-shows may incur a fee.',
  },
  {
    name: 'Michael Daniel',
    avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
    q: 'Do I need to book an appointment?',
    a: 'Yes, we recommend booking an appointment in advance to ensure availability. Walk-ins are welcome but subject to availability.',
  },
];

const reviews = [
  {
    name: 'Giveon Alusa',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    review: 'The staff is friendly, warm, and cooperative',
  },
  {
    name: 'Sharmarke Mahmud',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
    review: 'I got a very relaxing full body massage from Atisa. She understands the pain areas and puts pressure in a strategic way to alleviate the pain. I’m surely visiting again next month.',
  },
  {
    name: 'Barnice McBeth',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    review: 'I hired Ashley to do my makeup for my baby shower. Her skills are unmatched.',
  },
];

export default function FAQs() {
  const { theme } = useTheme();
  const isDesktop = window.innerWidth >= 900;
  const cardBg = isDesktop ? theme.card : '#e6b8e6';

  return (
    <div style={{
      width: isDesktop ? '95%' : '100%',
      maxWidth: isDesktop ? 1100 : 430,
      margin: '0 auto',
      boxSizing: 'border-box',
      overflowX: 'hidden',
      padding: isDesktop ? '2rem 0' : '1rem 0',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: theme.background,
    }}>
      <h2 style={{ fontWeight: 700, fontSize: isDesktop ? 28 : 24, marginBottom: 18, color: theme.text, alignSelf: 'flex-start', marginLeft: isDesktop ? 0 : 8 }}>FAQs</h2>
      <div style={{ width: '100%' }}>
        {faqs.map((faq, idx) => (
          <div key={idx} style={{
            background: cardBg,
            color: theme.text,
            borderRadius: 18,
            boxShadow: '0 2px 8px 0 #bbb',
            marginBottom: 18,
            padding: 0,
            overflow: 'hidden',
            border: isDesktop ? undefined : '1px solid #e3c6f7',
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.2rem 0.2rem 1.2rem' }}>
              <img src={faq.avatar} alt={faq.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
              <span style={{ fontWeight: 600, fontSize: 16, color: theme.text }}>{faq.name}</span>
            </div>
            <div style={{ padding: '0.2rem 1.2rem 0.2rem 1.2rem', fontWeight: 500, fontSize: 15, color: theme.text }}>{faq.q}</div>
            <div style={{ padding: '0.2rem 1.2rem 0.2rem 1.2rem', fontSize: 13, color: theme.text, opacity: 0.7, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>GlowSlot</span>
              <span role="img" aria-label="verified">✔️</span>
            </div>
            <div style={{ padding: '0.2rem 1.2rem 1rem 1.2rem', fontSize: 15, color: theme.text }}>{faq.a}</div>
          </div>
        ))}
      </div>
      <h2 style={{ fontWeight: 700, fontSize: isDesktop ? 28 : 22, margin: '18px 0 12px 0', color: theme.text, alignSelf: 'flex-start', marginLeft: isDesktop ? 0 : 8 }}>REVIEWS</h2>
      <div style={{ width: '100%' }}>
        {reviews.map((r, idx) => (
          <div key={idx} style={{
            background: cardBg,
            color: theme.text,
            borderRadius: 18,
            boxShadow: '0 2px 8px 0 #bbb',
            marginBottom: 18,
            padding: 0,
            overflow: 'hidden',
            border: isDesktop ? undefined : '1px solid #e3c6f7',
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1rem 1.2rem 0.2rem 1.2rem' }}>
              <img src={r.avatar} alt={r.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
              <span style={{ fontWeight: 600, fontSize: 16, color: theme.text }}>{r.name}</span>
            </div>
            <div style={{ padding: '0.2rem 1.2rem 1rem 1.2rem', fontSize: 15, color: theme.text }}>{r.review}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 