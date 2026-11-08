import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Link,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flag,
  Heart,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Admin, { LoginPage } from "./pages/Admin";
import {
  AboutPage,
  AchievementsPage,
  ContactPage,
  EventDetailPage,
  EventsPage,
  FacilitiesPage,
  GalleryPage,
  MembersPage,
  NewsDetailPage,
  NewsPage,
  NotFoundPage,
  PrivacyPage,
  SportDetailPage,
  SportsPage,
} from "./pages/PortalPages";

const primaryNavigation = [
  ["/", "Beranda"],
  ["/tentang", "Tentang"],
  ["/berita", "Berita"],
  ["/event", "Event"],
  ["/cabor", "Cabor"],
  ["/galeri", "Galeri"],
];
const moreNavigation = [
  ["/prestasi", "Prestasi"],
  ["/anggota", "Anggota & Pengurus"],
  ["/fasilitas", "Fasilitas"],
  ["/kontak", "Kontak"],
];
const searchablePages = [
  ...primaryNavigation,
  ...moreNavigation,
  ["/struktur", "Struktur organisasi"],
  ["/cabor/sepak-bola", "Sepak Bola"],
  ["/cabor/atletik", "Atletik"],
  ["/cabor/bulu-tangkis", "Bulu Tangkis"],
  ["/cabor/pencak-silat", "Pencak Silat"],
  ["/event/pon-xxi", "PON XXI Aceh – Sumatera Utara"],
  ["/event/porprov-riau", "PORPROV Riau"],
  ["/event/popda-kampar", "POPDA Kampar"],
];

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document
          .getElementById(hash.slice(1))
          ?.scrollIntoView({ behavior: "instant", block: "start" }),
      );
    } else window.scrollTo({ top: 0, behavior: "instant" });
    const routeName =
      [...searchablePages].find(([path]) => path === pathname)?.[1] ||
      (pathname === "/login"
        ? "Login Demo"
        : pathname.startsWith("/admin")
          ? "Admin Demo"
          : pathname.startsWith("/berita/")
            ? "Detail Berita"
            : pathname.startsWith("/event/")
              ? "Detail Event"
              : pathname.startsWith("/cabor/")
                ? "Detail Cabang Olahraga"
                : undefined);
    document.title = `${routeName || (pathname === "/" ? "Semangat Juara" : "Portal Olahraga")} — KONI Kampar`;
  }, [pathname, hash]);
  return null;
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    dialog?.querySelector("input")?.focus();
    return () => dialog?.close();
  }, []);
  const filtered = searchablePages.filter(([, name]) =>
    name.toLocaleLowerCase("id").includes(query.toLocaleLowerCase("id")),
  );
  return (
    <dialog
      ref={dialogRef}
      className="site-search"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="search-title"
    >
      <div className="search-dialog-head">
        <h2 id="search-title">Apa yang ingin Anda temukan?</h2>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Tutup pencarian"
        >
          <X size={21} />
        </button>
      </div>
      <label className="search-input">
        <Search size={21} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari cabang olahraga, event, atau halaman…"
          aria-label="Cari di KONI Kampar"
        />
        <kbd>ESC</kbd>
      </label>
      <p className="search-caption">
        {query ? `${filtered.length} hasil ditemukan` : "Jelajahi KONI Kampar"}
      </p>
      <div className="search-results">
        {filtered.length ? (
          filtered.map(([path, name]) => (
            <Link key={path} to={path} onClick={onClose}>
              <Compass size={17} />
              <span>{name}</span>
              <ArrowUpRight size={17} />
            </Link>
          ))
        ) : (
          <p className="search-empty">
            Belum ada hasil untuk “{query}”. Coba kata kunci lain.
          </p>
        )}
      </div>
    </dialog>
  );
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node))
        setMoreOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMoreOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("click", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("click", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);
  return (
    <>
      <div className="utility-bar">
        <div className="container">
          <span>
            <Flag size={12} /> Satu tekad. Satu semangat. Kampar juara.
          </span>
          <span>
            <MapPin size={12} /> Kabupaten Kampar, Riau
          </span>
        </div>
      </div>
      <header className="site-header">
        <div className="container nav-container">
          <Link to="/" className="brand" aria-label="KONI Kampar — Beranda">
            <img
              src="/images/logo.png"
              alt="KONI Kabupaten Kampar"
              width="107"
              height="50"
            />
          </Link>
          <nav className="desktop-nav" aria-label="Navigasi utama">
            {primaryNavigation.map(([path, label]) => (
              <NavLink key={path} to={path} end={path === "/"}>
                {label}
              </NavLink>
            ))}
            <div className="more-nav" ref={moreRef}>
              <button
                className={
                  moreNavigation.some(([path]) =>
                    location.pathname.startsWith(path),
                  )
                    ? "more-trigger active"
                    : "more-trigger"
                }
                aria-expanded={moreOpen}
                aria-controls="more-menu"
                onClick={() => setMoreOpen(!moreOpen)}
              >
                Lainnya <ChevronDown size={13} />
              </button>
              {moreOpen && (
                <div className="nav-dropdown" id="more-menu">
                  {moreNavigation.map(([path, label]) => (
                    <NavLink key={path} to={path}>
                      {label}
                      <ArrowUpRight size={14} />
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
          <div className="header-actions">
            <button
              className="icon-button search-toggle"
              onClick={() => setSearchOpen(true)}
              aria-label="Buka pencarian"
            >
              <Search size={20} />
            </button>
            <span className="header-divider" />
            <Link className="header-contact" to="/kontak">
              Hubungi Kami <ArrowUpRight size={16} />
            </Link>
            <button
              className="icon-button mobile-menu-button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Navigasi mobile"
          >
            {[...primaryNavigation, ...moreNavigation].map(([path, name]) => (
              <NavLink to={path} end={path === "/"} key={path}>
                {name}
                <ArrowUpRight size={17} />
              </NavLink>
            ))}
            <Link to="/login">
              Login Administrator
              <ShieldCheck size={17} />
            </Link>
          </nav>
        )}
      </header>
      {searchOpen && <SearchDialog onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/">
              <img
                src="/images/logo.png"
                width="112"
                height="53"
                alt="KONI Kabupaten Kampar"
              />
            </Link>
            <p>
              Rumah bagi semangat, bakat, dan mimpi para juara. Bersama
              memajukan olahraga Kabupaten Kampar.
            </p>
            <span className="footer-location">
              <MapPin size={15} /> Bangkinang, Kabupaten Kampar, Riau
            </span>
          </div>
          <div>
            <h3>Tentang Kami</h3>
            <Link to="/tentang">Profil KONI Kampar</Link>
            <Link to="/tentang#visi">Visi & Misi</Link>
            <Link to="/struktur">Struktur Organisasi</Link>
            <Link to="/anggota">Anggota & Pengurus</Link>
          </div>
          <div>
            <h3>Dunia Olahraga</h3>
            <Link to="/cabor">Cabang Olahraga</Link>
            <Link to="/event">Event & Pertandingan</Link>
            <Link to="/prestasi">Prestasi Atlet</Link>
            <Link to="/fasilitas">Fasilitas Olahraga</Link>
          </div>
          <div>
            <h3>Tetap Terhubung</h3>
            <Link to="/berita">Berita & Publikasi</Link>
            <Link to="/galeri">Galeri Kegiatan</Link>
            <Link to="/kontak">Hubungi Kami</Link>
            <Link to="/login" className="admin-link">
              <ShieldCheck size={14} /> Login Administrator
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KONI Kabupaten Kampar.</p>
          <span>
            Dibangun untuk semangat <Heart size={12} /> olahraga.
          </span>
          <Link to="/privasi">Kebijakan Privasi</Link>
        </div>
        <p className="demo-source-note">
          Prototipe frontend berdasarkan desain Figma. Konten, angka, dan data
          kegiatan merupakan contoh dari desain.
        </p>
      </div>
    </footer>
  );
}

function PublicLayout() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const sports = [
  {
    name: "Sepak Bola",
    slug: "sepak-bola",
    image: "football.png",
    category: "Olahraga beregu",
    icon: "01",
  },
  {
    name: "Atletik",
    slug: "atletik",
    image: "athletics.png",
    category: "Olahraga terukur",
    icon: "02",
  },
  {
    name: "Bulu Tangkis",
    slug: "bulu-tangkis",
    image: "badminton.png",
    category: "Olahraga raket",
    icon: "03",
  },
  {
    name: "Pencak Silat",
    slug: "pencak-silat",
    image: "silat.png",
    category: "Olahraga bela diri",
    icon: "04",
  },
];
const events = [
  {
    title: "PON XXI",
    subtitle: "Pekan Olahraga Nasional XXI",
    slug: "pon-xxi",
    date: "September 2024",
    location: "Aceh – Sumatera Utara",
    level: "Nasional",
    number: "XXI",
    image: "event-pon.svg",
    athletes: "6.500+ atlet",
    sports: "40+ cabor",
    color: "red",
  },
  {
    title: "PORPROV Riau",
    subtitle: "Pekan Olahraga Provinsi Riau",
    slug: "porprov-riau",
    date: "November 2024",
    location: "Pekanbaru, Riau",
    level: "Provinsi",
    number: "XI",
    image: "event-porprov.svg",
    athletes: "3.000+ atlet",
    sports: "35+ cabor",
    color: "dark",
  },
  {
    title: "POPDA Kampar",
    subtitle: "Pekan Olahraga Pelajar Daerah",
    slug: "popda-kampar",
    date: "Maret 2025",
    location: "Bangkinang, Kampar",
    level: "Daerah",
    number: "2025",
    image: "event-popda.svg",
    athletes: "1.500+ pelajar",
    sports: "25+ cabor",
    color: "coral",
  },
];
const questions = [
  [
    "Apa itu KONI Kabupaten Kampar?",
    "KONI Kabupaten Kampar adalah Komite Olahraga Nasional Indonesia tingkat Kabupaten Kampar, wadah pembinaan dan pengembangan olahraga prestasi bersama pengurus cabang olahraga di daerah.",
  ],
  [
    "Bagaimana cara bergabung dengan cabang olahraga?",
    "Pilih cabang olahraga yang Anda minati melalui halaman Cabor, lalu hubungi pengurus terkait untuk mengetahui klub, jadwal latihan, dan persyaratan pendaftaran. Tim KONI juga dapat membantu melalui halaman Kontak.",
  ],
  [
    "Di mana saya bisa melihat jadwal pertandingan?",
    "Jadwal dan informasi kegiatan dapat Anda temukan di halaman Event. Pilih sebuah kegiatan untuk melihat lokasi, waktu pelaksanaan, dan rincian pertandingannya.",
  ],
  [
    "Apakah ada pembinaan untuk atlet pelajar?",
    "Pembinaan usia dini dan atlet pelajar menjadi bagian dari pengembangan olahraga daerah. Hubungi pengurus cabang olahraga untuk mendapatkan informasi program dan seleksi yang sesuai.",
  ],
  [
    "Bagaimana cara menghubungi KONI Kampar?",
    "Kunjungi halaman Kontak untuk melihat informasi sekretariat dan formulir pertanyaan. Pada prototipe ini, formulir menyimpan pesan sebagai draf di browser.",
  ],
];

function HomePage() {
  const [sportOffset, setSportOffset] = useState(0);
  const visibleSports = [
    ...sports.slice(sportOffset),
    ...sports.slice(0, sportOffset),
  ];
  return (
    <>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="hero-kicker">
              <span /> BERSAMA KONI KABUPATEN KAMPAR
            </div>
            <h1>
              Semangat <span className="hero-word">Juara.</span>
              <br />
              Dari Jantung Riau,
              <br />
              <span className="hero-outline">Kampar Bisa!</span>
            </h1>
            <p>
              Dari setiap sudut Kampar, lahir semangat yang tak pernah padam.
              Bersama kita tempa bakat, wujudkan mimpi, dan melangkah ke podium
              tertinggi.
            </p>
            <div className="hero-buttons">
              <Link to="/event" className="button button-primary">
                Jelajahi Event <ArrowUpRight size={18} />
              </Link>
              <Link to="/tentang" className="hero-about">
                <span>
                  <ArrowRight size={18} />
                </span>{" "}
                Kenali KONI Kampar
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-check">
                <Check size={12} />
              </div>
              <span>Wadah pembinaan olahraga prestasi Kabupaten Kampar</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-wrap">
              <img
                className="hero-image"
                src="/images/hero.png"
                alt="Ilustrasi semangat para atlet dari berbagai cabang olahraga di stadion"
                width="580"
                height="580"
                fetchPriority="high"
              />
              <div className="hero-image-shade" />
              <div className="hero-photo-label">
                <span className="live-dot" /> SATU DAERAH, BERJUTA MIMPI
              </div>
              <div className="hero-image-caption">
                <span>Dari Kampar.</span>
                <strong>Untuk Indonesia.</strong>
                <ArrowUpRight size={28} />
              </div>
            </div>
            <div className="hero-floating-card">
              <div className="floating-icon">
                <Trophy size={23} />
              </div>
              <div>
                <strong>Langkah kecil, prestasi besar.</strong>
                <span>Perjalanan juara dimulai di sini.</span>
              </div>
              <span className="floating-star">✦</span>
            </div>
            <div className="hero-corner-mark" aria-hidden="true">
              +
            </div>
          </div>
        </div>
        <div className="container hero-bottom">
          <a href="#tentang-koni" className="scroll-cue">
            <span>
              <ArrowDown size={15} />
            </span>{" "}
            Kenali semangat kami
          </a>
          <div className="hero-stats">
            <div>
              <strong>
                78<span>+</span>
              </strong>
              <p>Cabang Olahraga</p>
            </div>
            <div>
              <strong>06</strong>
              <p>Organisasi Fungsional</p>
            </div>
            <div className="stat-purpose">
              <Flag size={21} />
              <p>
                Satu tujuan.
                <br />
                <strong>Kampar Juara.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section" id="tentang-koni">
        <div className="container about-grid">
          <div className="about-visual">
            <div className="about-image-frame">
              <img
                src="/images/about.png"
                alt="Ilustrasi pembinaan olahraga di Kabupaten Kampar dengan latar rumah adat"
                width="576"
                height="414"
                loading="lazy"
              />
            </div>
            <div className="about-stamp">
              <ShieldCheck size={24} />
              <span>
                Bersama membina.
                <br />
                <strong>Bersama menjadi juara.</strong>
              </span>
            </div>
            <span className="about-index">01 / TENTANG KAMI</span>
          </div>
          <div className="about-copy">
            <span className="eyebrow">
              <span /> LEBIH DARI SEKADAR OLAHRAGA
            </span>
            <h2>
              Rumah bagi bakat.
              <br />
              Tempat lahirnya <em>juara.</em>
            </h2>
            <p>
              Setiap prestasi besar dimulai dari kesempatan. KONI Kampar hadir
              untuk menyalurkan energi dan menempa mental putra-putri terbaik
              daerah.
            </p>
            <p>
              Bersama cabang olahraga, pelatih, dan masyarakat, kami membangun
              ekosistem olahraga yang tumbuh, berdaya, dan membanggakan Kampar.
            </p>
            <div className="about-values">
              <span>
                <Check size={15} /> Pembinaan berkelanjutan
              </span>
              <span>
                <Check size={15} /> Semangat sportivitas
              </span>
            </div>
            <Link to="/tentang" className="text-link">
              Lebih dekat dengan KONI Kampar <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-sports">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span /> TEMUKAN POTENSIMU
              </span>
              <h2>
                Banyak cabang.
                <br className="mobile-break" /> Satu <em>semangat.</em>
              </h2>
              <p>Temukan arena Anda. Mulai perjalanan menuju prestasi.</p>
            </div>
            <div className="section-actions">
              <button
                className="round-button"
                aria-label="Cabang olahraga sebelumnya"
                onClick={() => setSportOffset((sportOffset + 3) % 4)}
              >
                <ChevronLeft size={19} />
              </button>
              <button
                className="round-button"
                aria-label="Cabang olahraga berikutnya"
                onClick={() => setSportOffset((sportOffset + 1) % 4)}
              >
                <ChevronRight size={19} />
              </button>
              <Link to="/cabor" className="text-link">
                Semua Cabor <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="home-sports-grid">
            {visibleSports.map((sport) => (
              <Link
                className="home-sport-card"
                to={`/cabor/${sport.slug}`}
                key={sport.slug}
              >
                <div className="sport-card-top">
                  <span>{sport.category}</span>
                  <small>{sport.icon}</small>
                </div>
                <div className="sport-art">
                  <img
                    src={`/images/${sport.image}`}
                    alt={`Ilustrasi ${sport.name}`}
                    width="344"
                    height="256"
                    loading="lazy"
                  />
                </div>
                <div className="sport-card-bottom">
                  <h3>{sport.name}</h3>
                  <span>
                    <ArrowUpRight size={20} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-events">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span /> DI DALAM & DI LUAR ARENA
              </span>
              <h2>
                Momen besar.
                <br className="mobile-break" /> Semangat <em>tanpa batas.</em>
              </h2>
              <p>Jejak kompetisi yang menyatukan semangat para juara.</p>
            </div>
            <Link to="/event" className="button button-outline">
              Jelajahi Semua Event <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="home-events-grid">
            {events.map((event) => (
              <Link
                to={`/event/${event.slug}`}
                className="home-event-card"
                key={event.slug}
              >
                <div className={`event-art event-art-${event.color}`}>
                  <img
                    src={`/images/${event.image}`}
                    alt={event.title}
                    loading="lazy"
                  />
                  <span className="event-status">
                    <Check size={11} /> Selesai
                  </span>
                </div>
                <div className="event-card-body">
                  <div className="event-meta">
                    <span className={`badge badge-${event.color}`}>
                      {event.level}
                    </span>
                    <span>
                      <CalendarDays size={13} /> {event.date}
                    </span>
                  </div>
                  <h3>
                    {event.title}
                    <ArrowUpRight size={18} />
                  </h3>
                  <p>{event.subtitle}</p>
                  <span className="event-location">
                    <MapPin size={14} />
                    {event.location}
                  </span>
                  <div className="event-card-footer">
                    <span>
                      <Users size={14} /> {event.athletes}
                    </span>
                    <span>
                      <Flag size={14} /> {event.sports}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-callout">
        <div className="container callout-content">
          <div className="callout-icon">
            <Trophy size={36} strokeWidth={1.5} />
          </div>
          <div>
            <span>BAKAT HEBAT ADA DI MANA SAJA.</span>
            <h2>Mungkin juara berikutnya adalah Anda.</h2>
            <p>
              Temukan cabang olahraga, bergabung, dan mulai perjalanan Anda.
            </p>
          </div>
          <Link to="/cabor" className="button button-white">
            Temukan Cabang Olahraga <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>

      <section className="section home-faq">
        <div className="container faq-grid">
          <div>
            <span className="eyebrow">
              <span /> MARI MENGENAL LEBIH DEKAT
            </span>
            <h2>
              Ada yang ingin
              <br />
              Anda <em>tanyakan?</em>
            </h2>
            <p>
              Beberapa hal yang mungkin ingin Anda ketahui tentang KONI Kampar.
            </p>
            <Link to="/kontak" className="text-link">
              Hubungi tim kami <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="faq-list">
            {questions.map(([question, answer], i) => (
              <details key={question} className="faq-item">
                <summary>
                  <span className="faq-number">0{i + 1}</span>
                  <span>{question}</span>
                  <span className="faq-plus" aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <a href="#main-content" className="skip-link">
        Langsung ke konten utama
      </a>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="tentang" element={<AboutPage />} />
          <Route path="berita" element={<NewsPage />} />
          <Route path="berita/:slug" element={<NewsDetailPage />} />
          <Route path="event" element={<EventsPage />} />
          <Route path="event/:slug" element={<EventDetailPage />} />
          <Route path="cabor" element={<SportsPage />} />
          <Route path="cabor/:slug" element={<SportDetailPage />} />
          <Route path="galeri" element={<GalleryPage />} />
          <Route path="prestasi" element={<AchievementsPage />} />
          <Route path="anggota" element={<MembersPage />} />
          <Route path="struktur" element={<MembersPage />} />
          <Route path="fasilitas" element={<FacilitiesPage />} />
          <Route path="kontak" element={<ContactPage />} />
          <Route path="privasi" element={<PrivacyPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="admin/*" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}
