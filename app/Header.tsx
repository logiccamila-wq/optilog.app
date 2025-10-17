"use client";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function Header() {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)", borderBottom: "1px solid #222" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "8px 16px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <Image src="/logo-xyz.svg" alt="OptiLog" width={24} height={24} />
          <strong style={{ color: "#9ecfff" }}>OptiLog</strong>
        </Link>
        <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/dashboard" style={{ color: "#ddd" }}>Dashboard</Link>
          <span style={{ color: "#666" }}>|</span>
          <Link href="/cadastro/motoristas" style={{ color: "#9ecfff" }}>Cadastro: Motoristas</Link>
          <Link href="/cadastro/veiculos" style={{ color: "#9ecfff" }}>Cadastro: Veículos</Link>
          <Link href="/usuarios" style={{ color: "#9ecfff" }}>Cadastro: Usuários</Link>
          <span style={{ color: "#666" }}>|</span>
          <Link href="/admin" style={{ color: "#9ecfff" }}>Admin</Link>
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <Link href="/login" style={{ color: "#ddd" }}>Login</Link>
          <Link href="/signup" style={{ color: "#ddd" }}>Cadastro</Link>
        </div>
      </div>
    </header>
  );
}