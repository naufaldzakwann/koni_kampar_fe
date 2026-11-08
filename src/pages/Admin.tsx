import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Images,
  LayoutDashboard,
  LogOut,
  Medal,
  Menu,
  Newspaper,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Trophy,
  UsersRound,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "./admin.css";

type SectionKey =
  | "cabor"
  | "prestasi"
  | "berita"
  | "event"
  | "galeri"
  | "fasilitas"
  | "administrator";
type ItemStatus =
  "Aktif" | "Nonaktif" | "Draft" | "Terbit" | "Mendatang" | "Selesai";
type ContentItem = {
  id: string;
  title: string;
  category: string;
  detail: string;
  status: ItemStatus;
  amount: number;
  secondary: number;
  date: string;
  image: string;
};
type Database = Record<SectionKey, ContentItem[]>;
type ActivityItem = { id: string; text: string; detail: string; time: string };
type SectionConfig = {
  title: string;
  singular: string;
  description: string;
  icon: LucideIcon;
  titleLabel: string;
  categoryLabel: string;
  detailLabel: string;
  statuses: ItemStatus[];
  amountLabel?: string;
  secondaryLabel?: string;
  dateLabel?: string;
};
const STORAGE_KEY = "koni-kampar-admin-demo-v1";
const SESSION_KEY = "koni-kampar-demo-session";
const SECTIONS: Record<SectionKey, SectionConfig> = {
  cabor: {
    title: "Cabang Olahraga",
    singular: "Cabor",
    description: "Kelola cabang olahraga, atlet, dan perkembangan prestasinya.",
    icon: Trophy,
    titleLabel: "Nama cabang olahraga",
    categoryLabel: "Induk organisasi",
    detailLabel: "Nama pengurus",
    statuses: ["Aktif", "Nonaktif"],
    amountLabel: "Jumlah atlet",
    secondaryLabel: "Jumlah prestasi",
  },
  prestasi: {
    title: "Prestasi",
    singular: "Prestasi",
    description: "Catat pencapaian para atlet kebanggaan Kampar.",
    icon: Medal,
    titleLabel: "Nama prestasi",
    categoryLabel: "Cabang olahraga",
    detailLabel: "Nama atlet / tim",
    statuses: ["Terbit", "Draft"],
    dateLabel: "Tanggal pencapaian",
  },
  berita: {
    title: "Berita",
    singular: "Berita",
    description: "Kelola kabar dan cerita terbaru dari dunia olahraga Kampar.",
    icon: Newspaper,
    titleLabel: "Judul berita",
    categoryLabel: "Kategori",
    detailLabel: "Ringkasan berita",
    statuses: ["Terbit", "Draft"],
    dateLabel: "Tanggal publikasi",
  },
  event: {
    title: "Event",
    singular: "Event",
    description: "Susun agenda pertandingan dan kegiatan olahraga.",
    icon: CalendarDays,
    titleLabel: "Nama event",
    categoryLabel: "Tingkat kegiatan",
    detailLabel: "Lokasi kegiatan",
    statuses: ["Mendatang", "Aktif", "Selesai", "Draft"],
    dateLabel: "Tanggal kegiatan",
  },
  galeri: {
    title: "Galeri",
    singular: "Foto",
    description: "Simpan momen terbaik dari kegiatan olahraga Kampar.",
    icon: Images,
    titleLabel: "Judul foto",
    categoryLabel: "Kategori",
    detailLabel: "Keterangan foto",
    statuses: ["Terbit", "Draft"],
    dateLabel: "Tanggal kegiatan",
  },
  fasilitas: {
    title: "Sarana & Prasarana",
    singular: "Fasilitas",
    description: "Kelola informasi tempat latihan dan fasilitas olahraga.",
    icon: Building2,
    titleLabel: "Nama fasilitas",
    categoryLabel: "Jenis fasilitas",
    detailLabel: "Lokasi fasilitas",
    statuses: ["Aktif", "Nonaktif"],
    amountLabel: "Kapasitas pengunjung",
  },
  administrator: {
    title: "Administrator",
    singular: "Administrator",
    description:
      "Daftar pengelola contoh. Perubahan di sini hanya berlaku pada data demo.",
    icon: UsersRound,
    titleLabel: "Nama pengelola",
    categoryLabel: "Peran contoh",
    detailLabel: "Email contoh",
    statuses: ["Aktif", "Nonaktif"],
  },
};
const createItem = (
  id: string,
  title: string,
  category: string,
  detail: string,
  status: ItemStatus,
  amount = 0,
  secondary = 0,
  date = "2026-11-08",
  image = "",
): ContentItem => ({
  id,
  title,
  category,
  detail,
  status,
  amount,
  secondary,
  date,
  image,
});
const INITIAL_DB: Database = {
  cabor: [
    createItem(
      "c1",
      "Sepak Bola",
      "PSSI",
      "Pengurus PSSI Kampar",
      "Aktif",
      25,
      12,
      undefined,
      "/images/football.png",
    ),
    createItem(
      "c2",
      "Bulu Tangkis",
      "PBSI",
      "Pengurus PBSI Kampar",
      "Aktif",
      18,
      24,
      undefined,
      "/images/badminton.png",
    ),
    createItem(
      "c3",
      "Renang",
      "Akuatik Indonesia",
      "Pengurus Akuatik Kampar",
      "Aktif",
      15,
      18,
    ),
    createItem(
      "c4",
      "Atletik",
      "PASI",
      "Pengurus PASI Kampar",
      "Aktif",
      22,
      15,
      undefined,
      "/images/athletics.png",
    ),
    createItem(
      "c5",
      "Basket",
      "PERBASI",
      "Pengurus PERBASI Kampar",
      "Nonaktif",
      12,
      8,
    ),
    createItem(
      "c6",
      "Pencak Silat",
      "IPSI",
      "Pengurus IPSI Kampar",
      "Aktif",
      20,
      16,
      undefined,
      "/images/silat.png",
    ),
  ],
  prestasi: [
    createItem(
      "p1",
      "Medali Emas Tunggal Putra",
      "Bulu Tangkis",
      "Tim Bulu Tangkis Kampar",
      "Terbit",
      0,
      0,
      "2026-10-24",
    ),
    createItem(
      "p2",
      "Juara Umum Kejuaraan Daerah",
      "Pencak Silat",
      "Kontingen Pencak Silat Kampar",
      "Terbit",
      0,
      0,
      "2026-09-12",
    ),
    createItem(
      "p3",
      "Medali Perak Lari 100 Meter",
      "Atletik",
      "Tim Atletik Kampar",
      "Draft",
      0,
      0,
      "2026-10-18",
    ),
  ],
  berita: [
    createItem(
      "b1",
      "Semangat atlet Kampar menuju podium juara",
      "Pembinaan",
      "Persiapan dan latihan atlet terus dilakukan untuk meraih prestasi terbaik.",
      "Terbit",
      0,
      0,
      "2026-11-05",
      "/images/hero.png",
    ),
    createItem(
      "b2",
      "KONI Kampar perkuat sinergi antar cabang olahraga",
      "Organisasi",
      "Pertemuan pengurus membahas program pembinaan atlet daerah.",
      "Terbit",
      0,
      0,
      "2026-11-02",
      "/images/about.png",
    ),
    createItem(
      "b3",
      "Regenerasi atlet muda menjadi prioritas pembinaan",
      "Atlet",
      "Program latihan terarah membuka kesempatan untuk generasi baru.",
      "Draft",
      0,
      0,
      "2026-11-01",
      "/images/athletics.png",
    ),
  ],
  event: [
    createItem(
      "e1",
      "Pekan Olahraga Kabupaten Kampar",
      "Kabupaten",
      "Bangkinang, Kampar",
      "Mendatang",
      0,
      0,
      "2026-12-15",
    ),
    createItem(
      "e2",
      "Kejuaraan Bulu Tangkis Kampar",
      "Kabupaten",
      "GOR Bangkinang",
      "Mendatang",
      0,
      0,
      "2026-11-28",
    ),
    createItem(
      "e3",
      "Pemusatan Latihan Daerah",
      "Provinsi",
      "Pekanbaru, Riau",
      "Aktif",
      0,
      0,
      "2026-11-08",
    ),
  ],
  galeri: [
    createItem(
      "g1",
      "Semangat olahraga Kampar",
      "Kegiatan",
      "Ilustrasi semangat para atlet Kampar.",
      "Terbit",
      0,
      0,
      "2026-11-05",
      "/images/hero.png",
    ),
    createItem(
      "g2",
      "Pembinaan atlet daerah",
      "Pembinaan",
      "Kegiatan pembinaan olahraga di Kabupaten Kampar.",
      "Terbit",
      0,
      0,
      "2026-10-28",
      "/images/about.png",
    ),
    createItem(
      "g3",
      "Cabang olahraga pencak silat",
      "Cabang Olahraga",
      "Ilustrasi cabang olahraga pencak silat.",
      "Draft",
      0,
      0,
      "2026-10-20",
      "/images/silat.png",
    ),
  ],
  fasilitas: [
    createItem(
      "f1",
      "Stadion Tuanku Tambusai",
      "Stadion",
      "Bangkinang, Kabupaten Kampar",
      "Aktif",
      10000,
    ),
    createItem(
      "f2",
      "GOR Bangkinang",
      "Gedung olahraga",
      "Bangkinang, Kabupaten Kampar",
      "Aktif",
      1000,
    ),
    createItem(
      "f3",
      "Lapangan Atletik Kampar",
      "Lapangan",
      "Bangkinang, Kabupaten Kampar",
      "Aktif",
      500,
    ),
  ],
  administrator: [
    createItem(
      "a1",
      "Admin KONI Kampar",
      "Administrator",
      "admin@example.com",
      "Aktif",
    ),
    createItem("a2", "Editor Konten", "Editor", "editor@example.com", "Aktif"),
  ],
};
const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: "welcome",
    text: "Ruang kerja demo siap digunakan",
    detail: "Coba tambah, ubah, atau hapus data contoh.",
    time: "Demo",
  },
];
function readDatabase(): Database {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null",
    );
    if (!value || typeof value !== "object") return structuredClone(INITIAL_DB);
    const data = value as Partial<Database>;
    return Object.fromEntries(
      Object.keys(SECTIONS).map((key) => {
        const section = key as SectionKey;
        const rows = data[section];
        return [
          section,
          Array.isArray(rows) &&
          rows.every(
            (row) =>
              row &&
              typeof row.id === "string" &&
              typeof row.title === "string" &&
              typeof row.detail === "string" &&
              typeof row.category === "string" &&
              typeof row.date === "string" &&
              typeof row.image === "string" &&
              typeof row.amount === "number" &&
              Number.isFinite(row.amount) &&
              typeof row.secondary === "number" &&
              Number.isFinite(row.secondary) &&
              SECTIONS[section].statuses.includes(row.status),
          )
            ? rows
            : structuredClone(INITIAL_DB[section]),
        ];
      }),
    ) as Database;
  } catch {
    return structuredClone(INITIAL_DB);
  }
}
function getDemoSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
function displayDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}
function statusClass(status: ItemStatus) {
  return ["Aktif", "Terbit"].includes(status)
    ? "green"
    : status === "Mendatang"
      ? "blue"
      : "gray";
}
function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
const imagePresets = [
  { value: "/images/hero.png", label: "Semangat olahraga" },
  { value: "/images/about.png", label: "Tentang KONI" },
  { value: "/images/football.png", label: "Sepak bola" },
  { value: "/images/athletics.png", label: "Atletik" },
  { value: "/images/badminton.png", label: "Bulu tangkis" },
  { value: "/images/silat.png", label: "Pencak silat" },
];

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  function enterDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = String(
      new FormData(event.currentTarget).get("email") || "",
    ).trim();
    try {
      sessionStorage.setItem(SESSION_KEY, email);
      navigate("/admin");
    } catch {
      setError(
        "Penyimpanan browser tidak tersedia. Izinkan penyimpanan situs untuk membuka demo.",
      );
    }
  }
  return (
    <main id="main-content" className="admin-login">
      <div className="admin-login-visual">
        <Link to="/" className="admin-login-brand">
          <img src="/images/logo.png" alt="KONI Kabupaten Kampar" />
        </Link>
        <div className="admin-login-story">
          <span className="admin-overline">SATU SEMANGAT, SATU TUJUAN</span>
          <h1>
            Di balik setiap juara,
            <br />
            ada kerja bersama.
          </h1>
          <p>
            Ruang pengelolaan informasi dan aktivitas olahraga KONI Kabupaten
            Kampar.
          </p>
        </div>
        <div className="admin-login-photo">
          <img
            src="/images/hero.png"
            alt="Ilustrasi semangat atlet olahraga Kampar"
          />
        </div>
        <p className="admin-login-caption">Dari Kampar untuk Indonesia.</p>
      </div>
      <div className="admin-login-form-side">
        <Link to="/" className="admin-back-link">
          <ArrowLeft size={17} /> Kembali ke website
        </Link>
        <div className="admin-login-form-wrap">
          <span className="admin-login-icon">
            <ShieldCheck size={28} />
          </span>
          <span className="admin-overline">ADMIN PANEL</span>
          <h2>Selamat datang kembali.</h2>
          <p>Jelajahi ruang kerja pengelola KONI Kampar.</p>
          <form onSubmit={enterDemo} className="admin-form">
            <label htmlFor="demo-email">
              Email untuk sesi demo
              <input
                id="demo-email"
                name="email"
                type="email"
                placeholder="nama@example.com"
                autoComplete="email"
                required
              />
            </label>
            <div className="admin-demo-note">
              <ShieldCheck size={20} />
              <p>
                Ini adalah demo frontend. Tidak ada autentikasi server. Email
                hanya digunakan selama sesi browser, dan data contoh tersimpan
                di perangkat ini.
              </p>
            </div>
            {error && (
              <p role="alert" className="admin-error">
                {error}
              </p>
            )}
            <button
              className="admin-btn admin-btn-primary admin-login-submit"
              type="submit"
            >
              Masuk ke demo <ArrowRight size={18} />
            </button>
          </form>
          <small>© {new Date().getFullYear()} KONI Kabupaten Kampar</small>
        </div>
      </div>
    </main>
  );
}

function ItemDialog({
  section,
  item,
  onClose,
  onSave,
}: {
  section: SectionKey;
  item: ContentItem | null;
  onClose: () => void;
  onSave: (item: ContentItem) => void;
}) {
  const config = SECTIONS[section];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<ContentItem>(
    item ||
      createItem(
        crypto.randomUUID(),
        "",
        "",
        "",
        config.statuses[0],
        0,
        0,
        today(),
        section === "galeri" ? "/images/hero.png" : "",
      ),
  );
  const [imageError, setImageError] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [formError, setFormError] = useState("");
  useEffect(() => {
    dialogRef.current?.showModal();
    dialogRef.current?.querySelector<HTMLInputElement>("#item-title")?.focus();
  }, []);
  const update = <K extends keyof ContentItem>(key: K, value: ContentItem[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  function uploadFile(file?: File) {
    setImageError("");
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type,
      )
    ) {
      setImageError("Pilih foto JPG, PNG, WebP, atau GIF.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setImageError("Ukuran foto maksimal 1 MB untuk penyimpanan demo.");
      return;
    }
    setLoadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      update("image", String(reader.result));
      setLoadingImage(false);
    };
    reader.onerror = () => {
      setImageError("Foto tidak dapat dibaca. Silakan pilih file lain.");
      setLoadingImage(false);
    };
    reader.readAsDataURL(file);
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim() || !draft.detail.trim() || !draft.category.trim()) {
      setFormError("Lengkapi semua kolom dengan informasi yang valid.");
      return;
    }
    setFormError("");
    onSave({
      ...draft,
      title: draft.title.trim(),
      detail: draft.detail.trim(),
      category: draft.category.trim(),
    });
  }
  return (
    <dialog
      ref={dialogRef}
      className="admin-dialog"
      aria-labelledby="admin-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="admin-dialog-header">
        <div>
          <span className="admin-overline">KELOLA DATA DEMO</span>
          <h2 id="admin-dialog-title">
            {item ? "Edit" : "Tambah"} {config.singular}
          </h2>
        </div>
        <button
          className="admin-icon-btn"
          aria-label="Tutup formulir"
          onClick={onClose}
        >
          <X size={21} />
        </button>
      </div>
      <form className="admin-form" onSubmit={submit}>
        <label htmlFor="item-title">
          {config.titleLabel}
          <input
            id="item-title"
            autoFocus
            maxLength={150}
            value={draft.title}
            onChange={(event) => update("title", event.target.value)}
            required
            placeholder={`Masukkan ${config.titleLabel.toLowerCase()}`}
          />
        </label>
        <div className="admin-form-row">
          <label htmlFor="item-category">
            {config.categoryLabel}
            <input
              id="item-category"
              maxLength={80}
              value={draft.category}
              onChange={(event) => update("category", event.target.value)}
              required
              placeholder={config.categoryLabel}
            />
          </label>
          <label htmlFor="item-status">
            Status
            <select
              id="item-status"
              value={draft.status}
              onChange={(event) =>
                update("status", event.target.value as ItemStatus)
              }
            >
              {config.statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
        <label htmlFor="item-detail">
          {config.detailLabel}
          {section === "berita" || section === "galeri" ? (
            <textarea
              id="item-detail"
              rows={4}
              value={draft.detail}
              maxLength={3000}
              onChange={(event) => update("detail", event.target.value)}
              required
              placeholder={config.detailLabel}
            />
          ) : (
            <input
              id="item-detail"
              type={section === "administrator" ? "email" : "text"}
              value={draft.detail}
              maxLength={250}
              onChange={(event) => update("detail", event.target.value)}
              required
              placeholder={config.detailLabel}
            />
          )}
        </label>
        {(config.amountLabel || config.secondaryLabel) && (
          <div className="admin-form-row">
            {config.amountLabel && (
              <label htmlFor="item-amount">
                {config.amountLabel}
                <input
                  id="item-amount"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  value={draft.amount}
                  onChange={(event) =>
                    update("amount", Math.max(0, Number(event.target.value)))
                  }
                  required
                />
              </label>
            )}
            {config.secondaryLabel && (
              <label htmlFor="item-secondary">
                {config.secondaryLabel}
                <input
                  id="item-secondary"
                  type="number"
                  min="0"
                  max="1000000"
                  step="1"
                  value={draft.secondary}
                  onChange={(event) =>
                    update("secondary", Math.max(0, Number(event.target.value)))
                  }
                  required
                />
              </label>
            )}
          </div>
        )}
        {config.dateLabel && (
          <label htmlFor="item-date">
            {config.dateLabel}
            <input
              id="item-date"
              type="date"
              value={draft.date}
              onChange={(event) => update("date", event.target.value)}
              required
            />
          </label>
        )}
        {["galeri", "berita"].includes(section) && (
          <div className="admin-image-fields">
            <label htmlFor="item-image">
              Gambar
              <select
                id="item-image"
                value={draft.image.startsWith("data:") ? "upload" : draft.image}
                onChange={(event) => update("image", event.target.value)}
              >
                <option value="">Tanpa gambar</option>
                {imagePresets.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
                {draft.image.startsWith("data:") && (
                  <option value="upload">Foto yang diunggah</option>
                )}
              </select>
            </label>
            <label className="admin-upload" htmlFor="item-upload">
              <ImagePlus size={22} />
              <span>
                {loadingImage ? "Membaca foto…" : "Pilih foto dari perangkat"}
                <small>JPG, PNG, WebP, GIF · maks. 1 MB</small>
              </span>
              <input
                id="item-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => uploadFile(event.target.files?.[0])}
              />
            </label>
            {draft.image && (
              <img
                className="admin-image-preview"
                src={draft.image}
                alt="Pratinjau foto pilihan"
              />
            )}
            {imageError && (
              <p className="admin-error" role="alert">
                {imageError}
              </p>
            )}
          </div>
        )}
        {section === "administrator" && (
          <p className="admin-form-hint">
            Daftar ini hanya data contoh dan tidak memberikan akses atau izin
            sungguhan.
          </p>
        )}
        {formError && (
          <p className="admin-error" role="alert">
            {formError}
          </p>
        )}
        <div className="admin-dialog-actions">
          <button
            type="button"
            className="admin-btn admin-btn-light"
            onClick={onClose}
          >
            Batal
          </button>
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
            disabled={loadingImage}
          >
            <Check size={17} /> Simpan {item ? "perubahan" : "data"}
          </button>
        </div>
      </form>
    </dialog>
  );
}

function DeleteDialog({
  item,
  onClose,
  onDelete,
}: {
  item: ContentItem;
  onClose: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="admin-dialog admin-delete-dialog"
      aria-labelledby="delete-title"
      onCancel={onClose}
    >
      <div className="admin-delete-icon">
        <Trash2 size={24} />
      </div>
      <h2 id="delete-title">Hapus data contoh?</h2>
      <p>
        <strong>{item.title}</strong> akan dihapus dari demo pada browser ini.
        Anda dapat membatalkannya lewat pesan setelah penghapusan.
      </p>
      <div className="admin-dialog-actions">
        <button className="admin-btn admin-btn-light" onClick={onClose}>
          Batal
        </button>
        <button className="admin-btn admin-btn-primary" onClick={onDelete}>
          Hapus data
        </button>
      </div>
    </dialog>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeSection = location.pathname.split("/")[2];
  const section: SectionKey | "dashboard" =
    routeSection && Object.hasOwn(SECTIONS, routeSection)
      ? (routeSection as SectionKey)
      : "dashboard";
  const [database, setDatabase] = useState<Database>(readDatabase);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua status");
  const [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [activities, setActivities] =
    useState<ActivityItem[]>(INITIAL_ACTIVITY);
  const [editor, setEditor] = useState<{
    section: SectionKey;
    item: ContentItem | null;
  } | null>(null);
  const [deleting, setDeleting] = useState<{
    section: SectionKey;
    item: ContentItem;
  } | null>(null);
  const [toast, setToast] = useState<{
    text: string;
    undo?: () => void;
    error?: boolean;
  } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const sidebarRef = useRef<HTMLElement>(null);
  const session = getDemoSession();
  useEffect(() => {
    setQuery("");
    setStatusFilter("Semua status");
    setPage(1);
    setDrawer(false);
    setNotifications(false);
  }, [location.pathname]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (!drawer) return;
    const previousFocus =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = Array.from(
      sidebarRef.current?.querySelectorAll<HTMLElement>("a, button") || [],
    );
    focusable[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawer(false);
      if (event.key === "Tab") {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [drawer]);
  function showToast(text: string, undo?: () => void, error = false) {
    clearTimeout(toastTimer.current);
    setToast({ text, undo, error });
    toastTimer.current = setTimeout(() => setToast(null), undo ? 12000 : 5000);
  }
  function commit(next: Database) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setDatabase(next);
      return true;
    } catch {
      showToast(
        "Data belum tersimpan. Penyimpanan browser penuh atau tidak tersedia.",
        undefined,
        true,
      );
      return false;
    }
  }
  function logActivity(text: string, detail: string) {
    setActivities((current) =>
      [
        { id: crypto.randomUUID(), text, detail, time: "Baru saja" },
        ...current,
      ].slice(0, 8),
    );
  }
  function saveItem(item: ContentItem) {
    if (!editor) return;
    const key = editor.section;
    const nextRows = editor.item
      ? database[key].map((row) => (row.id === item.id ? item : row))
      : [item, ...database[key]];
    if (commit({ ...database, [key]: nextRows })) {
      logActivity(
        `${editor.item ? "Memperbarui" : "Menambahkan"} ${SECTIONS[key].singular.toLowerCase()}`,
        item.title,
      );
      setEditor(null);
      setPage(1);
      showToast(`${SECTIONS[key].singular} berhasil disimpan di browser.`);
    }
  }
  function deleteItem() {
    if (!deleting) return;
    const { section: key, item } = deleting;
    const previous = database;
    if (
      commit({
        ...database,
        [key]: database[key].filter((row) => row.id !== item.id),
      })
    ) {
      logActivity(
        `Menghapus ${SECTIONS[key].singular.toLowerCase()}`,
        item.title,
      );
      setDeleting(null);
      showToast("Data contoh berhasil dihapus.", () => {
        if (commit(previous)) showToast("Penghapusan dibatalkan.");
      });
    }
  }
  function logout() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* No session remains when storage is unavailable. */
    }
    navigate("/login");
  }
  function exportData(key: SectionKey) {
    const rows = database[key];
    const escapeCell = (value: string | number) => {
      const raw = String(value);
      const safe = /^[=+@\-\t\r]/.test(raw) ? `'${raw}` : raw;
      return `"${safe.replace(/"/g, '""')}"`;
    };
    const fields = SECTIONS[key];
    const headers = [
      fields.titleLabel,
      fields.categoryLabel,
      fields.detailLabel,
      "Status",
      ...(fields.amountLabel ? [fields.amountLabel] : []),
      ...(fields.secondaryLabel ? [fields.secondaryLabel] : []),
      ...(fields.dateLabel ? [fields.dateLabel] : []),
    ];
    const records = rows.map((row) => [
      row.title,
      row.category,
      row.detail,
      row.status,
      ...(fields.amountLabel ? [row.amount] : []),
      ...(fields.secondaryLabel ? [row.secondary] : []),
      ...(fields.dateLabel ? [row.date] : []),
    ]);
    const csv =
      "\uFEFF" +
      [headers, ...records]
        .map((row) => row.map(escapeCell).join(","))
        .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `koni-kampar-demo-${key}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Data demo berhasil diekspor.");
  }
  if (!session) return <Navigate to="/login" replace />;
  const config = section === "dashboard" ? null : SECTIONS[section];
  const filteredRows =
    section === "dashboard"
      ? []
      : database[section].filter(
          (row) =>
            [row.title, row.category, row.detail]
              .join(" ")
              .toLocaleLowerCase("id")
              .includes(query.toLocaleLowerCase("id")) &&
            (statusFilter === "Semua status" || row.status === statusFilter),
        );
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / 5));
  const safePage = Math.min(page, pageCount);
  const visibleRows = filteredRows.slice((safePage - 1) * 5, safePage * 5);
  const stats = [
    {
      label: "Cabang Olahraga",
      value: database.cabor.length,
      icon: Trophy,
      key: "cabor",
      color: "blue",
      detail: `${database.cabor.filter((item) => item.status === "Aktif").length} cabor aktif`,
    },
    {
      label: "Total Atlet",
      value: database.cabor.reduce((sum, item) => sum + item.amount, 0),
      icon: UsersRound,
      key: "cabor",
      color: "green",
      detail: "Dari data cabor demo",
    },
    {
      label: "Prestasi",
      value: database.prestasi.length,
      icon: Medal,
      key: "prestasi",
      color: "gold",
      detail: `${database.prestasi.filter((item) => item.status === "Terbit").length} dipublikasikan`,
    },
    {
      label: "Agenda Event",
      value: database.event.length,
      icon: CalendarDays,
      key: "event",
      color: "purple",
      detail: `${database.event.filter((item) => item.status === "Mendatang").length} akan datang`,
    },
  ];
  const searchResults =
    query.trim() && section === "dashboard"
      ? (Object.keys(SECTIONS) as SectionKey[])
          .flatMap((key) =>
            database[key]
              .filter((row) =>
                [row.title, row.detail]
                  .join(" ")
                  .toLocaleLowerCase("id")
                  .includes(query.toLocaleLowerCase("id")),
              )
              .map((row) => ({ ...row, section: key })),
          )
          .slice(0, 8)
      : [];
  return (
    <div className="admin-app">
      {drawer && (
        <button
          className="admin-drawer-backdrop"
          aria-label="Tutup menu navigasi"
          onClick={() => setDrawer(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        className={`admin-sidebar ${drawer ? "is-open" : ""}`}
        role={drawer ? "dialog" : undefined}
        aria-modal={drawer || undefined}
        aria-label="Navigasi admin"
      >
        <button
          className="admin-icon-btn admin-drawer-close"
          onClick={() => setDrawer(false)}
          aria-label="Tutup navigasi admin"
        >
          <X size={20} />
        </button>
        <Link className="admin-brand" to="/admin">
          <img src="/images/logo.png" alt="KONI Kabupaten Kampar" />
          <span>
            Admin Panel<small>Ruang pengelola</small>
          </span>
        </Link>
        <span className="admin-nav-label">RUANG KERJA</span>
        <nav>
          <Link
            className={`admin-nav-link ${section === "dashboard" ? "active" : ""}`}
            to="/admin"
          >
            <LayoutDashboard size={19} /> Dashboard
          </Link>
          {(Object.entries(SECTIONS) as [SectionKey, SectionConfig][]).map(
            ([key, entry]) => (
              <Link
                className={`admin-nav-link ${section === key ? "active" : ""}`}
                to={`/admin/${key}`}
                key={key}
              >
                <entry.icon size={19} />
                {entry.title}
              </Link>
            ),
          )}
        </nav>
        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-tip">
            <ShieldCheck size={20} />
            <strong>Mode demo</strong>
            <p>Data contoh tersimpan hanya di browser Anda.</p>
          </div>
          <Link className="admin-nav-link" to="/">
            <ExternalLink size={18} /> Lihat website
          </Link>
          <button className="admin-nav-link admin-logout" onClick={logout}>
            <LogOut size={18} /> Keluar dari demo
          </button>
        </div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            className="admin-icon-btn admin-mobile-menu"
            onClick={() => setDrawer(true)}
            aria-label="Buka navigasi admin"
            aria-expanded={drawer}
          >
            <Menu size={22} />
          </button>
          <span className="admin-topbar-crumb">
            KONI Kampar <ChevronRight size={14} />
            <strong>{config?.title || "Dashboard"}</strong>
          </span>
          <div className="admin-topbar-right">
            <div className="admin-notifications">
              <button
                className="admin-icon-btn"
                aria-label="Lihat aktivitas sesi demo"
                aria-expanded={notifications}
                onClick={() => setNotifications((current) => !current)}
              >
                <Bell size={20} />
                <i />
              </button>
              {notifications && (
                <div className="admin-notification-popover">
                  <strong>Aktivitas sesi ini</strong>
                  {activities.slice(0, 4).map((activity) => (
                    <div key={activity.id}>
                      <Activity size={16} />
                      <p>
                        {activity.text}
                        <small>{activity.detail}</small>
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="admin-user">
              <span>A</span>
              <div>
                <strong>Admin Demo</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>
        <main id="main-content" className="admin-main">
          <div className="admin-page-heading">
            <div>
              <span className="admin-overline">
                RUANG PENGELOLA KONI KAMPAR
              </span>
              <h1>{config?.title || "Selamat datang, Admin."}</h1>
              <p>
                {config?.description ||
                  "Satu ruang untuk mengelola informasi olahraga Kampar."}
              </p>
            </div>
            {section === "dashboard" ? (
              <span className="admin-date">
                <CalendarDays size={16} />
                {new Intl.DateTimeFormat("id-ID", {
                  timeZone: "Asia/Jakarta",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date())}
              </span>
            ) : (
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => setEditor({ section, item: null })}
              >
                <Plus size={18} />
                {section === "galeri"
                  ? "Upload Foto"
                  : `Tambah ${config?.singular}`}
              </button>
            )}
          </div>
          <div className="admin-demo-banner">
            <span>
              <ShieldCheck size={17} />
              <strong>Mode demo</strong>
              <span>Data tersimpan di browser ini.</span>
            </span>
            <Link to="/">
              Buka website <ArrowRight size={15} />
            </Link>
          </div>
          {section === "dashboard" ? (
            <>
              <div className="admin-stat-grid">
                {stats.map((stat) => (
                  <Link
                    to={`/admin/${stat.key}`}
                    key={stat.label}
                    className="admin-stat-card"
                  >
                    <span className={`admin-stat-icon ${stat.color}`}>
                      <stat.icon size={23} />
                    </span>
                    <ChevronRight className="admin-stat-arrow" size={18} />
                    <strong>{stat.value.toLocaleString("id-ID")}</strong>
                    <span>{stat.label}</span>
                    <small>{stat.detail}</small>
                  </Link>
                ))}
              </div>
              <div className="admin-dashboard-search">
                <Search size={19} />
                <input
                  aria-label="Cari seluruh data demo"
                  placeholder="Cari berita, cabor, event, atau data lainnya…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <button
                    aria-label="Hapus pencarian"
                    className="admin-icon-btn"
                    onClick={() => setQuery("")}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
              {query.trim() ? (
                <section className="admin-panel">
                  <h2>
                    Hasil pencarian{" "}
                    <span className="admin-count">{searchResults.length}</span>
                  </h2>
                  {searchResults.length ? (
                    <div className="admin-search-results">
                      {searchResults.map((result) => (
                        <Link
                          key={`${result.section}-${result.id}`}
                          to={`/admin/${result.section}`}
                        >
                          <span>
                            <small>{SECTIONS[result.section].title}</small>
                            <strong>{result.title}</strong>
                          </span>
                          <ArrowRight size={18} />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="admin-empty">
                      <Search size={28} />
                      <h3>Data tidak ditemukan</h3>
                      <p>Coba kata kunci yang lebih singkat.</p>
                    </div>
                  )}
                </section>
              ) : (
                <>
                  <div className="admin-dashboard-middle">
                    <section className="admin-panel">
                      <div className="admin-panel-heading">
                        <h2>Aksi cepat</h2>
                        <span>Mulai dari sini</span>
                      </div>
                      <div className="admin-quick-grid">
                        {(
                          [
                            {
                              key: "cabor",
                              label: "Tambah Cabor",
                              icon: Trophy,
                              color: "blue",
                            },
                            {
                              key: "berita",
                              label: "Tulis Berita",
                              icon: Newspaper,
                              color: "green",
                            },
                            {
                              key: "event",
                              label: "Tambah Event",
                              icon: CalendarDays,
                              color: "purple",
                            },
                            {
                              key: "galeri",
                              label: "Upload Foto",
                              icon: ImagePlus,
                              color: "gold",
                            },
                          ] as {
                            key: SectionKey;
                            label: string;
                            icon: LucideIcon;
                            color: string;
                          }[]
                        ).map((action) => (
                          <button
                            key={action.key}
                            className={`admin-quick-action ${action.color}`}
                            onClick={() =>
                              setEditor({ section: action.key, item: null })
                            }
                          >
                            <action.icon size={21} />
                            <span>{action.label}</span>
                            <Plus size={15} />
                          </button>
                        ))}
                      </div>
                      <div className="admin-quick-footer">
                        <Trophy size={29} />
                        <p>
                          Informasi yang rapi,
                          <br />
                          <strong>semangat juara yang tersampaikan.</strong>
                        </p>
                      </div>
                    </section>
                    <section className="admin-panel">
                      <div className="admin-panel-heading">
                        <h2>Aktivitas terbaru</h2>
                        <span>Sesi demo ini</span>
                      </div>
                      <div className="admin-activity-list">
                        {activities.slice(0, 4).map((activity) => (
                          <div className="admin-activity-row" key={activity.id}>
                            <span>
                              <Activity size={17} />
                            </span>
                            <div>
                              <strong>{activity.text}</strong>
                              <small>{activity.detail}</small>
                            </div>
                            <time>{activity.time}</time>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                  <div className="admin-dashboard-bottom">
                    <section className="admin-panel">
                      <div className="admin-panel-heading">
                        <h2>Berita terbaru</h2>
                        <Link to="/admin/berita">
                          Kelola berita <ArrowRight size={15} />
                        </Link>
                      </div>
                      <div className="admin-latest-list">
                        {database.berita.length ? (
                          database.berita.slice(0, 3).map((item) => (
                            <button
                              key={item.id}
                              onClick={() =>
                                setEditor({ section: "berita", item })
                              }
                            >
                              {item.image ? (
                                <img src={item.image} alt="" />
                              ) : (
                                <span className="admin-latest-placeholder">
                                  <Newspaper size={20} />
                                </span>
                              )}
                              <span>
                                <strong>{item.title}</strong>
                                <small>{displayDate(item.date)}</small>
                              </span>
                              <span
                                className={`admin-status ${statusClass(item.status)}`}
                              >
                                {item.status}
                              </span>
                            </button>
                          ))
                        ) : (
                          <p className="admin-panel-empty">
                            Belum ada berita. Mulai dengan menulis berita
                            pertama.
                          </p>
                        )}
                      </div>
                    </section>
                    <section className="admin-panel">
                      <div className="admin-panel-heading">
                        <h2>Agenda kegiatan</h2>
                        <Link to="/admin/event">
                          Kelola event <ArrowRight size={15} />
                        </Link>
                      </div>
                      <div className="admin-agenda-list">
                        {database.event.length ? (
                          database.event.slice(0, 3).map((item) => (
                            <button
                              key={item.id}
                              onClick={() =>
                                setEditor({ section: "event", item })
                              }
                            >
                              <span className="admin-calendar-box">
                                <strong>
                                  {new Date(
                                    `${item.date}T12:00:00`,
                                  ).getDate() || "—"}
                                </strong>
                                <small>
                                  {new Date(
                                    `${item.date}T12:00:00`,
                                  ).toLocaleDateString("id-ID", {
                                    month: "short",
                                  })}
                                </small>
                              </span>
                              <span>
                                <strong>{item.title}</strong>
                                <small>{item.detail}</small>
                              </span>
                              <ChevronRight size={17} />
                            </button>
                          ))
                        ) : (
                          <p className="admin-panel-empty">
                            Belum ada event yang ditambahkan.
                          </p>
                        )}
                      </div>
                    </section>
                  </div>
                </>
              )}
            </>
          ) : (
            <section className="admin-data-panel">
              <div className="admin-table-toolbar">
                <div className="admin-table-search">
                  <Search size={18} />
                  <input
                    aria-label={`Cari ${config?.title.toLowerCase()}`}
                    placeholder={`Cari ${config?.title.toLowerCase()}…`}
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setPage(1);
                    }}
                  />
                </div>
                <select
                  aria-label="Filter berdasarkan status"
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setPage(1);
                  }}
                >
                  <option>Semua status</option>
                  {config?.statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <button
                  className="admin-btn admin-btn-light"
                  onClick={() => exportData(section)}
                >
                  <ArrowDownToLine size={17} />
                  <span>Ekspor CSV</span>
                </button>
              </div>
              {section === "galeri" ? (
                <div className="admin-gallery-grid">
                  {visibleRows.map((item) => (
                    <article className="admin-gallery-item" key={item.id}>
                      {item.image ? (
                        <img src={item.image} alt={item.detail} />
                      ) : (
                        <div className="admin-gallery-placeholder">
                          <Images size={36} />
                        </div>
                      )}
                      <div>
                        <span
                          className={`admin-status ${statusClass(item.status)}`}
                        >
                          {item.status}
                        </span>
                        <h3>{item.title}</h3>
                        <p>
                          {item.category} · {displayDate(item.date)}
                        </p>
                        <div className="admin-gallery-actions">
                          <button onClick={() => setEditor({ section, item })}>
                            <Pencil size={15} /> Edit foto
                          </button>
                          <button
                            className="admin-icon-btn"
                            aria-label={`Hapus ${item.title}`}
                            onClick={() => setDeleting({ section, item })}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="admin-table-scroll">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th scope="col">{config?.titleLabel}</th>
                        <th scope="col">{config?.categoryLabel}</th>
                        {section === "cabor" ? (
                          <>
                            <th scope="col">Atlet</th>
                            <th scope="col">Prestasi</th>
                          </>
                        ) : (
                          <th scope="col">
                            {config?.amountLabel ||
                              config?.dateLabel ||
                              config?.detailLabel}
                          </th>
                        )}
                        <th scope="col">Status</th>
                        <th scope="col" className="admin-actions-th">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleRows.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="admin-cell-title">
                              <span className="admin-row-icon">
                                {config && <config.icon size={20} />}
                              </span>
                              <div>
                                <strong>{item.title}</strong>
                                {section !== "administrator" && (
                                  <small>{item.detail}</small>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{item.category}</td>
                          {section === "cabor" ? (
                            <>
                              <td>{item.amount} atlet</td>
                              <td>{item.secondary} prestasi</td>
                            </>
                          ) : (
                            <td>
                              {config?.amountLabel
                                ? item.amount.toLocaleString("id-ID")
                                : config?.dateLabel
                                  ? displayDate(item.date)
                                  : item.detail}
                            </td>
                          )}
                          <td>
                            <span
                              className={`admin-status ${statusClass(item.status)}`}
                            >
                              <i />
                              {item.status}
                            </span>
                          </td>
                          <td>
                            <div className="admin-row-actions">
                              <button
                                className="admin-icon-btn"
                                aria-label={`Edit ${item.title}`}
                                onClick={() => setEditor({ section, item })}
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                className="admin-icon-btn admin-delete-btn"
                                aria-label={`Hapus ${item.title}`}
                                onClick={() => setDeleting({ section, item })}
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!filteredRows.length && (
                <div className="admin-empty">
                  <Search size={32} />
                  <h3>
                    {query || statusFilter !== "Semua status"
                      ? "Tidak ada hasil yang cocok"
                      : "Belum ada data"}
                  </h3>
                  <p>
                    {query || statusFilter !== "Semua status"
                      ? "Coba ubah kata kunci atau pilihan status."
                      : `Tambahkan ${config?.singular.toLowerCase()} pertama untuk memulai.`}
                  </p>
                  {(query || statusFilter !== "Semua status") && (
                    <button
                      className="admin-btn admin-btn-light"
                      onClick={() => {
                        setQuery("");
                        setStatusFilter("Semua status");
                      }}
                    >
                      Reset pencarian
                    </button>
                  )}
                </div>
              )}
              <div className="admin-pagination">
                <span>
                  {filteredRows.length
                    ? `Menampilkan ${(safePage - 1) * 5 + 1}–${Math.min(safePage * 5, filteredRows.length)} dari ${filteredRows.length} data`
                    : "0 data"}
                </span>
                <div>
                  <button
                    className="admin-icon-btn"
                    disabled={safePage === 1}
                    aria-label="Halaman sebelumnya"
                    onClick={() => setPage(safePage - 1)}
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span>
                    {safePage} <small>/ {pageCount}</small>
                  </span>
                  <button
                    className="admin-icon-btn"
                    disabled={safePage >= pageCount}
                    aria-label="Halaman berikutnya"
                    onClick={() => setPage(safePage + 1)}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </section>
          )}
          <footer className="admin-footer">
            <span>© {new Date().getFullYear()} KONI Kabupaten Kampar</span>
            <span>
              <ShieldCheck size={14} /> Frontend demo
            </span>
          </footer>
        </main>
      </div>
      {editor && (
        <ItemDialog
          key={`${editor.section}-${editor.item?.id || "new"}`}
          section={editor.section}
          item={editor.item}
          onClose={() => setEditor(null)}
          onSave={saveItem}
        />
      )}
      {deleting && (
        <DeleteDialog
          item={deleting.item}
          onClose={() => setDeleting(null)}
          onDelete={deleteItem}
        />
      )}
      {toast && (
        <div
          className={`admin-toast ${toast.error ? "is-error" : ""}`}
          role="status"
        >
          <span>
            {toast.error ? <X size={19} /> : <Check size={19} />}
            {toast.text}
          </span>
          {toast.undo && <button onClick={toast.undo}>Batalkan</button>}
          <button
            className="admin-icon-btn"
            aria-label="Tutup pemberitahuan"
            onClick={() => setToast(null)}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
