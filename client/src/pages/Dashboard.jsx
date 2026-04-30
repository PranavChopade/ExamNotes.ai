import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { useUser } from "../hooks/useUser";
import { FiInfo, FiFileText, FiSearch, FiEye, FiRefreshCw, FiTrash2, FiX, FiCopy } from "react-icons/fi";
import { LuBrain } from "react-icons/lu";
import { useNotes } from "../hooks/useNotes";
import { setNotes } from "../redux/notesSlice";
import { setQuiz } from "../redux/quizSlice"
import Quiz from "./Quiz";
/**
 * Dashboard - A focused workspace for exam preparation
 * Designed to feel like a real productivity tool, not a landing page
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { notes } = useSelector((state) => state.notes);
  const safeNotes = notes || [];

  // Form state
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [generating, setGenerating] = useState(false);
  const [generatedNote, setGeneratedNote] = useState(null);

  // Notes state 
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [activeTab, setActiveTab] = useState("generate");

  // Error state
  const [error, setError] = useState(null);

  // Thinking state for more natural feedback
  const [thinkingPhase, setThinkingPhase] = useState("");

  // View note state
  const [viewingNote, setViewingNote] = useState(null);

  // Quiz generation state
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // Search/filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const { profileHandler } = useUser();
  const { generateNotesHandler, getUserNotesHandler, getNoteByIdHandler, deleteNoteHandler, generateQuizHandler } = useNotes();

  useEffect(() => {
    if (!userData) {
      return;
    }
    fetchNotes();
  }, [userData]);

  const fetchNotes = async () => {
    try {
      setLoadingNotes(true);
      await getUserNotesHandler()
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

      const data = await generateNotesHandler({
        topic: topic.trim(),
        difficulty,
      });

      setThinkingPhase("Finalizing notes...");
      await new Promise(resolve => setTimeout(resolve, 400));

      setGeneratedNote(data.notes);
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
      await deleteNoteHandler(noteId);
      dispatch(setNotes(safeNotes?.filter((note) => note._id !== noteId)));
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

  // Get recent topics for quick access ); 
  const recentTopics = safeNotes.slice(0, 3);
  if (!userData) return null;


  const handleGenerateQuiz = async (content) => {
    try {
      setGeneratingQuiz(true);
      const response = await generateQuizHandler(content)
      dispatch(setQuiz(response.quiz))
      navigate("/quiz")
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setGeneratingQuiz(false);
    }
  }
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header - Warm, human, left-aligned */}
        <div className="mb-8">
          <h1 className="text-xl font-medium text-text-primary mb-1">
            What do you want to study today?
          </h1>
          <p className="text-text-secondary text-sm">
            Generate notes on any topic. <span className="text-primary font-medium">{userData.credits}</span> credits remaining.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="flex-1">
            {/* Recent topics - Quick continue */}
            {recentTopics.length > 0 && !generating && !generatedNote && (
              <div className="mb-6">
                <p className="text-xs text-text-secondary uppercase tracking-wide mb-3">Continue studying</p>
                <div className="flex flex-wrap gap-2">
                  {recentTopics.map((note) => (
                    <button
                      key={note._id}
                      onClick={() => setTopic(note.topic)}
                      className="px-3 py-1.5 bg-surface border border-border rounded-md text-sm text-text-secondary hover:border-primary hover:text-primary transition-all hover:shadow-sm"
                    >
                      {note.topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main input area */}
            <div className="bg-surface rounded-lg border border-border shadow-sm">
              {/* Tab switcher */}
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveTab("generate")}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "generate"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                >
                  Generate
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === "history"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                >
                  My Notes
                  {safeNotes.length > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.5 bg-background text-text-secondary rounded text-xs">
                      {safeNotes.length}
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
                      <label className="block text-sm text-text-secondary mb-2">
                        Topic
                      </label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., JavaScript fundamentals, World War II, Organic Chemistry..."
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-text-primary placeholder-text-secondary bg-background"
                        disabled={generating}
                      />
                      <p className="mt-1.5 text-xs text-text-secondary">
                        Be specific for better results. Include chapter names or key concepts.
                      </p>
                    </div>

                    {/* Difficulty */}
                    <div>
                      <label className="block text-sm text-text-secondary mb-2">
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
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-surface text-text-secondary border-border hover:border-primary hover:text-primary"
                              }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Credits info  */}
                    <div className="flex items-center justify-between py-2.5 px-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <FiInfo className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="text-xs text-text-secondary">Costs 15 credits</span>
                      </div>
                      <span className="text-xs text-text-secondary">
                        {userData.credits} available
                      </span>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="py-2.5 px-3 bg-red-900/20 border border-red-900/50 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    {/* Thinking phases */}
                    {generating && thinkingPhase && (
                      <div className="py-3 px-4 bg-background border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-text-secondary">{thinkingPhase}</span>
                        </div>
                      </div>
                    )}

                    {/* Submit button -  */}
                    <button
                      type="submit"
                      disabled={generating || userData.credits < 15}
                      className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm shadow-sm"
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
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-border border-t-primary mx-auto"></div>
                      <p className="text-text-secondary mt-3 text-sm">Loading your notes...</p>
                    </div>
                  ) : safeNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <FiFileText className="w-10 h-10 text-text-secondary mx-auto mb-3" />
                      <h3 className="text-base font-medium text-text-primary mb-1">No notes yet</h3>
                      <p className="text-text-secondary text-sm mb-4">
                        Generate your first set of notes to see them here.
                      </p>
                      <button
                        onClick={() => setActiveTab("generate")}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Create your first note
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Search and Filter */}
                      <div className="mb-4 space-y-3">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search notes..."
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none bg-background text-text-primary"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFilterDifficulty("all")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "all" ? "bg-primary text-white" : "bg-background text-text-secondary hover:bg-surface"}`}
                          >
                            All
                          </button>
                          <button
                            onClick={() => setFilterDifficulty("beginner")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "beginner" ? "bg-primary text-white" : "bg-background text-text-secondary hover:bg-surface"}`}
                          >
                            Beginner
                          </button>
                          <button
                            onClick={() => setFilterDifficulty("intermediate")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "intermediate" ? "bg-primary text-white" : "bg-background text-text-secondary hover:bg-surface"}`}
                          >
                            Intermediate
                          </button>
                          <button
                            onClick={() => setFilterDifficulty("advanced")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterDifficulty === "advanced" ? "bg-primary text-white" : "bg-background text-text-secondary hover:bg-surface"}`}
                          >
                            Advanced
                          </button>
                        </div>
                      </div>

                      {/* Filtered Notes */}
                      <div className="space-y-2">
                        {safeNotes
                          .filter(note => {
                            const matchesSearch = note.topic.toLowerCase().includes(searchQuery.toLowerCase());
                            const matchesDifficulty = filterDifficulty === "all" || note.difficulty === filterDifficulty;
                            return matchesSearch && matchesDifficulty;
                          })
                          .map((note) => (
                            <div
                              key={note._id}
                              className="group p-4 rounded-lg border border-border hover:border-primary hover:bg-background transition-all"
                            >
                              <div className="flex items-start justify-between">
                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => setViewingNote(note)}
                                >
                                  <h4 className="font-medium text-text-primary mb-1 truncate">
                                    {note.topic}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span>{getDifficultyLabel(note.difficulty)}</span>
                                    <span>•</span>
                                    <span>{formatDate(note.createdAt)}</span>
                                  </div>
                                  <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                                    {note.content.substring(0, 150)}...
                                  </p>
                                </div>
                                <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingNote(note);
                                    }}
                                    className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors"
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
                                    className="p-1.5 text-text-secondary hover:text-primary hover:bg-primary/10 rounded transition-colors"
                                    title="Regenerate"
                                  >
                                    <FiRefreshCw className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteNote(note._id);
                                    }}
                                    className="p-1.5 text-text-secondary hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
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
              <div className="mt-6 bg-surface rounded-2xl border-2 border-primary/50 shadow-xl shadow-primary/10 p-8 animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary">{generatedNote.topic}</h3>
                    <p className="text-sm text-text-secondary mt-2 flex items-center gap-2">
                      <span className="px-3 py-1 bg-primary/10 rounded-full text-primary font-semibold text-xs">{getDifficultyLabel(generatedNote.difficulty)}</span>
                      <span>•</span>
                      <span>Generated just now</span>
                    </p>
                  </div>
                  <span className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-lg shadow-primary/30">
                    ✓ Created
                  </span>
                </div>
                <div className="space-y-4 text-sm">
                  {generatedNote.content.split("\n").map((line, i) => {
                    // SECTION HEADINGS with greenery/emerald styling
                    if (line.startsWith("## CORE_CONCEPTS")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                          <div className="font-bold text-text-primary flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">💡</span>
                            Core Concepts
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## QUICK_REVISION_QA")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                          <div className="font-bold text-text-primary flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">❓</span>
                            Quick Revision Q&A
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## IMPORTANT_POINTS")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                          <div className="font-bold text-text-primary flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">⭐</span>
                            Important Points
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## COMMON_MISTAKES")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                          <div className="font-bold text-text-primary flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">⚠️</span>
                            Common Mistakes
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## COMPARISONS")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                          <div className="font-bold text-text-primary flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">⚖️</span>
                            Comparisons
                          </div>
                        </div>
                      );
                    }

                    if (line.startsWith("## QUICK_RECALL")) {
                      return (
                        <div key={i} className="mt-8 p-4 bg-primary/10 rounded-xl border-l-4 border-primary">
                          <div className="font-bold text-text-primary flex items-center gap-2 text-lg">
                            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm">🧠</span>
                            Quick Recall
                          </div>
                        </div>
                      );
                    }

                    // Q&A Subheadings
                    if (line.startsWith("### Q")) {
                      return (
                        <div key={i} className="mt-4 font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg">
                          {line.replace("### ", "")}
                        </div>
                      );
                    }

                    // Comparison subheadings
                    if (line.startsWith("### ") && line.includes(" vs ")) {
                      return (
                        <div key={i} className="mt-4 font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg">
                          {line.replace("### ", "")}
                        </div>
                      );
                    }

                    // Answer lines
                    if (line.startsWith("Answer:")) {
                      return (
                        <div key={i} className="text-text-secondary pl-4 border-l-2 border-primary bg-primary/5 py-2 px-3 rounded-r-lg">
                          {line}
                        </div>
                      );
                    }

                    // Bullet points with bold highlighting
                    if (line.startsWith("- ")) {
                      const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
                      return (
                        <div
                          key={i}
                          className="text-text-secondary pl-6 py-1 relative"
                          dangerouslySetInnerHTML={{ __html: `• ${boldText.substring(2)}` }}
                        />
                      );
                    }

                    // Skip empty lines
                    if (line.trim() === "") {
                      return <div key={i} className="h-2"></div>;
                    }

                    // NORMAL TEXT with bold highlighting
                    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
                    return (
                      <div
                        key={i}
                        className="text-text-secondary pl-2"
                        dangerouslySetInnerHTML={{ __html: boldText }}
                      />
                    );
                  })}
                </div>
                <div className="mt-8 pt-6 border-t-2 border-border flex gap-4">
                  <button
                    onClick={() => {
                      setGeneratedNote(null);
                      setActiveTab("generate");
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/30 hover:-translate-y-1"
                  >
                    ← Generate another note
                  </button>
                  <button
                    onClick={() => handleGenerateQuiz(generatedNote.content)}
                    disabled={generatingQuiz}
                    className="px-6 py-3 bg-surface border-2 border-border text-text-primary rounded-xl font-semibold hover:bg-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generatingQuiz ? "📋 Generating quiz..." : "📋 generate quiz"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Quiet, functional */}
          <div className="hidden lg:block lg:w-64 space-y-4">
            {/* Credits - Minimal, not screaming */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-primary uppercase tracking-wide font-medium">Credits</span>
                <span className="text-lg font-semibold text-primary">{userData.credits}</span>
              </div>
              <p className="text-xs text-text-secondary mb-3">
                ~{Math.floor(userData.credits / 15)} generations left
              </p>
              <button
                onClick={() => navigate("/pricing")}
                className="w-full py-2 bg-primary rounded-lg text-xs font-medium text-white hover:bg-primary/90 transition-all shadow-sm"
              >
                Get more credits
              </button>
            </div>

            {/* Quick tips */}
            <div className="bg-surface rounded-lg border border-border p-4">
              <h3 className="text-xs text-text-secondary uppercase tracking-wide mb-3 font-medium">Tips</h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Be specific with topics for better results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Try "Photosynthesis" instead of just "Biology"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>Advanced level includes more detailed explanations</span>
                </li>
              </ul>
            </div>

            {/* Recent activity */}
            {safeNotes.length > 0 && (
              <div className="bg-surface rounded-lg border border-border p-4">
                <h3 className="text-xs text-text-secondary uppercase tracking-wide mb-3 font-medium">Recent</h3>
                <div className="space-y-2">
                  {safeNotes.slice(0, 3).map((note) => (
                    <div
                      key={note._id}
                      onClick={() => {
                        setTopic(note.topic);
                        setActiveTab("generate");
                      }}
                      className="cursor-pointer group"
                    >
                      <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors truncate">
                        {note.topic}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
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
          <div className="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 className="text-xl font-bold text-text-primary">{viewingNote.topic}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                  <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                    {getDifficultyLabel(viewingNote.difficulty)}
                  </span>
                  <span>•</span>
                  <span>{formatDate(viewingNote.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingNote(null)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg transition-colors"
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
                      <div key={i} className="mt-6 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <div className="font-bold text-text-primary">💡 Core Concepts</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## QUICK_REVISION_QA")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <div className="font-bold text-text-primary">❓ Quick Revision Q&A</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## IMPORTANT_POINTS")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <div className="font-bold text-text-primary">⭐ Important Points</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## COMMON_MISTAKES")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <div className="font-bold text-text-primary">⚠️ Common Mistakes</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## COMPARISONS")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <div className="font-bold text-text-primary">⚖️ Comparisons</div>
                      </div>
                    );
                  }
                  if (line.startsWith("## QUICK_RECALL")) {
                    return (
                      <div key={i} className="mt-6 p-3 bg-primary/10 rounded-lg border-l-4 border-primary">
                        <div className="font-bold text-text-primary">🧠 Quick Recall</div>
                      </div>
                    );
                  }

                  // Q&A Subheadings
                  if (line.startsWith("### Q")) {
                    return (
                      <div key={i} className="mt-3 font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded">
                        {line.replace("### ", "")}
                      </div>
                    );
                  }

                  // Answer lines
                  if (line.startsWith("Answer:")) {
                    return (
                      <div key={i} className="text-text-secondary pl-3 border-l-2 border-primary bg-primary/5 py-2 px-3 rounded-r">
                        {line}
                      </div>
                    );
                  }

                  // Bullet points
                  if (line.startsWith("- ")) {
                    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
                    return (
                      <div
                        key={i}
                        className="text-text-secondary pl-4 py-0.5"
                        dangerouslySetInnerHTML={{ __html: `• ${boldText.substring(2)}` }}
                      />
                    );
                  }

                  // Skip empty lines
                  if (line.trim() === "") {
                    return <div key={i} className="h-1.5"></div>;
                  }

                  // Normal text
                  const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
                  return (
                    <div
                      key={i}
                      className="text-text-secondary"
                      dangerouslySetInnerHTML={{ __html: boldText }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-border flex gap-3">
              <button
                onClick={() => {
                  setTopic(viewingNote.topic);
                  setDifficulty(viewingNote.difficulty);
                  setViewingNote(null);
                  setActiveTab("generate");
                }}
                className="flex-1 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <FiRefreshCw className="w-4 h-4" />
                Regenerate
              </button>
              <button
                onClick={() => handleGenerateQuiz(viewingNote.content)}
                disabled={generatingQuiz}
                className="flex-1 py-2.5 border border-border text-text-secondary rounded-lg font-medium hover:bg-background transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LuBrain className="w-4 h-4 text-primary" />
                {generatingQuiz ? "Generating..." : "Quiz"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(viewingNote.content);
                  alert("Notes copied to clipboard!");
                }}
                className="flex-1 py-2.5 border border-border text-text-secondary rounded-lg font-medium hover:bg-background transition-colors flex items-center justify-center gap-2"
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
