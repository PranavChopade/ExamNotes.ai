import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { api } from "../services/api";
import { useUser } from "../hooks/useUser";
import { FiInfo, FiFileText, FiSearch, FiEye, FiRefreshCw, FiTrash2, FiX, FiCopy } from "react-icons/fi";

/**
 * Dashboard - A focused workspace for exam preparation
 * Designed to feel like a real productivity tool, not a landing page
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);

  // Form state
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [generating, setGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState(null);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [activeTab, setActiveTab] = useState("generate");

  // Error state
  const [error, setError] = useState(null);

  // Thinking state for more natural feedback
  const [thinkingPhase, setThinkingPhase] = useState("");

  // View note state
  const [viewingNote, setViewingNote] = useState(null);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const { profileHandler } = useUser();

  useEffect(() => {
    if (!userData) {
      navigate("/auth");
      return;
    }
    fetchNotes();
  }, [userData, navigate]);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      const response = await api.get("/notes/v1/my-notes");
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleGenerateNotes = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }
    if (userData.credits < 15) {
      setError("Not enough credits. You need 15 credits to generate notes.");
      return;
    }

    try {
      setGenerating(true);
      setError(null);
      setGeneratedNote(null);

      // Natural thinking phases
      setThinkingPhase("Researching topic...");
      await new Promise(resolve => setTimeout(resolve, 800));

      setThinkingPhase("Organizing information...");
      await new Promise(resolve => setTimeout(resolve, 600));

      const response = await api.post("/notes/v1/generate", {
        topic: topic.trim(),
        difficulty,
      });

      setThinkingPhase("Finalizing notes...");
      await new Promise(resolve => setTimeout(resolve, 400));

      setGeneratedNote(response.data.notes);
      setTopic("");
      setThinkingPhase("");
      await fetchNotes();
      await profileHandler();
    } catch (error) {
      console.error("Error generating notes:", error);
      setError(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
      setThinkingPhase("");
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Delete this note? This can't be undone.")) return;

    try {
      await api.delete(`/notes/v1/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyLabel = (diff) => {
    switch (diff) {
      case "beginner": return "Beginner";
      case "intermediate": return "Intermediate";
      case "advanced": return "Advanced";
      default: return diff;
    }
  };

  // Get recent topics for quick access
  const recentTopics = notes.slice(0, 3);

  if (!userData) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header - Warm, human, left-aligned */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-stone-800 mb-1">
            What do you want to study today?
          </h1>
          <p className="text-stone-500 text-sm">
            Generate notes on any topic. <span className="text-teal-600 font-medium">{userData.credits}</span> credits remaining.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="flex-1">
            {/* Recent topics - Quick continue */}
            {recentTopics.length > 0 && !generating && !generatedNote && (
              <div className="mb-6">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-3">Continue studying</p>
                <div className="flex flex-wrap gap-2">
                  {recentTopics.map((note) => (
                    <button
                      key={note._id}
                      onClick={() => setTopic(note.topic)}
                      className="px-3 py-1.5 bg-white border border-stone-200 rounded-md text-sm text-stone-600 hover:border-teal-300 hover:text-teal-700 transition-all hover:shadow-sm"
                    >
                      {note.topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main input area */}
            <div className="bg-white rounded-lg border border-stone-200 shadow-sm">
              {/* Tab switcher */}
              <div className="flex border-b border-stone-100">
                <button
                  onClick={() => setActiveTab("generate")}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "generate"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "history"
                    ? "border-teal-600 text-teal-700"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                    }`}
                >
                  My Notes
                  {notes.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-stone-100 text-stone-500 rounded text-xs">
                      {notes.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Generate Tab Content */}
              {activeTab === "generate" && (
                <div className="p-6">
                  <form onSubmit={handleGenerateNotes} className="space-y-5">
                    {/* Topic input */}
                    <div>
                      <label className="block text-sm text-stone-600 mb-2">
                        Topic
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., JavaScript fundamentals, World War II, Organic Chemistry..."
                        className="w-full px-4 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none transition-all text-stone-800 placeholder-stone-400 bg-stone-50/50"
                        disabled={generating}
                      />
                      <p className="mt-1.5 text-xs text-stone-400">
                        Be specific for better results. Include chapter names or key concepts.
                      </p>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm text-stone-600 mb-2">
                        Level
                      </label>
                      <div className="flex gap-2">
                        {["beginner", "intermediate", "advanced"].map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setDifficulty(level)}
                            disabled={generating}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium capitalize transition-all border ${difficulty === level
                              ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                              : "bg-white text-stone-500 border-stone-200 hover:border-teal-200 hover:text-teal-700"
                              }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Credits info  */}
                    <div className="flex items-center justify-between py-2.5 px-3 bg-stone-50 rounded-lg border border-stone-100">
                      <div className="flex items-center gap-2">
                        <FiInfo className="w-3.5 h-3.5 text-stone-400" />
                        <span className="text-xs text-stone-500">Costs 15 credits</span>
                      </div>
                      <span className="text-xs text-stone-400">
                        {userData.credits} available
                      </span>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="py-2.5 px-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    {/* Thinking phases */}
                    {generating && thinkingPhase && (
                      <div className="py-3 px-4 bg-stone-50 border border-stone-100 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-stone-600">{thinkingPhase}</span>
                        </div>
                      </div>
                    )}

                    {/* Submit button -  */}
                    <button
                      type="submit"
                      disabled={generating || userData.credits < 15}
                      className="w-full py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-sm"
                    >
                      {generating ? "Generating..." : "Generate notes"}
                    </button>
                  </form>
                </div>
              )}

              {/* History Tab Content */}
              {activeTab === "history" && (
                <div className="p-6">
                  {loadingNotes ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-stone-200 border-t-stone-600 mx-auto"></div>
                      <p className="text-stone-400 mt-3 text-sm">Loading your notes...</p>
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="text-center py-12">
                      <FiFileText className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                      <h3 className="text-base font-medium text-stone-700 mb-1">No notes yet</h3>
                      <p className="text-stone-400 text-sm mb-4">
                        Generate your first set of notes to see them here.
                      </p>
                      <button
                        onClick={() => setActiveTab("generate")}
                        className="px-4 py-2 bg-teal-700 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors shadow-sm"
                      >
                        Create your first note
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Search and Filter */}
                      <div className="mb-4 space-y-3">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-200 focus:border-teal-400 outline-none"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFilterDifficulty("all")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "all" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setFilterDifficulty("beginner")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "beginner" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                          >
                            Beginner
                          </button>
                          <button
                            onClick={() => setFilterDifficulty("intermediate")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "intermediate" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                          >
                            Intermediate
                          </button>
                          <button
                            onClick={() => setFilterDifficulty("advanced")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "advanced" ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                          >
                            Advanced
                          </button>
                        </div>
                      </div>

                      {/* Filtered Notes */}
                      <div className="space-y-2">
                        {notes
                          .filter(note => {
                            const matchesSearch = note.topic.toLowerCase().includes(searchQuery.toLowerCase());
                            const matchesDifficulty = filterDifficulty === "all" || note.difficulty === filterDifficulty;
                            return matchesSearch && matchesDifficulty;
                          })
                          .map((note) => (
                            <div
                              key={note._id}
                              className="group p-4 rounded-lg border border-stone-100 hover:border-stone-200 hover:bg-stone-50/50 transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => setViewingNote(note)}
                                >
                                  <h4 className="font-medium text-stone-800 mb-1 truncate">
                                    {note.topic}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <span>{getDifficultyLabel(note.difficulty)}</span>
                                    <span>•</span>
                                    <span>{formatDate(note.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-stone-500 mt-2 line-clamp-2">
                                    {note.content.substring(0, 150)}...
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingNote(note);
                                    }}
                                    className="p-1.5 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                    title="View note"
                                  >
                                    <FiEye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTopic(note.topic);
                                      setDifficulty(note.difficulty);
                                      setActiveTab("generate");
                                    }}
                                    className="p-1.5 text-stone-400 hover:text-teal-600 hover:bg-teal-50 rounded transition-colors"
                                    title="Regenerate"
                                  >
                                    <FiRefreshCw className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNote(note._id);
                                    }}
                                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    title="Delete note"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Generated note result */}
            {generatedNote && (
              <div className="mt-6 bg-white rounded-2xl border-2 border-teal-100 shadow-xl shadow-teal-500/10 p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-teal-700">{generatedNote.topic}</h3>
                    <p className="text-sm text-stone-500 mt-2 flex items-center gap-2">
                      <span className="px-3 py-1 bg-teal-100 rounded-full text-teal-700 font-semibold text-xs">{getDifficultyLabel(generatedNote.difficulty)}</span>
                      <span>•</span>
                      <span>Generated just now</span>
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-linear-to-r from-teal-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg shadow-teal-500/30">
                    ✓ Created
                  </span>
                </div>
                <div className="space-y-4 text-sm">
                  {generatedNote.content.split("\n").map((line, i) => {
                    // SECTION HEADINGS with greenery/teal styling
                    if (line.startsWith("## CORE_CONCEPTS")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-linear-to-r from-teal-50 to-emerald-50 rounded-xl border-l-4 border-teal-500">
                          <div className="font-bold text-teal-700 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-linear-to-r from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">💡</span>
                            Core Concepts
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## QUICK_REVISION_QA")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-linear-to-r from-green-50 to-teal-50 rounded-xl border-l-4 border-green-500">
                          <div className="font-bold text-green-700 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-linear-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm">❓</span>
                            Quick Revision Q&A
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## IMPORTANT_POINTS")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-linear-to-r from-emerald-50 to-green-50 rounded-xl border-l-4 border-emerald-500">
                          <div className="font-bold text-emerald-700 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-linear-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center text-white text-sm">⭐</span>
                            Important Points
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## COMMON_MISTAKES")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-linear-to-r from-lime-50 to-emerald-50 rounded-xl border-l-4 border-lime-500">
                          <div className="font-bold text-lime-700 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-linear-to-r from-lime-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">⚠️</span>
                            Common Mistakes
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## COMPARISONS")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl border-l-4 border-teal-500">
                          <div className="font-bold text-teal-700 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-linear-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm">⚖️</span>
                            Comparisons
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## QUICK_RECALL")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-l-4 border-green-500">
                          <div className="font-bold text-green-700 flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-linear-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm">🧠</span>
                            Quick Recall
                          </div>
                        </div>
                      );
                    }

                    // Q&A Subheadings
                    if (line.startsWith("### Q")) {
                      return (
                        <div key={i} className="mt-4 font-bold text-teal-800 bg-teal-100 px-3 py-2 rounded-lg">
                          {line.replace("### ", "")}
                        </div>
                      );
                    }

                    // Comparison subheadings
                    if (line.startsWith("### ") && line.includes(" vs ")) {
                      return (
                        <div key={i} className="mt-4 font-bold text-teal-700 bg-teal-100 px-3 py-2 rounded-lg">
                          {line.replace("### ", "")}
                        </div>
                      );
                    }

                    // Answer lines
                    if (line.startsWith("Answer:")) {
                      return (
                        <div key={i} className="text-stone-700 pl-4 border-l-2 border-teal-300 bg-teal-50/50 py-2 px-3 rounded-r-lg">
                          {line}
                        </div>
                      );
                    }

                    // Bullet points with bold highlighting
                    if (line.startsWith("- ")) {
                      const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-600 font-semibold">$1</strong>');
                      return (
                        <div
                          key={i}
                          className="text-stone-700 pl-6 py-1 relative"
                          dangerouslySetInnerHTML={{ __html: `• ${boldText.substring(2)}` }}
                        />
                      );
                    }

                    // Skip empty lines
                    if (line.trim() === "") {
                      return <div key={i} className="h-2"></div>;
                    }

                    // NORMAL TEXT with bold highlighting
                    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-600 font-semibold">$1</strong>');
                    return (
                      <div
                        key={i}
                        className="text-stone-700 pl-2"
                        dangerouslySetInnerHTML={{ __html: boldText }}
                      />
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t-2 border-teal-100 flex gap-4">
                  <button
                    onClick={() => {
                      setGeneratedNote(null);
                      setActiveTab("generate");
                    }}
                    className="px-6 py-3 bg-teal-700 text-white rounded-xl font-semibold hover:bg-teal-600 transition-all duration-300 shadow-lg shadow-teal-500/30 hover:-translate-y-1"
                  >
                    ← Generate another note
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedNote.content);
                      alert("Notes copied to clipboard!");
                    }}
                    className="px-6 py-3 bg-white border-2 border-teal-200 text-teal-700 rounded-xl font-semibold hover:bg-teal-50 transition-all duration-300"
                  >
                    📋 Copy Notes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Quiet, functional */}
          <div className="lg:w-64 space-y-4">
            {/* Credits - Minimal, not screaming */}
            <div className="bg-linear-to-br from-teal-50 to-white rounded-lg border border-teal-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-teal-600 uppercase tracking-wide font-medium">Credits</span>
                <span className="text-lg font-semibold text-teal-700">{userData.credits}</span>
              </div>
              <p className="text-xs text-stone-400 mb-3">
                ~{Math.floor(userData.credits / 15)} generations left
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-2 bg-teal-700 rounded-lg text-xs font-medium text-white hover:bg-teal-600 transition-all shadow-sm"
              >
                Get more credits
              </button>
            </div>

            {/* Quick tips */}
            <div className="bg-linear-to-br from-amber-50/50 to-white rounded-lg border border-amber-100/50 p-4">
              <h3 className="text-xs text-amber-700 uppercase tracking-wide mb-3 font-medium">Tips</h3>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Be specific with topics for better results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Try "Photosynthesis" instead of just "Biology"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">•</span>
                  <span>Advanced level includes more detailed explanations</span>
                </li>
              </ul>
            </div>

            {/* Recent activity */}
            {notes.length > 0 && (
              <div className="bg-white rounded-lg border border-stone-200 p-4">
                <h3 className="text-xs text-stone-500 uppercase tracking-wide mb-3 font-medium">Recent</h3>
                <div className="space-y-2">
                  {notes.slice(0, 3).map((note) => (
                    <div
                      key={note._id}
                      onClick={() => {
                        setTopic(note.topic);
                        setActiveTab("generate");
                      }}
                      className="cursor-pointer group"
                    >
                      <p className="text-sm text-stone-600 group-hover:text-stone-800 transition-colors truncate">
                        {note.topic}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View Note Modal */}
      {viewingNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div>
                <h3 className="text-xl font-bold text-stone-800">{viewingNote.topic}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
                  <span className="px-2 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                    {getDifficultyLabel(viewingNote.difficulty)}
                  </span>
                  <span>•</span>
                  <span>{formatDate(viewingNote.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingNote(null)}
                className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-4 text-sm">
                {viewingNote.content.split("\n").map((line, i) => {
                  // SECTION HEADINGS
                  if (line.startsWith("## CORE_CONCEPTS")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-linear-to-r from-teal-50 to-emerald-50 rounded-lg border-l-4 border-teal-500">
                        <div className="font-bold text-teal-700">💡 Core Concepts</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## QUICK_REVISION_QA")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-linear-to-r from-green-50 to-teal-50 rounded-lg border-l-4 border-green-500">
                        <div className="font-bold text-green-700">❓ Quick Revision Q&A</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## IMPORTANT_POINTS")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-linear-to-r from-emerald-50 to-green-50 rounded-lg border-l-4 border-emerald-500">
                        <div className="font-bold text-emerald-700">⭐ Important Points</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## COMMON_MISTAKES")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-linear-to-r from-lime-50 to-emerald-50 rounded-lg border-l-4 border-lime-500">
                        <div className="font-bold text-lime-700">⚠️ Common Mistakes</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## COMPARISONS")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-linear-to-r from-teal-50 to-cyan-50 rounded-lg border-l-4 border-teal-500">
                        <div className="font-bold text-teal-700">⚖️ Comparisons</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## QUICK_RECALL")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-linear-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-500">
                        <div className="font-bold text-green-700">🧠 Quick Recall</div>
                      </div>
                    );
                  }

                  // Q&A Subheadings
                  if (line.startsWith("### Q")) {
                    return (
                      <div key={i} className="mt-3 font-semibold text-teal-800 bg-teal-100 px-3 py-1.5 rounded">
                        {line.replace("### ", "")}
                      </div>
                    );
                  }

                  // Answer lines
                  if (line.startsWith("Answer:")) {
                    return (
                      <div key={i} className="text-stone-700 pl-3 border-l-2 border-teal-300 bg-teal-50/50 py-2 px-3 rounded-r">
                        {line}
                      </div>
                    );
                  }

                  // Bullet points
                  if (line.startsWith("- ")) {
                    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-600 font-semibold">$1</strong>');
                    return (
                      <div
                        key={i}
                        className="text-stone-700 pl-4 py-0.5"
                        dangerouslySetInnerHTML={{ __html: `• ${boldText.substring(2)}` }}
                      />
                    );
                  }

                  // Skip empty lines
                  if (line.trim() === "") {
                    return <div key={i} className="h-1.5"></div>;
                  }

                  // Normal text
                  const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-teal-600 font-semibold">$1</strong>');
                  return (
                    <div
                      key={i}
                      className="text-stone-700"
                      dangerouslySetInnerHTML={{ __html: boldText }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-stone-200 flex gap-3">
              <button
                onClick={() => {
                  setTopic(viewingNote.topic);
                  setDifficulty(viewingNote.difficulty);
                  setViewingNote(null);
                  setActiveTab("generate");
                }}
                className="flex-1 py-2.5 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewingNote.content);
                  alert("Notes copied to clipboard!");
                }}
                className="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiCopy className="w-4 h-4" />
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
