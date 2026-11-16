"use client";

import { useMemo, useState } from "react";
import {
  Lock,
  Unlock,
  Calendar,
  CheckCircle2,
  FileText,
  Clock,
  UserRound,
  History,
  Search,
  ChevronRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Session = {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  method: string;
  status: "Selesai" | "Terjadwal";
};

type Note = { id: string; sessionId: string; studentId: string; date: string; text: string };

const sessions: Session[] = [
  { id: "SES-102062-03", studentId: "MHS-102062", studentName: "Nadia Putri", date: "12 November 2026 • 14:00 WIB", method: "Chat E2EE", status: "Selesai" },
  { id: "SES-102062-02", studentId: "MHS-102062", studentName: "Nadia Putri", date: "29 Oktober 2026 • 10:00 WIB", method: "Tatap Muka", status: "Selesai" },
  { id: "SES-102062-04", studentId: "MHS-102062", studentName: "Nadia Putri", date: "26 November 2026 • 14:00 WIB", method: "Chat E2EE", status: "Terjadwal" },
  { id: "SES-104381-01", studentId: "MHS-104381", studentName: "Raka Pratama", date: "10 November 2026 • 09:00 WIB", method: "Video", status: "Selesai" },
];

const initialNotes: Note[] = [
  { id: "note-1", sessionId: "SES-102062-02", studentId: "MHS-102062", date: "29 Oktober 2026", text: "Mahasiswa mulai mengenali pemicu kecemasan menjelang tenggat akademik. Menyepakati latihan grounding singkat dan membagi tugas besar menjadi langkah kecil. Tinjau kembali penerapan latihan pada sesi berikutnya." },
  { id: "note-2", sessionId: "SES-104381-01", studentId: "MHS-104381", date: "10 November 2026", text: "Membahas strategi menjaga rutinitas tidur selama masa ujian. Mahasiswa akan mencoba jadwal istirahat yang lebih konsisten dan mencatat perubahan energi." },
];

export default function PsikologSesiPage() {
  const [selectedId, setSelectedId] = useState(sessions[0].id);
  const [consents, setConsents] = useState<Record<string, boolean>>({ [sessions[0].id]: true, [sessions[1].id]: true });
  const [notes, setNotes] = useState(initialNotes);
  const [ringkasan, setRingkasan] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [query, setQuery] = useState("");

  const selected = sessions.find((session) => session.id === selectedId) ?? sessions[0];
  const hasConsent = Boolean(consents[selected.id]);
  const history = useMemo(
    () => notes.filter((note) => note.studentId === selected.studentId).sort((a, b) => b.id.localeCompare(a.id)),
    [notes, selected.studentId],
  );
  const filteredSessions = sessions.filter((session) =>
    `${session.studentName} ${session.studentId} ${session.date}`.toLowerCase().includes(query.toLowerCase()),
  );

  function chooseSession(id: string) {
    setSelectedId(id);
    setRingkasan("");
    setSavedMessage("");
  }

  function saveNote() {
    const text = ringkasan.trim();
    if (!text || !hasConsent || selected.status !== "Selesai") return;
    setNotes((current) => [
      { id: `note-${Date.now()}`, sessionId: selected.id, studentId: selected.studentId, date: "Hari ini", text },
      ...current,
    ]);
    setRingkasan("");
    setSavedMessage("Ringkasan tersimpan untuk sesi ini.");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-serif font-black text-brand dark:text-text">Jadwal & Riwayat Sesi</h1>
        <p className="text-sm text-text-muted">Catat perkembangan dengan persetujuan mahasiswa dan gunakan riwayat untuk menjaga kesinambungan pendampingan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.7fr)] gap-5 items-start">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bold text-brand dark:text-text">Daftar sesi</h2>
            <Badge variant="outline">{filteredSessions.length} sesi</Badge>
          </div>
          <label className="relative block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari mahasiswa atau ID" className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-surface py-2.5 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-focus" />
          </label>
          <div className="space-y-2" role="list" aria-label="Daftar sesi konseling">
            {filteredSessions.map((session) => (
              <button key={session.id} type="button" onClick={() => chooseSession(session.id)} aria-current={selected.id === session.id ? "true" : undefined} className={`w-full rounded-2xl border p-3 text-left transition-colors ${selected.id === session.id ? "border-brand bg-brand/5" : "border-black/10 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"}`}>
                <span className="flex items-start justify-between gap-2">
                  <span>
                    <span className="block text-sm font-bold text-brand dark:text-text">{session.studentName}</span>
                    <span className="block mt-0.5 text-[11px] text-text-muted">{session.studentId} · {session.id}</span>
                  </span>
                  <ChevronRight className={`mt-1 h-4 w-4 shrink-0 ${selected.id === session.id ? "text-brand" : "text-text-muted"}`} />
                </span>
                <span className="mt-3 flex items-center justify-between gap-2 text-[11px] text-text-muted">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{session.date}</span>
                  <Badge variant={session.status === "Selesai" ? "mint" : "lavender"}>{session.status}</Badge>
                </span>
              </button>
            ))}
            {filteredSessions.length === 0 && <p className="rounded-xl bg-black/[0.03] p-4 text-xs text-text-muted">Tidak ada sesi yang cocok dengan pencarian.</p>}
          </div>
        </Card>

        <div className="space-y-5">
          <Card className="p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-brand dark:text-text">
                  <UserRound className="h-5 w-5" />
                  <h2 className="text-lg font-bold">{selected.studentName}</h2>
                </div>
                <p className="mt-1 text-xs text-text-muted">{selected.studentId} · {selected.id}</p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted"><Calendar className="h-3.5 w-3.5" />{selected.date} <span>·</span> {selected.method}</p>
              </div>
              <Badge variant={selected.status === "Selesai" ? "mint" : "lavender"}>{selected.status}</Badge>
            </div>

            <section className={`rounded-2xl border p-4 space-y-2 ${hasConsent ? "border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20" : "border-amber-300 bg-amber-50 dark:bg-amber-950/20"}`} aria-label="Status persetujuan mahasiswa">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-bold">
                  {hasConsent ? <Unlock className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-amber-600" />}
                  Persetujuan pencatatan ringkasan
                </span>
                <Button variant={hasConsent ? "outline" : "secondary"} size="sm" onClick={() => setConsents((current) => ({ ...current, [selected.id]: !hasConsent }))}>
                  {hasConsent ? "Simulasikan pencabutan" : "Simulasikan persetujuan"}
                </Button>
              </div>
              <p className="text-xs text-text-muted">{hasConsent ? "Persetujuan aktif. Ringkasan dapat dicatat untuk sesi ini." : "Ringkasan terkunci sampai mahasiswa memberikan persetujuan."} Demo UI: status persetujuan disimulasikan secara lokal.</p>
            </section>

            <section className="space-y-3">
              <label htmlFor="session-summary" className="flex items-center gap-2 text-sm font-bold text-brand dark:text-text"><FileText className="h-4 w-4" />Ringkasan sesi</label>
              <p className="text-xs text-text-muted">Catat fokus pembahasan, perkembangan yang teramati, dan tindak lanjut yang disepakati. Hindari informasi yang tidak relevan.</p>
              <textarea id="session-summary" disabled={!hasConsent || selected.status !== "Selesai"} value={ringkasan} onChange={(event) => { setRingkasan(event.target.value); setSavedMessage(""); }} rows={5} placeholder={selected.status !== "Selesai" ? "Ringkasan dapat dicatat setelah sesi selesai." : hasConsent ? "Tuliskan ringkasan dan rencana tindak lanjut..." : "Form terkunci hingga mahasiswa menyetujui pencatatan."} className={`w-full resize-y rounded-2xl border p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-focus ${hasConsent && selected.status === "Selesai" ? "border-black/10 dark:border-white/10 bg-surface" : "border-black/5 bg-black/5 dark:bg-white/5 cursor-not-allowed opacity-60"}`} />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-text-muted">{ringkasan.length} karakter</span>
                <Button disabled={!hasConsent || selected.status !== "Selesai" || !ringkasan.trim()} onClick={saveNote} className="gap-2"><CheckCircle2 className="h-4 w-4" />Simpan ringkasan</Button>
              </div>
              {savedMessage && <p role="status" className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><CheckCircle2 className="h-4 w-4" />{savedMessage}</p>}
            </section>
          </Card>

          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="flex items-center gap-2 font-bold text-brand dark:text-text"><History className="h-4 w-4" />Riwayat pendampingan</h2>
                <p className="mt-1 text-xs text-text-muted">Ringkasan sesi sebelumnya untuk {selected.studentName}.</p>
              </div>
              <Badge variant="outline">{history.length} catatan</Badge>
            </div>
            {history.length ? (
              <ol className="space-y-3">
                {history.map((note) => {
                  const relatedSession = sessions.find((session) => session.id === note.sessionId);
                  return (
                    <li key={note.id} className="relative rounded-2xl border border-black/10 dark:border-white/10 p-4">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-brand dark:text-text"><Clock className="h-3.5 w-3.5" />{note.date}</span>
                        <span className="text-[11px] text-text-muted">{relatedSession?.id ?? note.sessionId}</span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">{note.text}</p>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="rounded-2xl border border-dashed border-black/15 dark:border-white/15 p-6 text-center">
                <FileText className="mx-auto h-6 w-6 text-text-muted" />
                <p className="mt-2 text-sm font-semibold">Belum ada ringkasan sesi</p>
                <p className="mt-1 text-xs text-text-muted">Ringkasan yang disimpan dengan persetujuan akan muncul di sini.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
