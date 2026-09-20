"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  UserCheck,
  Sparkles,
  ArrowRight,
  Crown,
  Zap,
  Bot,
} from "lucide-react";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrgCreateStore, userformSchema } from "./CreateorgStateProvider";

export const CreateAccountForm = () => {
  // Form structure and default values
  const { setPosition, setUserData, userData } = useOrgCreateStore();
  const searchParams = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    const plan = searchParams.get("plan");
    if (plan) {
      setSelectedPlan(plan.charAt(0).toUpperCase() + plan.slice(1));
    }
  }, [searchParams]);

  const getPlanDetails = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "starter":
        return { icon: Bot, color: "emerald", price: "Free" };
      case "professional":
        return { icon: Zap, color: "blue", price: "$29/month" };
      case "enterprise":
        return { icon: Crown, color: "purple", price: "$99/month" };
      default:
        return { icon: Bot, color: "emerald", price: "Free" };
    }
  };

  const formStructure = [
    {
      key: "firstName" as const,
      placeholder: "First Name",
      icon: User,
      type: "text",
    },
    {
      key: "lastName" as const,
      placeholder: "Last Name",
      icon: User,
      type: "text",
    },
    {
      key: "userName" as const,
      placeholder: "Username",
      icon: UserCheck,
      type: "text",
    },
    {
      key: "email" as const,
      placeholder: "Email Address",
      icon: Mail,
      type: "email",
    },
  ];

  // React Hook Form setup
  const form = useForm<z.infer<typeof userformSchema>>({
    resolver: zodResolver(userformSchema),
    defaultValues: userData,
  });

  const { isSubmitting, isValid, errors } = form.formState;

  // Submit handler
  const onSubmit = async (values: z.infer<typeof userformSchema>) => {
    const isValidForm = userformSchema.safeParse(values);

    if (isValidForm.success) {
      setUserData(values);
      setPosition(1);
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome to Camero AI</h1>
                <p className="text-emerald-100">Let's get you started</p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 bg-white text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <span>Account Info</span>
              </div>
              <div className="w-8 h-0.5 bg-white/30"></div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <span>Organization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-slate-600">
              Please provide your details to get started with Camero AI
            </p>
          </div>

          {/* Username Guidelines */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Username Guidelines:</span> Use only
              letters, numbers, "_", "-", and "." characters
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formStructure.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <div key={field.key} className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {field.placeholder}
                      </label>
                      <FormField
                        control={form.control}
                        name={field.key}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...formField}
                                type={field.type}
                                disabled={isSubmitting}
                                placeholder={field.placeholder}
                                className="h-12 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg transition-colors"
                              />
                            </FormControl>
                            {errors[field.key] && (
                              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                {errors[field.key]?.message}
                              </p>
                            )}
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Continue to Organization Setup
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
