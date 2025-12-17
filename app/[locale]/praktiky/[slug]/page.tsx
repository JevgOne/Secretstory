"use client";

import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { getServiceById, getServiceName } from "@/lib/services";

export default function PraktikaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations();

  // Find the service by slug (which is the service ID)
  const service = getServiceById(slug);

  if (!service) {
    return (
      <div className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
        <h1>Praktika nenalezena</h1>
        <Link href={`/${locale}/praktiky`}>← Zpět na všechny praktiky</Link>
      </div>
    );
  }

  const serviceName = getServiceName(slug, locale);

  return (
    <div className="container" style={{ padding: "100px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <Link href={`/${locale}/praktiky`} style={{ display: "inline-block", marginBottom: "2rem", color: "var(--wine)" }}>
        ← Zpět na všechny praktiky
      </Link>

      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "var(--wine)" }}>
        #{serviceName}
      </h1>

      <div style={{
        background: "rgba(139, 41, 66, 0.1)",
        padding: "2rem",
        borderRadius: "12px",
        marginTop: "2rem"
      }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>O této praktice</h2>
        <p style={{ lineHeight: "1.8", color: "rgba(255,255,255,0.8)" }}>
          {serviceName} je jedna z praktik které nabízejí naše escort dívky.
          Prozkoumejte profily holek které tuto službu poskytují.
        </p>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1.5rem" }}>Dívky nabízející {serviceName}</h2>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>
          Seznam holek bude brzy dostupný...
        </p>
      </div>
    </div>
  );
}
