import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaChevronDown, FaChevronUp, FaStar, FaQuoteLeft } from 'react-icons/fa';

const faqs = [
  {
    id: 1,
    question: 'Do you require deposits for appointments?',
    answer: 'Yes, a deposit should be made while booking appointments to secure your slot and ensure commitment from both parties.',
    category: 'Booking'
  },
  {
    id: 2,
    question: 'What is your cancellation policy?',
    answer: 'We require at least 24 hours notice for cancellations. Late cancellations or no-shows may incur a fee of 50% of the service cost.',
    category: 'Policies'
  },
  {
    id: 3,
    question: 'Do I need to book an appointment?',
    answer: 'Yes, we recommend booking an appointment in advance to ensure availability. Walk-ins are welcome but subject to staff availability.',
    category: 'Booking'
  },
  {
    id: 4,
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, mobile money (M-Pesa, Airtel Money), and card payments. Payment is due at the time of service.',
    category: 'Payment'
  },
  {
    id: 5,
    question: 'Can I reschedule my appointment?',
    answer: 'Yes, you can reschedule your appointment up to 12 hours before your scheduled time through the app or by calling us.',
    category: 'Booking'
  },
  {
    id: 6,
    question: 'What if I\'m running late?',
    answer: 'Please call us if you\'re running late. We\'ll try to accommodate you, but appointments may be shortened to avoid delays for other clients.',
    category: 'Policies'
  }
];

const reviews = [
  {
    id: 1,
    name: 'Giveon Alusa',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    review: 'The staff is friendly, warm, and cooperative. I had an amazing experience with my haircut and styling.',
    rating: 5,
    service: 'Hair Styling'
  },
  {
    id: 2,
    name: 'Sharmarke Mahmud',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
    review: 'I got a very relaxing full body massage from Atisa. She understands the pain areas and puts pressure in a strategic way to alleviate the pain. I\'m surely visiting again next month.',
    rating: 5,
    service: 'Spa Massage'
  },
  {
    id: 3,
    name: 'Barnice McBeth',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    review: 'I hired Ashley to do my makeup for my baby shower. Her skills are unmatched and she made me feel so beautiful on my special day.',
    rating: 5,
    service: 'Makeup'
  },
  {
    id: 4,
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    review: 'The nail art service was incredible! The attention to detail and the final result exceeded my expectations.',
    rating: 5,
    service: 'Nail Art'
  }
];

export default function FAQs() {
  const { theme, mode } = useTheme();
  const [isDesktop, setIsDesktop] = React.useState(window.innerWidth >= 900);
  const [expandedFaq, setExpandedFaq] = useState(null);

  React.useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: isDesktop ? '800px' : 'calc(100% - 2rem)',
      margin: '0 auto',
      padding: isDesktop ? '2rem' : '1rem',
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: theme.text,
      background: mode === 'dark' 
        ? 'rgba(45, 55, 72, 0.95)'
        : 'rgba(255, 255, 255, 0.95)',
      borderRadius: '24px',
      boxShadow: mode === 'dark'
        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
        : '0 8px 32px rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
      border: mode === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(255, 255, 255, 0.2)',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: isDesktop ? '2.5rem' : '2rem',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: isDesktop ? '2.5rem' : '2rem',
          fontWeight: '700',
          background: mode === 'dark'
            ? 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)'
            : 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 0.5rem 0'
        }}>
          Frequently Asked Questions
        </h1>
        <p style={{
          fontSize: isDesktop ? '1.1rem' : '1rem',
          color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Find answers to common questions about our services
        </p>
      </div>

      {/* FAQs Section */}
      <div style={{ width: '100%', marginBottom: isDesktop ? '3rem' : '2rem' }}>
        <h2 style={{
          fontSize: isDesktop ? '1.5rem' : '1.3rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: theme.text,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: theme.accent }}>❓</span>
          Common Questions
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq) => (
            <div key={faq.id} style={{
              background: mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.8)' 
                : 'rgba(248, 250, 252, 0.8)',
              borderRadius: '16px',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => toggleFaq(faq.id)}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                padding: '1.2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontWeight: '600',
                    fontSize: isDesktop ? '1rem' : '0.95rem',
                    color: theme.text,
                    marginBottom: '0.3rem'
                  }}>
                    {faq.question}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: theme.accent,
                    fontWeight: '500'
                  }}>
                    {faq.category}
                  </div>
                </div>
                <div style={{
                  color: theme.accent,
                  transition: 'transform 0.3s ease'
                }}>
                  {expandedFaq === faq.id ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
                </div>
              </div>
              
              {expandedFaq === faq.id && (
                <div style={{
                  padding: '0 1.2rem 1.2rem 1.2rem',
                  borderTop: mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.1)',
                  marginTop: '0.5rem',
                  paddingTop: '1rem'
                }}>
                  <p style={{
                    fontSize: isDesktop ? '0.95rem' : '0.9rem',
                    color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                    lineHeight: '1.6',
                    margin: 0
                  }}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ width: '100%' }}>
        <h2 style={{
          fontSize: isDesktop ? '1.5rem' : '1.3rem',
          fontWeight: '600',
          marginBottom: '1.5rem',
          color: theme.text,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ color: theme.accent }}>⭐</span>
          Customer Reviews
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {reviews.map((review) => (
            <div key={review.id} style={{
              background: mode === 'dark' 
                ? 'rgba(30, 41, 59, 0.8)' 
                : 'rgba(248, 250, 252, 0.8)',
              borderRadius: '16px',
              padding: '1.2rem',
              border: mode === 'dark' 
                ? '1px solid rgba(255, 255, 255, 0.1)' 
                : '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
            }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                marginBottom: '0.8rem'
              }}>
                <img 
                  src={review.avatar} 
                  alt={review.name} 
                  style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '2px solid rgba(233, 30, 99, 0.2)'
                  }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.3rem'
                  }}>
                    <div style={{
                      fontWeight: '600',
                      fontSize: isDesktop ? '1rem' : '0.95rem',
                      color: theme.text
                    }}>
                      {review.name}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.2rem'
                    }}>
                      {[...Array(review.rating)].map((_, i) => (
                        <FaStar key={i} size={14} color="#fbbf24" />
                      ))}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: theme.accent,
                    fontWeight: '500'
                  }}>
                    {review.service}
                  </div>
                </div>
              </div>
              
              <div style={{
                position: 'relative',
                paddingLeft: '1.5rem'
              }}>
                <FaQuoteLeft 
                  size={16} 
                  color={theme.accent}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    opacity: 0.6
                  }}
                />
                <p style={{
                  fontSize: isDesktop ? '0.95rem' : '0.9rem',
                  color: mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)',
                  lineHeight: '1.6',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  "{review.review}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 