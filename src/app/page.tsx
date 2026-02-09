import Link from 'next/link';
import { Camera, Sparkles, Zap, Shield, ArrowRight, Quote } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  const examples = [
    {
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
      tag: "Soft Sell",
      caption: "Mornings are better with a view and the perfect roast. ☕️ Discover our new seasonal blend - link in bio to shop.",
      hashtags: "#CoffeeLover #MorningVibes #LuxuryCoffee"
    },
    {
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
      tag: "Viral Hook",
      caption: "POV: You finally reached the top and the world went quiet. 🏔️ If you're seeing this, it's your sign to book that trip.",
      hashtags: "#AdventureAwaits #Hiking #BucketList"
    },
    {
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
      tag: "Professional",
      caption: "A clean space leads to a clear mind. 💻 Optimized my workflow today with minimalism and focused light. Efficiency is key.",
      hashtags: "#WorkFromHome #Setup #ProductivityHacks"
    }
  ];

  const testimonials = [
    {
      text: "Caption X-Ray has saved me hours of creative block. The psychological triggers actually work!",
      name: "Sarah Jenkins",
      title: "Social Media Manager",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    },
    {
      text: "I used the 'Go Viral' setting on my last Reel and it got 5x the engagement I usually get. Incredible.",
      name: "Marc Thompson",
      title: "Content Creator",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
    },
    {
      text: "The way it understands the 'vibe' of the lighting in my photos is scary good. New favorite tool.",
      name: "Elena Rodriguez",
      title: "Lifestyle Blogger",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
    }
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.heroBackground}>
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <header className={styles.header}>
        <div className={styles.brand}>
          <Camera className={styles.brandIcon} size={24} />
          <span>Caption AI</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/login" className={`${styles.navBtn} ${styles.btnGhost}`}>Log In</Link>
          <Link href="/signup" className={`${styles.navBtn} ${styles.btnPrimary}`}>Get Started</Link>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.pill}>
            <Sparkles size={14} />
            <span>Used by 5,000+ Creators</span>
          </div>

          <h1 className={styles.heroTitle}>
            Stop Writing <br />
            <span className={styles.gradientText}>Boring Captions.</span>
          </h1>

          <p className={styles.heroSub}>
            Turn your photos into viral hooks and story-driven posts instantly.
            The only AI that understands <strong>human psychology</strong>, not just pixels.
          </p>

          <div className={styles.ctaGroup}>
            <Link href="/signup" className={`${styles.ctaBtn} ${styles.primaryCta}`}>
              Start Creating Free <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Examples Section */}
        <section className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Real Results. Real Impact.</h2>
            <p className={styles.sectionSub}>See how Caption AI transforms basic photos into high-engagement content.</p>
          </div>

          <div className={styles.examplesGrid}>
            {examples.map((item, i) => (
              <div key={i} className={styles.exampleCard}>
                <img src={item.image} alt="Example" className={styles.exampleImage} />
                <div className={styles.exampleContent}>
                  <div className={styles.exampleTag}>{item.tag}</div>
                  <p className={styles.exampleCaption}>&quot;{item.caption}&quot;</p>
                  <p className={styles.exampleHashtags}>{item.hashtags}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Engineered for Growth</h2>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconBox}><Zap size={24} /></div>
              <h3 className={styles.cardTitle}>Outcome Driven</h3>
              <p className={styles.cardText}>Don't settle for generic descriptions. Choose exactly what you want: Comments, Sales, or Shares.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconBox}><Shield size={24} /></div>
              <h3 className={styles.cardTitle}>Platform Native</h3>
              <p className={styles.cardText}>We know the difference between a LinkedIn thought-leader post and a TikTok viral hook.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconBox}><Sparkles size={24} /></div>
              <h3 className={styles.cardTitle}>Visual IQ</h3>
              <p className={styles.cardText}>Our model analyzes mood and lighting to write captions that actually match the photo's vibe.</p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.sectionWrapper}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Loved by Creators</h2>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <Quote className={styles.quoteIcon} size={40} />
                <p>&quot;{t.text}&quot;</p>
                <div className={styles.userProfile}>
                  <img src={t.avatar} alt={t.name} className={styles.avatar} />
                  <div className={styles.userInfo}>
                    <h4>{t.name}</h4>
                    <p>{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/app" className={styles.footerLink}>Dashboard</Link>
          <Link href="/history" className={styles.footerLink}>History</Link>
          <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
          <Link href="#" className={styles.footerLink}>Terms of Service</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Caption AI. All rights reserved. Crafted for the speed of social.</p>
      </footer>
    </div>
  );
}
