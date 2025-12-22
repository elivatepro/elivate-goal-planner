"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useGoalStore } from "@/lib/store";

function generateMemberId(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ELV${random}`;
}

export default function AdminPage() {
  const { memberId, setMemberId } = useGoalStore();
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setInput(memberId || "");
  }, [memberId]);

  const saveMemberId = (value: string, note?: string) => {
    const normalized = value.trim().toUpperCase();
    if (!normalized) {
      setMessage("Enter a Member ID first.");
      return;
    }
    setMemberId(normalized);
    setInput(normalized);
    setMessage(note ?? "Member ID saved.");
  };

  const handleGenerate = () => {
    const id = generateMemberId();
    saveMemberId(id, "Generated and saved a new Member ID.");
  };

  return (
    <div className="min-h-screen bg-page px-4 py-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Admin</p>
            <h1 className="text-2xl font-semibold text-ink">Member IDs</h1>
          </div>
          <Link href="/" className="button button-secondary">
            Back to planner
          </Link>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-ink">Set Member ID</h2>
              <p className="text-sm text-muted">
                Save a specific Member ID or generate a random one on the fly.
              </p>
            </div>
            <span className="pill">Current: {input || "Not set"}</span>
          </div>

          <label className="label" htmlFor="member-id">
            Member ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="member-id"
              className="input flex-1"
              placeholder="ELV123456"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="button"
              onClick={() => saveMemberId(input)}
              className="button button-primary w-full sm:w-auto"
            >
              Save Member ID
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border border-border rounded-lg p-4 bg-page">
            <div>
              <p className="font-semibold text-ink">Random Member ID</p>
              <p className="text-sm text-muted">
                Generate an ELV-prefixed ID and save it immediately.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerate}
              className="button button-secondary w-full sm:w-auto"
            >
              Generate & Save
            </button>
          </div>

          {message && (
            <p className="text-sm text-success" role="status">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
