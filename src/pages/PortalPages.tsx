import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Mail,
  MapPin,
  Medal,
  MessageSquare,
  Phone,
  Search,
  Send,
  Target,
  Trophy,
  Users,
  Video,
  X,
} from "lucide-react";
import "./portal.css";

const asset = (name: string) => `/images/${name}`;
const note =
  "Konten dan angka pada prototipe ini mengikuti contoh desain Figma.";

function PageIntro({
  label,
  title,
  accent,
  description,
}: {
  label: string;
  title: string;
  accent?: string;
  description: string;
}) {
  return (
    <header className="portal-intro">
      <div className="container">
        <div className="portal-breadcrumb">
          <Link to="/">Beranda</Link>
          <span>/</span>
          <span>{label}</span>
        </div>
        <p className="eyebrow">{label}</p>
        <h1>
          {title} {accent && <span>{accent}</span>}
        </h1>
        <p className="portal-intro-description">{description}</p>
      </div>
    </header>
  );
}
function SourceNote() {
  return <p className="portal-source">{note}</p>;
}
function Empty({
  children,
  reset,
}: {
  children: ReactNode;
  reset?: () => void;
}) {
  return (
    <div className="portal-empty">
      <Search size={30} />
      <h3>Belum ada hasil yang cocok</h3>
      <p>{children}</p>
      {reset && (
        <button className="button button-outline" onClick={reset}>
          Reset pencarian
        </button>
      )}
    </div>
  );
}
function Chips({
  values,
  selected,
  onSelect,
  label = "Filter kategori",
}: {
  values: string[];
  selected: string;
  onSelect: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="portal-chips" role="group" aria-label={label}>
      {values.map((value) => (
        <button
          key={value}
          aria-pressed={selected === value}
          className={selected === value ? "selected" : ""}
          onClick={() => onSelect(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}
function SearchField({
  value,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="portal-search">
      <Search size={19} aria-hidden="true" />
      <span className="portal-sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => setValue("")} aria-label="Hapus pencarian">
          <X size={17} />
        </button>
      )}
    </label>
  );
}
function JoinBanner({
  title = "Bersama, kita lahirkan juara.",
  description = "Punya semangat olahraga? Temukan cabang olahraga dan mulai perjalanan prestasimu bersama KONI Kampar.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <aside className="portal-join">
      <div>
        <p className="eyebrow">DARI KAMPAR UNTUK INDONESIA</p>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <Link className="button" to="/kontak">
        Hubungi kami <ArrowRight size={17} />
      </Link>
    </aside>
  );
}

const newsItems = [
  {
    slug: "makna-emas-sea-games-2025",
    category: "Prestasi",
    date: "2 Januari 2026",
    title: "Makna Emas SEA Games 2025 bagi Edgar Xavier",
    description:
      "Perpisahan manis dan spesial untuk calon buah hati. Kisah dedikasi di balik podium tertinggi.",
    image: "portal-news-1.png",
  },
  {
    slug: "atlet-kampar-raih-medali",
    category: "Prestasi",
    date: "1 Januari 2026",
    title: "Semangat juara: atlet Kampar raih medali di kejuaraan nasional",
    description:
      "Perjuangan, kerja keras, dan dukungan bersama mengantarkan atlet menuju prestasi terbaik.",
    image: "portal-news-2.png",
  },
  {
    slug: "pelatihan-atlet-muda",
    category: "Pembinaan",
    date: "31 Desember 2025",
    title: "KONI Kampar gelar pelatihan untuk atlet muda",
    description:
      "Membangun fondasi yang kuat melalui program latihan terarah dan pembinaan berkelanjutan.",
    image: "portal-news-3.png",
  },
  {
    slug: "persiapan-porprov-2026",
    category: "Kegiatan",
    date: "30 Desember 2025",
    title: "Menuju Porprov 2026, Kampar siapkan talenta terbaik",
    description:
      "Sinergi pengurus, pelatih, dan atlet untuk membawa nama Kampar ke panggung olahraga Riau.",
    image: "portal-news-4.png",
  },
];
function NewsCard({ item }: { item: (typeof newsItems)[number] }) {
  return (
    <Link className="portal-news-card" to={`/berita/${item.slug}`}>
      <div className="portal-card-image">
        <img
          src={asset(item.image)}
          alt="Dokumentasi olahraga dari desain KONI Kampar"
          loading="lazy"
        />
        <span className="portal-image-arrow">
          <ArrowRight size={20} />
        </span>
      </div>
      <div className="portal-card-body">
        <div className="portal-card-meta">
          <span className="badge">{item.category}</span>
          <span>{item.date}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <span className="portal-text-link">
          Baca selengkapnya <ArrowRight size={16} />
        </span>
      </div>
    </Link>
  );
}

export function AboutPage() {
  return (
    <>
      <PageIntro
        label="Tentang kami"
        title="Mengobarkan semangat juara"
        accent="dari jantung Kampar."
        description="Rumah bagi talenta, tempat tumbuhnya semangat, dan langkah bersama menuju prestasi olahraga yang membanggakan."
      />
      <section className="section">
        <div className="container portal-split">
          <div className="portal-about-image">
            <img
              src={asset("portal-about-hero.png")}
              alt="Ilustrasi atlet berlari dengan semangat juara"
            />
            <span className="portal-image-caption">
              <Trophy size={22} /> Satu semangat. Satu tujuan.
            </span>
          </div>
          <div className="portal-prose">
            <p className="eyebrow">MENGENAL KONI KAMPAR</p>
            <h2>
              Setiap potensi layak mendapatkan <span>kesempatan.</span>
            </h2>
            <p>
              Komite Olahraga Nasional Indonesia Kabupaten Kampar menjadi wadah
              pembinaan dan pengembangan prestasi olahraga di Bumi Serambi
              Mekkah. Bersama para pengurus cabang olahraga, pelatih, dan atlet,
              kami membangun ekosistem yang mendukung perjalanan menuju podium.
            </p>
            <p>
              Dari pembinaan usia muda hingga penguatan mental juara, setiap
              langkah ditujukan untuk mengantarkan potensi daerah ke tingkat
              regional, nasional, dan internasional.
            </p>
            <Link className="button button-primary" to="/cabor">
              Kenali cabang olahraga <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>
      <section className="section portal-soft" id="visi">
        <div className="container">
          <div className="portal-section-title">
            <p className="eyebrow">ARAH LANGKAH KAMI</p>
            <h2>Visi besar. Langkah nyata.</h2>
          </div>
          <div className="portal-vision-grid">
            <article className="portal-vision">
              <Target size={34} />
              <h3>Visi kami</h3>
              <p>
                Menjadikan Kabupaten Kampar sebagai lumbung atlet berkarakter,
                berdaya saing, dan bermental juara yang mampu mengharumkan nama
                daerah di tingkat regional, nasional, dan internasional.
              </p>
            </article>
            <div className="portal-missions">
              {[
                "Meningkatkan kualitas pembinaan atlet secara terukur.",
                "Menjunjung sportivitas dan mengembangkan potensi generasi muda.",
                "Mengembangkan fasilitas dan kesejahteraan insan olahraga.",
                "Memperkuat kolaborasi dengan sektor publik dan swasta.",
              ].map((text, i) => (
                <article key={text}>
                  <span>0{i + 1}</span>
                  <p>{text}</p>
                  <CheckCircle2 size={20} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container portal-split">
          <div className="portal-prose">
            <p className="eyebrow">BERSAMA MEMBANGUN PRESTASI</p>
            <h2>
              Orang-orang di balik <span>perjuangan.</span>
            </h2>
            <p>
              Prestasi tumbuh dari kolaborasi. Kenali struktur organisasi dan
              peran para pengurus yang mendampingi perjalanan olahraga Kampar.
            </p>
            <Link className="button button-outline" to="/anggota">
              Lihat kepengurusan <ArrowRight size={17} />
            </Link>
          </div>
          <img
            className="portal-building"
            src={asset("portal-building.png")}
            alt="Gedung KONI Kampar pada referensi desain"
            loading="lazy"
          />
        </div>
        <div className="container">
          <SourceNote />
        </div>
      </section>
    </>
  );
}

export function NewsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const filtered = newsItems.filter(
    (n) =>
      (category === "Semua" || n.category === category) &&
      `${n.title} ${n.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        label="Berita & cerita"
        title="Kabar dari lapangan."
        accent="Inspirasi untuk kita."
        description="Cerita perjuangan, kabar prestasi, dan langkah terbaru pembinaan olahraga KONI Kampar."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div className="portal-toolbar">
            <Chips
              values={["Semua", "Prestasi", "Pembinaan", "Kegiatan"]}
              selected={category}
              onSelect={setCategory}
            />
            <SearchField
              value={query}
              setValue={setQuery}
              placeholder="Cari berita..."
            />
          </div>
          <p className="portal-result-count" aria-live="polite">
            {filtered.length} berita ditemukan
          </p>
          {filtered.length ? (
            <div className="portal-grid portal-grid-3">
              {filtered.map((item) => (
                <NewsCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <Empty
              reset={() => {
                setQuery("");
                setCategory("Semua");
              }}
            >
              Coba kata kunci lain atau pilih kategori yang berbeda.
            </Empty>
          )}
          <SourceNote />
        </div>
      </section>
    </>
  );
}

export function NewsDetailPage() {
  const { slug } = useParams();
  const item = newsItems.find((n) => n.slug === slug);
  const [copied, setCopied] = useState(false);
  if (!item) return <NotFoundPage />;
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <section className="section">
      <article className="container portal-article">
        <Link className="portal-back" to="/berita">
          <ArrowLeft size={17} /> Kembali ke berita
        </Link>
        <div className="portal-card-meta">
          <span className="badge">{item.category}</span>
          <span>
            <CalendarDays size={15} /> {item.date}
          </span>
          <span>4 menit baca</span>
        </div>
        <h1>{item.title}</h1>
        <p className="portal-article-lead">{item.description}</p>
        <img
          className="portal-article-image"
          src={asset(item.image)}
          alt="Dokumentasi olahraga pada berita"
        />
        <div className="portal-prose">
          <p>
            Setiap pencapaian berawal dari proses yang panjang. Latihan,
            disiplin, dan dukungan orang-orang di sekitar atlet menjadi bagian
            dari perjalanan menuju prestasi.
          </p>
          <h2>Semangat yang terus tumbuh</h2>
          <p>
            {slug === "makna-emas-sea-games-2025"
              ? "Dalam contoh artikel pada desain, Edgar Xavier diceritakan mempersembahkan medali emas pada penampilan terakhirnya di SEA Games 2025. Perjalanan itu menjadi gambaran dedikasi seorang atlet untuk keluarga dan olahraga Indonesia."
              : "Program pembinaan yang berkelanjutan memberi ruang bagi para atlet untuk mengasah kemampuan dan membangun kepercayaan diri. Kerja sama pengurus cabang olahraga dan pelatih menjadi fondasi yang penting."}
          </p>
          <p className="portal-article-highlight">
            Prestasi tumbuh dari semangat yang dijaga, latihan yang konsisten,
            dan perjuangan yang dilakukan bersama.
          </p>
          <h2>Dukungan untuk perjalanan berikutnya</h2>
          <p>
            Ketersediaan fasilitas, pendampingan pelatih, dan kesempatan
            berkompetisi membantu talenta muda untuk berkembang. Semangat inilah
            yang ingin dibawa KONI Kampar dalam setiap kegiatan pembinaan
            olahraga.
          </p>
          <p>
            Ikuti informasi cabang olahraga dan agenda kegiatan untuk mengenal
            lebih jauh ekosistem olahraga Kampar.
          </p>
        </div>
        <div className="portal-article-share">
          <span>Bagikan cerita ini</span>
          <button className="button button-outline" onClick={copyLink}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Tautan disalin" : "Salin tautan"}
          </button>
        </div>
        <SourceNote />
        <div className="portal-section-title">
          <p className="eyebrow">TERUS TERINSPIRASI</p>
          <h2>Cerita lainnya</h2>
        </div>
        <div className="portal-grid portal-grid-3">
          {newsItems
            .filter((n) => n.slug !== slug)
            .slice(0, 3)
            .map((n) => (
              <NewsCard key={n.slug} item={n} />
            ))}
        </div>
      </article>
    </section>
  );
}

const eventItems = [
  {
    slug: "pon-xxi",
    title: "PON XXI",
    subtitle: "Pekan Olahraga Nasional XXI",
    category: "Nasional",
    date: "September 2024",
    location: "Aceh – Sumatera Utara",
    athletes: "6.500+",
    sports: "40+",
    image: "event-pon.svg",
    status: "Selesai",
    year: "2024",
  },
  {
    slug: "porprov-riau",
    title: "PORPROV Riau",
    subtitle: "Pekan Olahraga Provinsi Riau",
    category: "Provinsi",
    date: "November 2024",
    location: "Pekanbaru, Riau",
    athletes: "3.000+",
    sports: "35+",
    image: "event-porprov.svg",
    status: "Selesai",
    year: "2024",
  },
  {
    slug: "popda-kampar",
    title: "POPDA Kampar",
    subtitle: "Pekan Olahraga Pelajar Daerah",
    category: "Daerah",
    date: "Maret 2025",
    location: "Bangkinang, Kampar",
    athletes: "1.500+",
    sports: "25+",
    image: "event-popda.svg",
    status: "Selesai",
    year: "2025",
  },
  {
    slug: "sea-games-2025",
    title: "SEA Games 2025",
    subtitle: "Southeast Asian Games",
    category: "Internasional",
    date: "Desember 2025",
    location: "Thailand",
    athletes: "5.000+",
    sports: "50+",
    image: "portal-event-sea.svg",
    status: "Selesai",
    year: "2025",
  },
  {
    slug: "porkab-kampar",
    title: "PORKAB Kampar",
    subtitle: "Pekan Olahraga Kabupaten Kampar",
    category: "Kabupaten",
    date: "Juni 2025",
    location: "Bangkinang, Kampar",
    athletes: "2.000+",
    sports: "30+",
    image: "portal-event-porkab.svg",
    status: "Selesai",
    year: "2025",
  },
  {
    slug: "pon-xxii",
    title: "PON XXII",
    subtitle: "Pekan Olahraga Nasional XXII",
    category: "Nasional",
    date: "2028",
    location: "Jawa Tengah – DIY",
    athletes: "7.000+",
    sports: "45+",
    image: "portal-event-pon22.svg",
    status: "Rencana",
    year: "2028",
  },
];
function EventCard({ item }: { item: (typeof eventItems)[number] }) {
  return (
    <Link className="portal-event-card" to={`/event/${item.slug}`}>
      <div className="portal-event-visual">
        <img src={asset(item.image)} alt={item.title} />
        <span
          className={`portal-event-status ${item.status === "Rencana" ? "planned" : ""}`}
        >
          {item.status}
        </span>
      </div>
      <div className="portal-card-body">
        <div className="portal-card-meta">
          <span className="badge">{item.category}</span>
          <span>
            <CalendarDays size={14} />
            {item.date}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.subtitle}</p>
        <p className="portal-location">
          <MapPin size={15} />
          {item.location}
        </p>
        <div className="portal-card-footer">
          <span>
            <Users size={15} />
            {item.athletes} atlet
          </span>
          <span>
            <Trophy size={15} />
            {item.sports} cabor
          </span>
          <ArrowRight size={18} />
        </div>
      </div>
    </Link>
  );
}
export function EventsPage() {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const filtered = eventItems.filter(
    (n) =>
      (category === "Semua" || n.category === category) &&
      `${n.title} ${n.location}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        label="Agenda olahraga"
        title="Setiap pertandingan,"
        accent="sebuah kesempatan."
        description="Jelajahi agenda olahraga dan rekam perjalanan atlet Kampar di tingkat daerah hingga internasional."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div className="portal-toolbar">
            <Chips
              values={[
                "Semua",
                "Internasional",
                "Nasional",
                "Provinsi",
                "Kabupaten",
                "Daerah",
              ]}
              selected={category}
              onSelect={setCategory}
            />
            <SearchField
              value={query}
              setValue={setQuery}
              placeholder="Cari event atau lokasi..."
            />
          </div>
          {filtered.length ? (
            <div className="portal-grid portal-grid-3">
              {filtered.map((item) => (
                <EventCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <Empty
              reset={() => {
                setQuery("");
                setCategory("Semua");
              }}
            >
              Tidak ada event untuk pencarian ini.
            </Empty>
          )}
          <SourceNote />
          <JoinBanner
            title="Dukung Kampar di setiap arena."
            description="Jadi bagian dari semangat bersama. Kenali kegiatan dan dukung perjalanan atlet-atlet kebanggaan Kampar."
          />
        </div>
      </section>
    </>
  );
}
export function EventDetailPage() {
  const { slug } = useParams();
  const item = eventItems.find((n) => n.slug === slug);
  if (!item) return <NotFoundPage />;
  return (
    <section className="section">
      <div className="container">
        <Link className="portal-back" to="/event">
          <ArrowLeft size={17} /> Kembali ke agenda
        </Link>
        <div className="portal-detail-grid">
          <article>
            <div className="portal-detail-event-image">
              <img src={asset(item.image)} alt={item.title} />
            </div>
            <div className="portal-card-meta">
              <span className="badge">{item.category}</span>
              <span className="badge">{item.status}</span>
            </div>
            <h1 className="portal-detail-title">{item.title}</h1>
            <p className="portal-article-lead">{item.subtitle}</p>
            <div className="portal-detail-meta">
              <span>
                <CalendarDays size={18} />
                {item.date}
              </span>
              <span>
                <MapPin size={18} />
                {item.location}
              </span>
              <span>
                <Users size={18} />
                {item.athletes} atlet
              </span>
              <span>
                <Trophy size={18} />
                {item.sports} cabor
              </span>
            </div>
            <div className="portal-prose">
              <p>
                Ajang olahraga yang mempertemukan atlet-atlet terbaik untuk
                berkompetisi, menjunjung sportivitas, dan mengharumkan nama
                daerah masing-masing.
              </p>
              <h2>
                <Clock3 size={24} /> Rangkaian kegiatan
              </h2>
            </div>
            <div className="portal-timeline">
              {[
                "Upacara pembukaan",
                "Pertandingan babak penyisihan",
                "Semifinal dan final",
                "Penyerahan medali & penutupan",
              ].map((title, i) => (
                <div key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>
                      {item.status === "Rencana"
                        ? "Jadwal akan diumumkan oleh penyelenggara."
                        : "Bagian dari rangkaian event yang telah selesai."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <SourceNote />
          </article>
          <aside className="portal-detail-aside">
            <div className="portal-panel">
              <h3>Event lainnya</h3>
              {eventItems
                .filter((n) => n.slug !== slug)
                .slice(0, 3)
                .map((n) => (
                  <Link
                    className="portal-side-link"
                    key={n.slug}
                    to={`/event/${n.slug}`}
                  >
                    <div>
                      <strong>{n.title}</strong>
                      <span>{n.date}</span>
                    </div>
                    <ArrowRight size={17} />
                  </Link>
                ))}
            </div>
            <div className="portal-aside-cta">
              <Trophy size={30} />
              <h3>Ingin berkontribusi?</h3>
              <p>
                Bangun prestasi olahraga melalui kolaborasi dan dukungan
                bersama.
              </p>
              <Link to="/kontak" className="button">
                Hubungi kami <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const sportItems = [
  {
    slug: "sepak-bola",
    name: "Sepak Bola",
    category: "Permainan",
    athletes: 45,
    achievements: 12,
    description: "Olahraga tim yang paling populer di dunia.",
    organization: "PSSI Kabupaten Kampar",
    image: "portal-sport-1.svg",
  },
  {
    slug: "bola-basket",
    name: "Bola Basket",
    category: "Permainan",
    athletes: 24,
    achievements: 8,
    description:
      "Kerja sama tim, ketangkasan, dan semangat di setiap pertandingan.",
    organization: "PERBASI Kabupaten Kampar",
    image: "portal-sport-2.svg",
  },
  {
    slug: "bola-voli",
    name: "Bola Voli",
    category: "Permainan",
    athletes: 30,
    achievements: 15,
    description: "Olahraga permainan yang dimainkan oleh dua tim.",
    organization: "PBVSI Kabupaten Kampar",
    image: "portal-sport-3.svg",
  },
  {
    slug: "bulu-tangkis",
    name: "Bulu Tangkis",
    category: "Raket",
    athletes: 20,
    achievements: 25,
    description: "Kecepatan dan presisi dalam permainan tunggal maupun ganda.",
    organization: "PBSI Kabupaten Kampar",
    image: "portal-sport-4.svg",
  },
  {
    slug: "tinju",
    name: "Tinju",
    category: "Bela diri",
    athletes: 15,
    achievements: 10,
    description: "Olahraga bela diri yang mengutamakan teknik dan ketangkasan.",
    organization: "PERTINA Kabupaten Kampar",
    image: "portal-sport-5.svg",
  },
  {
    slug: "atletik",
    name: "Atletik",
    category: "Individu",
    athletes: 35,
    achievements: 20,
    description: "Cabang olahraga yang meliputi lari, lompat, dan lempar.",
    organization: "PASI Kabupaten Kampar",
    image: "portal-sport-6.svg",
  },
  {
    slug: "renang",
    name: "Renang",
    category: "Air",
    athletes: 18,
    achievements: 14,
    description: "Menempa ketahanan dan kecepatan di dalam air.",
    organization: "Akuatik Kabupaten Kampar",
    image: "portal-sport-7.svg",
  },
  {
    slug: "panahan",
    name: "Panahan",
    category: "Ketepatan",
    athletes: 12,
    achievements: 8,
    description: "Konsentrasi, konsistensi, dan ketepatan dalam satu sasaran.",
    organization: "PERPANI Kabupaten Kampar",
    image: "portal-sport-8.svg",
  },
  {
    slug: "tenis-lapangan",
    name: "Tenis Lapangan",
    category: "Raket",
    athletes: 16,
    achievements: 6,
    description: "Olahraga raket untuk pertandingan tunggal atau ganda.",
    organization: "PELTI Kabupaten Kampar",
    image: "portal-sport-9.svg",
  },
  {
    slug: "pencak-silat",
    name: "Pencak Silat",
    category: "Bela diri",
    athletes: 22,
    achievements: 18,
    description: "Seni bela diri tradisional, kebanggaan Indonesia.",
    organization: "IPSI Kabupaten Kampar",
    image: "portal-sport-10.svg",
  },
  {
    slug: "balap-sepeda",
    name: "Balap Sepeda",
    category: "Balap",
    athletes: 14,
    achievements: 5,
    description: "Daya tahan dan kecepatan untuk mencapai garis akhir.",
    organization: "ISSI Kabupaten Kampar",
    image: "portal-sport-11.svg",
  },
  {
    slug: "karate",
    name: "Karate",
    category: "Bela diri",
    athletes: 20,
    achievements: 16,
    description: "Disiplin dan penguasaan teknik untuk membangun karakter.",
    organization: "FORKI Kabupaten Kampar",
    image: "portal-sport-12.svg",
  },
];
function SportCard({ item }: { item: (typeof sportItems)[number] }) {
  return (
    <Link to={`/cabor/${item.slug}`} className="portal-sport-card">
      <div className="portal-sport-visual">
        <img src={asset(item.image)} alt="" />
        <ArrowRight size={20} />
      </div>
      <div className="portal-card-body">
        <span className="badge">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="portal-card-footer">
          <span>
            <Users size={15} />
            {item.athletes} atlet
          </span>
          <span>
            <Trophy size={15} />
            {item.achievements} prestasi
          </span>
        </div>
      </div>
    </Link>
  );
}
export function SportsPage() {
  const [category, setCategory] = useState("Semua");
  const [query, setQuery] = useState("");
  const filtered = sportItems.filter(
    (n) =>
      (category === "Semua" || n.category === category) &&
      n.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        label="Cabang olahraga"
        title="Temukan arena"
        accent="untuk potensimu."
        description="Beragam cabang olahraga, satu semangat juara. Kenali ruang bagi talenta Kampar untuk tumbuh dan berprestasi."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div className="portal-stat-row">
            <div>
              <Trophy />
              <strong>12</strong>
              <span>Cabang olahraga</span>
            </div>
            <div>
              <Users />
              <strong>271</strong>
              <span>Atlet dalam pembinaan</span>
            </div>
            <div>
              <Medal />
              <strong>157</strong>
              <span>Pencapaian olahraga</span>
            </div>
          </div>
          <div className="portal-toolbar">
            <Chips
              values={[
                "Semua",
                "Permainan",
                "Raket",
                "Bela diri",
                "Individu",
                "Air",
                "Ketepatan",
                "Balap",
              ]}
              selected={category}
              onSelect={setCategory}
            />
            <SearchField
              value={query}
              setValue={setQuery}
              placeholder="Cari cabang olahraga..."
            />
          </div>
          {filtered.length ? (
            <div className="portal-grid portal-grid-4">
              {filtered.map((item) => (
                <SportCard key={item.slug} item={item} />
              ))}
            </div>
          ) : (
            <Empty
              reset={() => {
                setQuery("");
                setCategory("Semua");
              }}
            >
              Pilih kategori lain atau coba nama cabang olahraga yang berbeda.
            </Empty>
          )}
          <SourceNote />
          <JoinBanner />
        </div>
      </section>
    </>
  );
}
export function SportDetailPage() {
  const { slug } = useParams();
  const item = sportItems.find((n) => n.slug === slug);
  if (!item) return <NotFoundPage />;
  return (
    <section className="section">
      <div className="container">
        <Link className="portal-back" to="/cabor">
          <ArrowLeft size={17} /> Kembali ke cabang olahraga
        </Link>
        <div className="portal-detail-grid">
          <article>
            <header className="portal-sport-detail-head">
              <div className="portal-sport-detail-icon">
                <img src={asset(item.image)} alt="" />
              </div>
              <div>
                <span className="badge">{item.category}</span>
                <h1>{item.name}</h1>
                <p>
                  {item.description} KONI Kampar mendukung pembinaan atlet
                  secara terarah dan berkelanjutan.
                </p>
              </div>
            </header>
            <div className="portal-mini-stats">
              <div>
                <Users />
                <strong>{item.athletes}</strong>
                <span>Atlet aktif</span>
              </div>
              <div>
                <Trophy />
                <strong>{item.achievements}</strong>
                <span>Total prestasi</span>
              </div>
            </div>
            <div className="portal-panel">
              <div className="portal-panel-title">
                <Building2 size={22} />
                <h2>Organisasi cabang olahraga</h2>
              </div>
              <h3>{item.organization}</h3>
              <p className="muted">
                Koordinasi pembinaan, pelatihan, dan kegiatan{" "}
                {item.name.toLowerCase()} di Kabupaten Kampar.
              </p>
              <Link className="portal-text-link" to="/kontak">
                Minta informasi organisasi <ArrowRight size={17} />
              </Link>
            </div>
            <div className="portal-section-title">
              <p className="eyebrow">DARI POTENSI MENJADI PRESTASI</p>
              <h2>Jalur pembinaan atlet</h2>
            </div>
            <div className="portal-timeline">
              {[
                [
                  "Kenali minat dan kemampuan",
                  "Diskusikan minat olahraga dan jenjang pembinaan yang sesuai.",
                ],
                [
                  "Bergabung dalam pembinaan",
                  "Ikuti arahan pengurus dan pelatih cabang olahraga.",
                ],
                [
                  "Latihan dan evaluasi",
                  "Bangun kemampuan melalui latihan rutin dan evaluasi.",
                ],
                [
                  "Berkompetisi",
                  "Uji kemampuan dan jaga semangat sportivitas.",
                ],
              ].map(([title, description], i) => (
                <div key={title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <SourceNote />
          </article>
          <aside className="portal-detail-aside">
            <div className="portal-aside-cta">
              <Trophy size={30} />
              <h3>Langkah pertama menuju juara.</h3>
              <p>
                Hubungi kami untuk informasi pembinaan {item.name.toLowerCase()}
                .
              </p>
              <Link
                className="button"
                to={`/kontak?subjek=${encodeURIComponent(`Pembinaan ${item.name}`)}`}
              >
                Saya tertarik bergabung <ArrowRight size={16} />
              </Link>
            </div>
            <div className="portal-panel">
              <h3>Jelajahi cabor lainnya</h3>
              {sportItems
                .filter((n) => n.slug !== slug)
                .slice(0, 4)
                .map((n) => (
                  <Link
                    className="portal-side-link"
                    key={n.slug}
                    to={`/cabor/${n.slug}`}
                  >
                    {n.name}
                    <ArrowRight size={16} />
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

const galleryItems = [
  {
    image: "portal-news-1.png",
    title: "Semangat di arena pertandingan",
    category: "Pertandingan",
  },
  {
    image: "portal-news-2.png",
    title: "Penghormatan untuk para juara",
    category: "Prestasi",
  },
  {
    image: "portal-news-3.png",
    title: "Berlatih bersama, tumbuh bersama",
    category: "Pembinaan",
  },
  {
    image: "portal-news-4.png",
    title: "Senyum bangga di podium",
    category: "Prestasi",
  },
];
export function GalleryPage() {
  const [mediaType, setMediaType] = useState("Foto");
  const [category, setCategory] = useState("Semua");
  const [selected, setSelected] = useState<number | null>(null);
  const [more, setMore] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const items = more
    ? [
        ...galleryItems,
        {
          image: "portal-facility-1.png",
          title: "Arena untuk mimpi yang besar",
          category: "Fasilitas",
        },
        {
          image: "portal-facility-2.png",
          title: "Fasilitas pendukung prestasi",
          category: "Fasilitas",
        },
      ]
    : galleryItems;
  const filtered = items.filter(
    (item) => category === "Semua" || category === item.category,
  );
  useEffect(() => {
    if (selected === null) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (event.key === "ArrowRight")
        setSelected((n) => (n === null ? null : (n + 1) % filtered.length));
      if (event.key === "ArrowLeft")
        setSelected((n) =>
          n === null ? null : (n - 1 + filtered.length) % filtered.length,
        );
      if (event.key === "Tab") {
        const dialog = document.querySelector(".portal-lightbox");
        const focusable = dialog?.querySelectorAll<HTMLButtonElement>("button");
        if (focusable?.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
      openerRef.current?.focus();
    };
  }, [selected, filtered.length]);
  return (
    <>
      <PageIntro
        label="Galeri"
        title="Momen berlalu."
        accent="Semangatnya abadi."
        description="Rangkuman perjuangan, kebersamaan, dan kebanggaan dari arena olahraga. Setiap foto menyimpan cerita."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div
            className="portal-media-tabs"
            role="tablist"
            aria-label="Jenis dokumentasi"
          >
            {["Foto", "Video"].map((type, index) => (
              <button
                key={type}
                id={`gallery-${type.toLowerCase()}-tab`}
                role="tab"
                aria-selected={mediaType === type}
                aria-controls={`gallery-${type.toLowerCase()}-panel`}
                tabIndex={mediaType === type ? 0 : -1}
                onClick={() => setMediaType(type)}
                onKeyDown={(event) => {
                  if (
                    !["ArrowLeft", "ArrowRight", "Home", "End"].includes(
                      event.key,
                    )
                  )
                    return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? 1
                        : (index + 1) % 2;
                  setMediaType(["Foto", "Video"][next]);
                  event.currentTarget.parentElement
                    ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
                    [next]?.focus();
                }}
              >
                {type === "Foto" ? (
                  <ImageIcon size={17} />
                ) : (
                  <Video size={17} />
                )}
                {type}
              </button>
            ))}
          </div>
          <div
            id="gallery-foto-panel"
            role="tabpanel"
            aria-labelledby="gallery-foto-tab"
            hidden={mediaType !== "Foto"}
          >
            <div className="portal-toolbar">
              <Chips
                values={[
                  "Semua",
                  "Pertandingan",
                  "Prestasi",
                  "Pembinaan",
                  ...(more ? ["Fasilitas"] : []),
                ]}
                selected={category}
                onSelect={setCategory}
              />
              <span className="portal-gallery-count">
                <ImageIcon size={16} />
                {filtered.length} dokumentasi
              </span>
            </div>
            <div className="portal-gallery">
              {filtered.map((item, i) => (
                <button
                  key={item.title}
                  className="portal-gallery-item"
                  onClick={(e) => {
                    openerRef.current = e.currentTarget;
                    setSelected(i);
                  }}
                >
                  <img
                    src={asset(item.image)}
                    alt={item.title}
                    loading="lazy"
                  />
                  <span>
                    <small>{item.category}</small>
                    <strong>{item.title}</strong>
                    <span className="portal-image-arrow">
                      <ImageIcon size={19} />
                    </span>
                  </span>
                </button>
              ))}
            </div>
            {!more && (
              <div className="portal-center">
                <button
                  className="button button-outline"
                  onClick={() => setMore(true)}
                >
                  Lihat dokumentasi lainnya <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
          <div
            id="gallery-video-panel"
            role="tabpanel"
            aria-labelledby="gallery-video-tab"
            hidden={mediaType !== "Video"}
          >
            <div className="portal-empty portal-video-empty">
              <Video size={34} aria-hidden="true" />
              <h2>Belum ada video</h2>
              <p>
                Dokumentasi video belum tersedia pada prototipe ini.
                <br />
                Jelajahi foto-foto kegiatan olahraga di tab Foto.
              </p>
              <button
                className="button button-outline"
                onClick={() => {
                  setMediaType("Foto");
                  document.getElementById("gallery-foto-tab")?.focus();
                }}
              >
                Lihat dokumentasi foto <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <SourceNote />
        </div>
      </section>
      {selected !== null && filtered[selected] && (
        <div
          className="portal-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={filtered[selected].title}
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <button
            ref={closeRef}
            className="portal-lightbox-close"
            aria-label="Tutup foto"
            onClick={() => setSelected(null)}
          >
            <X />
          </button>
          <button
            className="portal-lightbox-prev"
            aria-label="Foto sebelumnya"
            onClick={() =>
              setSelected((selected - 1 + filtered.length) % filtered.length)
            }
          >
            <ChevronLeft />
          </button>
          <figure>
            <img
              src={asset(filtered[selected].image)}
              alt={filtered[selected].title}
            />
            <figcaption>
              {filtered[selected].title}
              <span>
                {selected + 1} / {filtered.length}
              </span>
            </figcaption>
          </figure>
          <button
            className="portal-lightbox-next"
            aria-label="Foto berikutnya"
            onClick={() => setSelected((selected + 1) % filtered.length)}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}

export function AchievementsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const athletes = [
    {
      name: "Ahmad Rizki",
      sport: "Bulu Tangkis",
      gold: 2,
      silver: 1,
      bronze: 0,
    },
    { name: "Siti Nurhaliza", sport: "Renang", gold: 1, silver: 1, bronze: 1 },
    { name: "Budi Santoso", sport: "Atletik", gold: 1, silver: 0, bronze: 1 },
    {
      name: "Dewi Lestari",
      sport: "Bulu Tangkis",
      gold: 2,
      silver: 1,
      bronze: 1,
    },
    {
      name: "Rudi Hartono",
      sport: "Sepak Bola",
      gold: 1,
      silver: 1,
      bronze: 0,
    },
    {
      name: "Fitri Handayani",
      sport: "Atletik",
      gold: 2,
      silver: 1,
      bronze: 0,
    },
    {
      name: "Hendra Kurniawan",
      sport: "Basket",
      gold: 0,
      silver: 1,
      bronze: 1,
    },
    { name: "Rina Marlina", sport: "Renang", gold: 1, silver: 0, bronze: 1 },
  ];
  const filtered = athletes.filter(
    (n) =>
      (category === "Semua" || n.sport === category) &&
      n.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        label="Prestasi atlet"
        title="Mereka berjuang."
        accent="Kampar bangga."
        description="Kenali contoh profil dan pencapaian atlet dalam rancangan portal KONI Kampar. Di balik setiap medali, ada dedikasi tanpa henti."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div className="portal-toolbar">
            <Chips
              values={[
                "Semua",
                "Bulu Tangkis",
                "Atletik",
                "Renang",
                "Sepak Bola",
                "Basket",
              ]}
              selected={category}
              onSelect={setCategory}
            />
            <SearchField
              value={query}
              setValue={setQuery}
              placeholder="Cari nama atlet..."
            />
          </div>
          {filtered.length ? (
            <div className="portal-grid portal-grid-4">
              {filtered.map((item) => {
                const index = athletes.indexOf(item);
                return (
                  <article key={item.name} className="portal-athlete-card">
                    <div className="portal-athlete-image">
                      <img
                        src={asset(`portal-news-${(index % 4) + 1}.png`)}
                        alt="Foto olahraga ilustratif dari desain"
                        loading="lazy"
                      />
                      <span>
                        <Medal size={15} />
                        {item.gold + item.silver + item.bronze} pencapaian
                      </span>
                    </div>
                    <div className="portal-card-body">
                      <span className="badge">{item.sport}</span>
                      <h3>{item.name}</h3>
                      <div className="portal-medals">
                        <span className="gold">
                          <Medal size={16} />
                          {item.gold}
                          <small>Emas</small>
                        </span>
                        <span className="silver">
                          <Medal size={16} />
                          {item.silver}
                          <small>Perak</small>
                        </span>
                        <span className="bronze">
                          <Medal size={16} />
                          {item.bronze}
                          <small>Perunggu</small>
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <Empty
              reset={() => {
                setQuery("");
                setCategory("Semua");
              }}
            >
              Belum ada atlet yang sesuai dengan pencarian ini.
            </Empty>
          )}
          <SourceNote />
        </div>
      </section>
    </>
  );
}

const memberItems = [
  {
    name: "Letjen TNI (Purn) Marciano Norman",
    role: "Ketua Umum KONI Pusat",
    image: "portal-marciano.png",
  },
  {
    name: "Mayjen TNI (Purn) Suwarno",
    role: "Wakil Ketua Umum KONI",
    image: "portal-suwarmo.png",
  },
  {
    name: "Mayjen TNI (Purn) Soedarmo",
    role: "Wakil Ketua Umum KONI",
    image: "portal-soedarmo.png",
  },
];
export function MembersPage() {
  const { pathname } = useLocation();
  const [tab, setTab] = useState(
    pathname === "/struktur" ? "Struktur organisasi" : "Profil pengurus",
  );
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    setTab(
      pathname === "/struktur" ? "Struktur organisasi" : "Profil pengurus",
    );
  }, [pathname]);
  return (
    <>
      <PageIntro
        label="Kepengurusan"
        title="Satu tim di balik"
        accent="ribuan mimpi."
        description="Kenali peran kepengurusan dan struktur organisasi yang mendukung ekosistem olahraga. Profil berikut merupakan referensi dari desain."
      />
      <section className="section portal-list-section">
        <div className="container">
          <Chips
            values={["Profil pengurus", "Struktur organisasi"]}
            selected={tab}
            onSelect={setTab}
            label="Tampilan kepengurusan"
          />
          {tab === "Struktur organisasi" ? (
            <div className="portal-org">
              <div className="portal-org-node">
                <Users />
                <small>PEMBINAAN & KOORDINASI</small>
                <h2>KONI Kabupaten Kampar</h2>
              </div>
              <div className="portal-org-branches">
                {[
                  "Ketua umum",
                  "Wakil ketua",
                  "Sekretariat",
                  "Bendahara",
                  "Bidang pembinaan prestasi",
                  "Pengurus cabang olahraga",
                ].map((role) => (
                  <div className="portal-org-node" key={role}>
                    <Building2 size={23} />
                    <h3>{role}</h3>
                    <p>Koordinasi sesuai struktur organisasi</p>
                  </div>
                ))}
              </div>
              <p className="muted">
                Bagan ini menggambarkan peran organisasi pada prototipe, bukan
                susunan pengurus resmi.
              </p>
            </div>
          ) : (
            <div className="portal-grid portal-grid-3 portal-member-grid">
              {memberItems.map((item) => (
                <article className="portal-member-card" key={item.name}>
                  <div className="portal-member-image">
                    <img
                      src={asset(item.image)}
                      alt={item.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="portal-card-body">
                    <p className="eyebrow">PROFIL REFERENSI FIGMA</p>
                    <h3>{item.name}</h3>
                    <p>{item.role}</p>
                    <button
                      className="portal-text-link"
                      aria-expanded={selected === item.name}
                      onClick={() =>
                        setSelected(selected === item.name ? null : item.name)
                      }
                    >
                      {selected === item.name ? "Tutup profil" : "Lihat profil"}{" "}
                      <ArrowRight size={16} />
                    </button>
                    {selected === item.name && (
                      <div className="portal-member-bio">
                        Nama, foto, dan jabatan ditampilkan sesuai contoh pada
                        desain Figma. Data kepengurusan resmi dapat diperbarui
                        ketika portal dihubungkan dengan backend.
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
          <SourceNote />
          <JoinBanner
            title="Prestasi tumbuh dari kolaborasi."
            description="Mari bangun ruang yang lebih baik bagi pembinaan talenta olahraga Kampar."
          />
        </div>
      </section>
    </>
  );
}

const facilities = [
  {
    name: "Stadion Tuanku Tambusai",
    category: "Stadion atletik",
    address: "Jl. Ahmad Yani, Bangkinang",
  },
  {
    name: "GOR Serbaguna Kampar",
    category: "Gelanggang olahraga",
    address: "Jl. Olahraga No. 12, Bangkinang",
  },
  {
    name: "Kolam Renang Stanum",
    category: "Aquatic center",
    address: "Kompleks Sport Center, Kampar",
  },
  {
    name: "Lapangan Tenis Kampar",
    category: "Lapangan tenis",
    address: "Jl. Ahmad Yani, Bangkinang",
  },
  {
    name: "Lapangan Bulu Tangkis",
    category: "Gedung badminton",
    address: "Jl. Olahraga No. 15, Bangkinang",
  },
  {
    name: "Gedung Silat Kampar",
    category: "Sasana pencak silat",
    address: "Jl. Pahlawan No. 8, Bangkinang",
  },
];
export function FacilitiesPage() {
  const [query, setQuery] = useState("");
  const filtered = facilities.filter((item) =>
    `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        label="Sarana & prasarana"
        title="Arena yang baik."
        accent="Prestasi yang lebih tinggi."
        description="Kenali fasilitas olahraga dalam rancangan portal KONI Kampar, lengkap dengan informasi lokasi dan alur peminjaman."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div className="portal-toolbar">
            <p className="portal-result-count" aria-live="polite">
              {filtered.length} fasilitas olahraga
            </p>
            <SearchField
              value={query}
              setValue={setQuery}
              placeholder="Cari fasilitas olahraga..."
            />
          </div>
          {filtered.length ? (
            <div className="portal-grid portal-grid-3">
              {filtered.map((item) => (
                <article className="portal-facility-card" key={item.name}>
                  <div className="portal-facility-image">
                    <img
                      src={asset(
                        `portal-facility-${facilities.indexOf(item) + 1}.png`,
                      )}
                      alt={item.name}
                      loading="lazy"
                    />
                    <span>{item.category}</span>
                  </div>
                  <div className="portal-card-body">
                    <h3>{item.name}</h3>
                    <p className="portal-location">
                      <MapPin size={15} />
                      {item.address}
                    </p>
                    <a
                      className="portal-text-link"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + " Bangkinang Kampar")}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lihat lokasi <ExternalLink size={15} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty reset={() => setQuery("")}>
              Coba nama atau jenis fasilitas yang lain.
            </Empty>
          )}
          <SourceNote />
          <div className="portal-section-title">
            <p className="eyebrow">RANCANG KEGIATAN ANDA</p>
            <h2>Alur peminjaman fasilitas</h2>
            <p>Koordinasikan rencana kegiatan dengan tim KONI Kampar.</p>
          </div>
          <div className="portal-steps">
            {[
              ["Ajukan permohonan", "Hubungi tim melalui kanal resmi."],
              ["Lampirkan dokumen", "Sertakan surat dan jadwal kegiatan."],
              ["Verifikasi", "Tim mengecek data dan ketersediaan."],
              ["Konfirmasi", "Terima persetujuan dan ketentuan."],
              ["Pelaksanaan", "Gunakan fasilitas sesuai jadwal."],
            ].map(([title, description], i) => (
              <article key={title}>
                <span>{i + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <JoinBanner
            title="Siapkan kegiatan olahragamu."
            description="Hubungi kami untuk menanyakan informasi fasilitas, jadwal, dan ketentuan penggunaan."
          />
        </div>
      </section>
    </>
  );
}

export function ContactPage() {
  const { search } = useLocation();
  const subject = new URLSearchParams(search).get("subjek") || "";
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFailure("");
    const form = event.currentTarget;
    const raw = new FormData(form);
    const data = {
      name: String(raw.get("name") || "").trim(),
      email: String(raw.get("email") || "").trim(),
      subject: String(raw.get("subject") || "").trim(),
      message: String(raw.get("message") || "").trim(),
    };
    const rules: {
      name: "name" | "subject" | "message";
      minimum: number;
      label: string;
    }[] = [
      { name: "name", minimum: 2, label: "Nama lengkap" },
      { name: "subject", minimum: 3, label: "Subjek" },
      { name: "message", minimum: 10, label: "Pesan" },
    ];
    const invalid = rules.find((rule) => data[rule.name].length < rule.minimum);
    if (invalid) {
      setFailure(
        `${invalid.label} minimal ${invalid.minimum} karakter, tanpa menghitung spasi di awal dan akhir.`,
      );
      (form.elements.namedItem(invalid.name) as HTMLElement | null)?.focus();
      return;
    }
    try {
      const stored: unknown = JSON.parse(
        localStorage.getItem("koni-contact-drafts") || "[]",
      );
      if (!Array.isArray(stored)) {
        setFailure(
          "Draf belum tersimpan karena format penyimpanan browser tidak sesuai. Hapus data situs atau gunakan browser lain untuk mencoba kembali.",
        );
        return;
      }
      localStorage.setItem(
        "koni-contact-drafts",
        JSON.stringify([
          ...stored,
          { ...data, savedAt: new Date().toISOString() },
        ]),
      );
      setSent(true);
    } catch {
      setFailure(
        "Draf belum tersimpan. Penyimpanan browser tidak tersedia. Anda masih dapat menyalin pesan dan menghubungi melalui email.",
      );
    }
  }
  return (
    <>
      <PageIntro
        label="Hubungi kami"
        title="Mari mulai"
        accent="percakapan yang baik."
        description="Punya pertanyaan tentang pembinaan, kegiatan, atau kerja sama? Sampaikan kepada kami dan temukan langkah selanjutnya."
      />
      <section className="section portal-list-section">
        <div className="container">
          <div className="portal-contact-info">
            <article>
              <Phone />
              <h3>Telepon</h3>
              <a href="tel:0762123456">0762-123-456</a>
              <p>Senin – Jumat</p>
            </article>
            <article>
              <Mail />
              <h3>Email</h3>
              <a href="mailto:info@konikampar.id">info@konikampar.id</a>
              <p>Informasi & kerja sama</p>
            </article>
            <article>
              <MapPin />
              <h3>Alamat</h3>
              <span>Kompleks Sport Center</span>
              <p>Bangkinang, Kampar, Riau</p>
            </article>
            <article>
              <Clock3 />
              <h3>Jam operasional</h3>
              <span>09.00 – 16.00 WIB</span>
              <p>Senin – Jumat</p>
            </article>
          </div>
          <div className="portal-contact-grid">
            <div className="portal-panel">
              <div className="portal-panel-title">
                <MessageSquare size={24} />
                <div>
                  <h2>Tulis pesan Anda</h2>
                  <p className="muted">Kami ingin mendengar dari Anda.</p>
                </div>
              </div>
              {sent ? (
                <div className="portal-contact-success" role="status">
                  <CheckCircle2 size={48} />
                  <h3>Draf pesan tersimpan.</h3>
                  <p>
                    Pesan disimpan di browser ini untuk demonstrasi frontend.
                    Pesan belum dikirim ke KONI Kampar.
                  </p>
                  <button
                    className="button button-outline"
                    onClick={() => setSent(false)}
                  >
                    Tulis pesan lain
                  </button>
                </div>
              ) : (
                <form className="portal-contact-form" onSubmit={submit}>
                  <div className="portal-form-row">
                    <label>
                      Nama lengkap <span>*</span>
                      <input
                        name="name"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={100}
                        placeholder="Nama Anda"
                      />
                    </label>
                    <label>
                      Alamat email <span>*</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        maxLength={160}
                        placeholder="nama@email.com"
                      />
                    </label>
                  </div>
                  <label>
                    Subjek <span>*</span>
                    <input
                      name="subject"
                      required
                      minLength={3}
                      maxLength={150}
                      defaultValue={subject}
                      placeholder="Apa yang ingin Anda tanyakan?"
                    />
                  </label>
                  <label>
                    Pesan <span>*</span>
                    <textarea
                      name="message"
                      required
                      minLength={10}
                      maxLength={3000}
                      rows={5}
                      placeholder="Ceritakan pertanyaan atau rencana Anda..."
                    />
                  </label>
                  <p className="portal-form-note">
                    Mode prototipe: pesan hanya disimpan sebagai draf di browser
                    Anda.
                  </p>
                  {failure && (
                    <p className="portal-form-error" role="alert">
                      {failure}
                    </p>
                  )}
                  <button className="button button-primary" type="submit">
                    Simpan draf pesan <Send size={17} />
                  </button>
                </form>
              )}
            </div>
            <aside className="portal-contact-location">
              <div>
                <p className="eyebrow">TEMUI KAMI</p>
                <h2>
                  Dari Bangkinang,
                  <br />
                  untuk Kampar.
                </h2>
                <p>
                  Kompleks Sport Center,
                  <br />
                  Bangkinang, Kabupaten Kampar,
                  <br />
                  Riau, Indonesia.
                </p>
                <a
                  className="button button-outline"
                  href="https://www.google.com/maps/search/?api=1&query=Sport+Center+Bangkinang+Kampar"
                  target="_blank"
                  rel="noreferrer"
                >
                  Buka Google Maps <ExternalLink size={16} />
                </a>
              </div>
              <div className="portal-location-art">
                <MapPin size={52} />
                <span>Bangkinang</span>
                <small>KABUPATEN KAMPAR · RIAU</small>
              </div>
            </aside>
          </div>
          <SourceNote />
          <p className="portal-source">
            Alamat dan kontak mengikuti contoh desain; verifikasi sebelum
            digunakan sebagai kanal resmi.
          </p>
        </div>
      </section>
    </>
  );
}

export function PrivacyPage() {
  return (
    <>
      <PageIntro
        label="Privasi"
        title="Informasi privasi"
        accent="prototipe."
        description="Penjelasan singkat tentang data yang digunakan oleh frontend KONI Kampar ini."
      />
      <section className="section">
        <div className="container portal-prose portal-legal">
          <h2>Penyimpanan di perangkat Anda</h2>
          <p>
            Formulir kontak menyimpan draf pesan di localStorage browser pada
            perangkat ini. Prototipe tidak mengirimkan pesan ke server atau
            pengurus KONI Kampar.
          </p>
          <h2>Data contoh</h2>
          <p>
            Berita, profil, angka prestasi, jadwal, dan kontak mengikuti contoh
            pada rancangan Figma. Data tersebut belum terhubung dengan basis
            data resmi.
          </p>
          <h2>Tautan eksternal</h2>
          <p>
            Tautan peta membuka Google Maps pada tab baru. Saat Anda membuka
            situs eksternal, kebijakan situs tersebut berlaku.
          </p>
          <h2>Menghapus data lokal</h2>
          <p>
            Anda dapat menghapus data prototipe melalui pengaturan penyimpanan
            situs pada browser. Menghapus data situs akan menghapus draf pesan
            dan data demo yang disimpan di perangkat.
          </p>
          <Link className="button button-outline" to="/kontak">
            Kembali ke kontak <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
export function NotFoundPage() {
  return (
    <section className="section">
      <div className="container portal-not-found">
        <span>404</span>
        <h1>Halaman belum ditemukan.</h1>
        <p>
          Tautan mungkin tidak tersedia. Mari kembali menjelajahi semangat
          olahraga Kampar.
        </p>
        <Link className="button button-primary" to="/">
          Kembali ke beranda <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
}
