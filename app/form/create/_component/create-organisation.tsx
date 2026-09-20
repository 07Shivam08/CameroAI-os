"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrgCreateStore, orgformSchema } from "./CreateorgStateProvider";
import { Fragment } from "react";
import {
  Building2,
  Mail,
  Phone,
  Users,
  ArrowLeft,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export type formFeildOrganisationSechma = z.infer<typeof orgformSchema>;

const CreateOrganization = () => {
  const { setPosition, orgData, onSubmit, setOrgData } = useOrgCreateStore();

  const form = useForm<z.infer<typeof orgformSchema>>({
    resolver: zodResolver(orgformSchema),
    defaultValues: orgData,
  });

  const formFields = [
    {
      key: "name" as const,
      title: "Organization Name",
      placeholder: "e.g. Acme Corporation",
      icon: Building2,
      type: "text",
    },
    {
      key: "orgEmail" as const,
      title: "Business Email",
      placeholder: "contact@yourcompany.com",
      icon: Mail,
      type: "email",
    },
    {
      key: "contactNo" as const,
      title: "Contact Number",
      placeholder: "+1 (555) 123-4567",
      icon: Phone,
      type: "tel",
    },
    {
      key: "maxNoOfUser" as const,
      title: "Organization Size",
      placeholder: "e.g. 50",
      icon: Users,
      type: "number",
    },
  ];

  const { isSubmitting, isValid } = form.formState;

  const handleSubmit = (values: z.infer<typeof orgformSchema>) => {
    const isVaid = orgformSchema.parse(values);
    if (isValid) {
      setOrgData(values);
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Organization Setup</h1>
                <p className="text-blue-100">
                  Almost there! Tell us about your organization
                </p>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                  <CheckCircle className="w-3 h-3" />
                </div>
                <span>Account Info</span>
              </div>
              <div className="w-8 h-0.5 bg-white/50"></div>
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 bg-white text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
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
              Setup Your Organization
            </h2>
            <p className="text-slate-600">
              Provide your organization details to complete the setup process
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => {
                  const IconComponent = field.icon;
                  return (
                    <div
                      key={field.key}
                      className={field.key === "name" ? "md:col-span-2" : ""}
                    >
                      <FormField
                        control={form.control}
                        name={field.key}
                        render={({ field: formField }) => (
                          <FormItem className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              {field.title}
                            </label>
                            <FormControl>
                              <Input
                                {...formField}
                                type={field.type}
                                onChange={(e) => {
                                  formField.onChange(e);
                                  setOrgData((prev) => ({
                                    ...prev,
                                    [field.key]: e.target.value,
                                  }));
                                }}
                                disabled={isSubmitting}
                                placeholder={field.placeholder}
                                className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-colors"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                <Button
                  onClick={() => setPosition(0)}
                  type="button"
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Account
                </Button>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Organization...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Complete Setup
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

export default CreateOrganization;
