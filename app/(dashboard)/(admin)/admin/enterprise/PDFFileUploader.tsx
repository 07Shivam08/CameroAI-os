"use client";

import { UploadDropzone } from "@uploadthing/react";
import { useState } from "react";
import { prepare } from "@/actions/prepare";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

export interface FileProps {
  url: string;
}

interface PDFFileUploadProps {
  label: string;
  setFile: (file: FileProps | null) => void;
  companyArticlesId: string;
}

export default function MergedPDFUploader({ label, setFile, companyArticlesId }: PDFFileUploadProps) {
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [file, setLocalFile] = useState<FileProps | null>(null);

  async function uploadToPinecone() {
    if (!file) return;
    try {
      setLoading(true);
      setLoadingMsg("Uploading to Pinecone...");

      await prepare({ type: "url", source: file.url });

      setLoading(false);
      setUploaded(true);
    } catch (error) {
      console.error("Pinecone upload failed:", error);
      setLoading(false);
    }
  }

  return (
    <div className="border p-4 rounded-md">
      <p className="mb-2">{label}</p>

      {/* Title Input */}
      <input
        type="text"
        placeholder="Enter PDF title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded-md w-full mb-2"
      />

      {/* Upload Dropzone */}
      <UploadDropzone<OurFileRouter, "pdfUpload">
        endpoint="pdfUpload"
        headers={{
          "x-title": title,
          "x-companyarticlesid": companyArticlesId,
        }}
        onUploadBegin={() => setUploading(true)}
        onClientUploadComplete={(res) => {
          setUploading(false);
          if (res && res.length > 0) {
            const uploadedFile = { url: res[0].url };
            setFile(uploadedFile);
            setLocalFile(uploadedFile);
          }
        }}
        onUploadError={(error) => {
          setUploading(false);
          console.error("🚨 Upload failed:", error);
        }}
      />

      {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}

      {file && !uploaded && (
        <Button onClick={uploadToPinecone} className="mt-2">
          Upload to Pinecone
        </Button>
      )}

      {loading && (
        <Button disabled className="gap-2 mt-2">
          <Loader2 className="animate-spin" />
          {loadingMsg}
        </Button>
      )}

      {uploaded && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-md mt-2">
          <Check className="w-5 h-5" />
          <span>Successfully uploaded to Pinecone</span>
        </div>
      )}
    </div>
  );
}
