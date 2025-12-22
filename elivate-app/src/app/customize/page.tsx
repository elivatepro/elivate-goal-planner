"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const colorOptions = [
  { name: "Green", value: "green", primary: "#15803d", light: "#f0fdf4" },
  { name: "Blue", value: "blue", primary: "#1e40af", light: "#eff6ff" },
  { name: "Purple", value: "purple", primary: "#7e22ce", light: "#faf5ff" },
  { name: "Orange", value: "orange", primary: "#c2410c", light: "#fff7ed" },
  { name: "Red", value: "red", primary: "#b91c1c", light: "#fef2f2" },
  { name: "Teal", value: "teal", primary: "#0f766e", light: "#f0fdfa" },
];

export default function CustomizePage() {
  const [teamName, setTeamName] = useState("");
  const [selectedColor, setSelectedColor] = useState("green");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    const baseUrl = window.location.origin;
    const encodedTeamName = encodeURIComponent(teamName.trim());

    const link = `${baseUrl}?team=${encodedTeamName}&color=${selectedColor}`;
    setGeneratedLink(link);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Customize Your Goal Planner
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            Create a personalized link for your team with custom branding
          </p>

          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Team Name */}
            <div>
              <label htmlFor="teamName" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Team Name
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Elivate Network, Dream Team, etc."
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-green-500 dark:focus:border-green-400 focus:ring-0 transition-colors"
                required
              />
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                Brand Color
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setSelectedColor(color.value)}
                    className={`relative p-4 rounded-lg border-2 transition-all ${
                      selectedColor === color.value
                        ? "border-slate-900 dark:border-white shadow-md"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color.primary }}
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {color.name}
                      </span>
                    </div>
                    {selectedColor === color.value && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Generate Custom Link
            </button>
          </form>

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-700 rounded-lg border-2 border-green-500">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                Your Custom Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                Share this link with your team. When they visit it, they'll see "{teamName}" as the app name with your selected color theme.
              </p>
            </div>
          )}
        </div>

        {/* Preview */}
        {teamName && (
          <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Preview</h2>
            <div
              className="p-6 rounded-lg"
              style={{
                backgroundColor: colorOptions.find(c => c.value === selectedColor)?.light,
                borderColor: colorOptions.find(c => c.value === selectedColor)?.primary,
                borderWidth: '2px'
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: colorOptions.find(c => c.value === selectedColor)?.primary }}
                >
                  {teamName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: colorOptions.find(c => c.value === selectedColor)?.primary }}
                  >
                    {teamName}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Goal Planner</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
