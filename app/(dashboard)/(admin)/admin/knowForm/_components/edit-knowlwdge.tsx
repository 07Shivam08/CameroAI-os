"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Edit } from "lucide-react";
import { useUpdateKnowledgebase } from "@/features/oragnization/api/knowledgebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditKnowledgeProps {
  knowledge: string;
  orgId: string;
}

export default function EditKnowledge({
  knowledge,
  orgId,
}: EditKnowledgeProps) {
  // Store the text content
  const [data, setData] = useState(knowledge);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { mutate, isPending } = useUpdateKnowledgebase(orgId);
  // Track current word count
  const [charCount, setCharCount] = useState(knowledge.length); // Track character count
  const MAX_CHARS = 3000;

  // Update state when the user types in the textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const chars = text.length;

    // Only update if under the character limit
    if (chars <= MAX_CHARS) {
      setData(text);
      setCharCount(chars);
    }
  };

  // Handle submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    mutate(
      {
        knowledgeBase: data,
      },
      {
        onSuccess() {
          toast.success("Knowledge Updated🚀");
          setIsDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-background">
      <div className="flex flex-col w-full h-full">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Knowledge Base</h1>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-1">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Edit Knowledge Base</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                {/* Textarea with enhanced styling */}
                <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-lg p-1 my-4">
                  <Textarea
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="none"
                    value={data}
                    onChange={handleChange}
                    className="flex-1 resize-none enhanced-textarea placeholder-gray bg-transparent w-full h-48"
                    placeholder="Type your knowledge base content here..."
                    maxLength={MAX_CHARS}
                  />
                </div>

                {/* Word count indicator */}
                <div className="mt-2 text-sm text-emerald-600 font-medium text-right flex items-center justify-end">
                  <span className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {charCount} / {MAX_CHARS} characters
                  </span>
                </div>

                <DialogFooter className="mt-4">
                  {isPending ? (
                    <Button disabled type="submit">
                      Saving <Loader2 className="animate-spin ml-2" size={20} />
                    </Button>
                  ) : (
                    <Button type="submit">Save Changes</Button>
                  )}
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Knowledge Base Display */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-lg p-4 flex-grow overflow-auto">
          <div className="whitespace-pre-wrap">{knowledge}</div>
        </div>
      </div>
    </div>
  );
}

/** Utility function to count words in a string */
function countWords(text: string): number {
  // Split on whitespace, filter out empty strings
  return text.trim().split(/\s+/).filter(Boolean).length;
}
