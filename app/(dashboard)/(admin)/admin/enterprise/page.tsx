"use client";

import { AdminOnly } from "@/lib/role-guard";
import { useState, useEffect, FormEvent } from "react";
import { FiSearch, FiPlus, FiEdit2 } from "react-icons/fi";
import { FaTh, FaList } from "react-icons/fa";
import { IoFolderOpenOutline, IoArrowBack } from "react-icons/io5";
import {
  Database,
  Brain,
  Upload,
  Folder,
  FileText,
  Sparkles,
  BarChart3,
  Clock,
  Edit,
  Save,
  X,
} from "lucide-react";

import MergedPDFUploader from "./PDFFileUploader";
import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";
import axios from "axios";
import {
  useCreateCompanyArticle,
  useGetCompanyArticles,
} from "@/features/oragnization/api/companyarticle";
import { useGetArticles } from "@/features/oragnization/api/article";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function CompanyArticles() {
  const { user } = useNavbarStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [categoryId, setCat] = useState<any>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showPdfUploader, setShowPdfUploader] = useState(false);
  // New state for editing functionality
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const { data: categories } = useGetCompanyArticles(user?.organizationId!);
  const { data: articles } = useGetArticles(user?.organizationId!, categoryId);

  function handleCategorySelect(category: any) {
    setSelectedCategory(category);
    setCat(category.id);
  }

  const { mutate: createNewCategory, isPending } = useCreateCompanyArticle();

  function createCategory(e: FormEvent) {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    createNewCategory(
      {
        name: newCategoryName,
        orgId: user?.organizationId!,
      },
      {
        onSuccess: () => {
          toast.success("Category created successfully!");
          setNewCategoryName("");
          setShowCreateCategory(false);
        },
        onError: () => {
          toast.error("Something went wrong");
        },
      }
    );
  }

  // Handle starting edit mode for an article
  const startEditing = (article: any) => {
    setEditingArticleId(article.id);
    setEditedContent(article.content || "");
  };

  // Handle saving the edited content
  const saveArticleEdit = async (articleId: string) => {
    if (!articleId || !editedContent.trim()) {
      return;
    }

    setIsSaving(true);

    try {
      // Update the article content - replace with your actual API endpoint
      await axios.patch(`/api/articles/${articleId}`, {
        content: editedContent,
      });

      toast.success("Document updated successfully!");
      setEditingArticleId(null);
      setEditedContent("");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle canceling edit mode
  const cancelEditing = () => {
    setEditingArticleId(null);
    setEditedContent("");
  };

  const totalCategories = categories?.length || 0;
  const totalArticles =
    categories?.reduce(
      (sum: number, cat: any) => sum + cat.articles.length,
      0
    ) || 0;

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Database className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                Knowledge Vault
              </h1>
              <p className="text-slate-600 mt-1">
                Centralized repository for all organizational knowledge and
                documents
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Categories
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalCategories}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Folder className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <BarChart3 className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-slate-500">Organized content</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Total Documents
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    {totalArticles}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-slate-500">AI-processed</span>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    AI Training
                  </p>
                  <p className="text-3xl font-bold text-slate-800 mt-1">
                    Active
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <Sparkles className="h-4 w-4 text-orange-500 mr-1" />
                <span className="text-slate-500">Knowledge enriched</span>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Viewer */}
        {selectedPdf ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <button
                className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
                onClick={() => setSelectedPdf(null)}
              >
                <IoArrowBack className="h-5 w-5" />
                <span className="font-medium">Back to Documents</span>
              </button>
            </div>
            <div className="p-6">
              <iframe
                src={selectedPdf}
                className="w-full h-[600px] border-0 rounded-lg shadow-inner"
              ></iframe>
            </div>
          </div>
        ) : selectedCategory ? (
          <div className="space-y-6">
            {/* Category Header */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors cursor-pointer"
                    onClick={() => setSelectedCategory(null)}
                  >
                    <Folder className="h-5 w-5" />
                    <span>Knowledge Vault</span>
                    <span className="text-blue-200">/</span>
                    <span className="font-semibold">
                      {selectedCategory.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowPdfUploader(!showPdfUploader)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="font-medium">Upload PDF</span>
                  </button>
                </div>
              </div>

              {showPdfUploader && (
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <MergedPDFUploader
                    label="Upload PDF Document"
                    setFile={() => {}}
                    companyArticlesId={selectedCategory.id}
                  />
                </div>
              )}
            </div>

            {/* Documents Grid */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">
                      Documents
                    </h2>
                    <span className="bg-white/20 text-white text-sm px-2 py-1 rounded-full">
                      {articles?.length || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        view === "grid"
                          ? "bg-white/20 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <FaTh size={16} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        view === "list"
                          ? "bg-white/20 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <FaList size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div
                  className={`grid gap-4 ${
                    view === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {articles?.map((article: any) => (
                    <div
                      key={article.id}
                      className="group bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                      onClick={() => setSelectedPdf(article.pdfUrl)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>Updated recently</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {(!articles || articles.length === 0) && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      No documents yet
                    </h3>
                    <p className="text-slate-500">
                      Upload your first PDF document to get started
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Create Category Form */}
            {showCreateCategory && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    Create New Category
                  </h2>
                </div>
                <div className="p-6">
                  <form
                    onSubmit={createCategory}
                    className="flex items-center gap-4"
                  >
                    <input
                      required
                      type="text"
                      placeholder="Category name (e.g., HR Policies, Technical Docs)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    />
                    <Button
                      disabled={isPending}
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-200"
                    >
                      {isPending ? "Creating..." : "Create Category"}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Categories Grid */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Folder className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-semibold text-white">
                      Knowledge Categories
                    </h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        view === "grid"
                          ? "bg-white/20 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <FaTh size={16} />
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        view === "list"
                          ? "bg-white/20 text-white"
                          : "text-slate-300 hover:text-white"
                      }`}
                    >
                      <FaList size={16} />
                    </button>
                    <button
                      onClick={() => setShowCreateCategory(!showCreateCategory)}
                      className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-200"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div
                  className={`grid gap-6 ${
                    view === "grid"
                      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {categories?.map((cat: any) => (
                    <div
                      key={cat.id}
                      className="group bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
                      onClick={() => handleCategorySelect(cat)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <IoFolderOpenOutline className="text-white text-2xl" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {cat.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-slate-600">
                              {cat.articles.length}
                            </span>
                            <span className="text-xs text-slate-500">
                              documents
                            </span>
                            <div className="flex-1 bg-slate-200 rounded-full h-1.5 ml-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-500"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (cat.articles.length / 10) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {(!categories || categories.length === 0) && (
                  <div className="text-center py-12">
                    <Folder className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 mb-2">
                      No categories yet
                    </h3>
                    <p className="text-slate-500">
                      Create your first category to organize your knowledge base
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminOnly>
  );
}
