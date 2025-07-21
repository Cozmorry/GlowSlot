import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaXTwitter, FaFacebook, FaInstagram } from 'react-icons/fa6';

const isDesktopWidth = () => window.innerWidth >= 900;

export default function About() {
  const { theme, mode } = useTheme();
  const isDesktop = isDesktopWidth();
  // Use a lighter card background for mobile dark mode
  const cardBg = isDesktop
    ? theme.card
    : (mode === 'dark' ? '#232323' : '#e6b8e6');

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
      color: theme.text,
    }}>
      <h2 style={{ fontWeight: 700, fontSize: isDesktop ? 28 : 22, marginBottom: 12, color: theme.text, alignSelf: 'flex-start', marginLeft: isDesktop ? 0 : 8, letterSpacing: 2 }}>ABOUT U S</h2>
      <div style={{
        width: '100%',
        background: cardBg,
        borderRadius: 18,
        boxShadow: '0 2px 12px 0 #222',
        padding: 0,
        overflow: 'hidden',
        border: isDesktop ? undefined : `1.5px solid ${mode === 'dark' ? '#444' : '#e3c6f7'}`,
        color: theme.text,
      }}>
        <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" alt="GlowSlot Team" style={{ width: '100%', height: 90, objectFit: 'cover', borderTopLeftRadius: 18, borderTopRightRadius: 18 }} />
        <div style={{ padding: '1.2rem 1.2rem 1.2rem 1.2rem', fontSize: 15, color: theme.text }}>
          <div style={{ fontWeight: 700, marginBottom: 10, fontSize: 17 }}>Welcome to GlowSlot!</div>
          <div style={{ marginBottom: 14, lineHeight: 1.6 }}>
            At GlowSlot, we make it easy to book spa, hair, and nail appointments with our best beauty experts. Our goal is to help you take care of yourself with minimal hassle.
          </div>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>Our Story</div>
          <div style={{ marginBottom: 14, lineHeight: 1.6 }}>
            Founded in 2024, <b>GlowSlot</b> was created to simplify the process of booking beauty and wellness appointments. We wanted to eliminate the inconvenience of phone calls and difficult scheduling, providing a straightforward, user-friendly platform instead.
          </div>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>What We Offer</div>
          <ul style={{ margin: 0, marginBottom: 14, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>Variety of Services: Whether you’re looking for a relaxing spa treatment, a fresh haircut, or beautiful nails, our app connects you with top-rated services.</li>
            <li>Trusted Providers: We work with reputable salons and spas to ensure you get quality care.</li>
            <li>Simple Booking: Easily find available times, choose your service provider, and book your appointment in just a few taps.</li>
            <li>Special Deals: Access exclusive promotions and discounts through our app.</li>
          </ul>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>Why Choose Us?</div>
          <ul style={{ margin: 0, marginBottom: 14, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>Convenience: Book appointments anytime, anywhere.</li>
            <li>Real Reviews: Check out reviews from other users to make informed decisions.</li>
            <li>Personalized Options: Save your favorite spots, track your appointments, and get recommendations tailored to you.</li>
          </ul>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>Our Team</div>
          <div style={{ marginBottom: 14, lineHeight: 1.6 }}>
            We are a team of tech enthusiasts and beauty lovers dedicated to making self-care more accessible. Our mission is to connect you with the treatments you love in the most convenient way possible.
          </div>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>Join Us</div>
          <div style={{ marginBottom: 14, lineHeight: 1.6 }}>
            Stay connected by following us on social media or subscribing to our newsletter for updates and special offers. We’re here to make your self-care routine as smooth as possible.
          </div>
          <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 16 }}>Contact Us</div>
          <div style={{ marginBottom: 12, lineHeight: 1.6 }}>
            We’d love to hear from you! If you have any questions, feedback, or suggestions, reach out to us at:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FaXTwitter size={20} />
            <span>@glow_slot</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FaFacebook size={20} />
            <span>GLOW SLOT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <FaInstagram size={20} />
            <span>glowslot</span>
          </div>
          <div style={{ marginBottom: 8 }}>
            Call us at:<br />
            <b>+254712345689</b><br />
            or send us an email at <br />
            <b>glowslot@info.co.ke</b>
          </div>
        </div>
      </div>
    </div>
  );
} 