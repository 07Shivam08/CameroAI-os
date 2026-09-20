"use client";

import { useNavbarStore } from "@/app/(dashboard)/_components/layoutWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUpdateKnowledgebase } from "@/features/oragnization/api/knowledgebase";
import {
  Loader2,
  Building2,
  Users,
  MapPin,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Check,
  Brain,
  Sparkles,
  FileText,
  Mail,
  Phone,
  User,
  Briefcase,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

export interface Organization {
  name: string;
  fieldOfWork: string;
  leads: Lead[];
  branches: Branch[];
  otherInformation: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  position: string;
  responsibilities: string;
}

export interface Branch {
  name: string;
  hr: string;
  email: string;
}

const leadSchema = z.object({
  name: z.string().min(1, "Lead name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  position: z.string().min(1, "Position is required"),
  responsibilities: z.string().optional(),
});

const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  hr: z.string().min(1, "HR name is required"),
  email: z.string().email("Invalid email address"),
});

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  fieldOfWork: z.string().min(1, "Field of work is required"),
  leads: z.array(leadSchema).min(1, "At least one lead is required"),
  branches: z.array(branchSchema).min(1, "At least one branch is required"),
  otherInformation: z.string(),
});

const initialOrganizationState: Organization = {
  name: "",
  fieldOfWork: "",
  leads: [
    { name: "", email: "", phone: "", position: "", responsibilities: "" },
  ],
  branches: [{ name: "", hr: "", email: "" }],
  otherInformation: "",
};

const steps = [
  {
    id: 1,
    title: "Organization Info",
    description: "Basic company details",
    icon: Building2,
  },
  {
    id: 2,
    title: "Leadership Team",
    description: "Key personnel information",
    icon: Users,
  },
  {
    id: 3,
    title: "Branch Locations",
    description: "Office locations and contacts",
    icon: MapPin,
  },
  {
    id: 4,
    title: "Additional Context",
    description: "Extra organizational details",
    icon: FileText,
  },
];

function KnowledgeBaseForm() {
  const [organization, setOrganization] = useState<Organization>(
    initialOrganizationState
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user } = useNavbarStore();
  const { mutate, isPending } = useUpdateKnowledgebase(user!.organizationId!);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!organization.name.trim())
          newErrors.name = "Organization name is required";
        if (!organization.fieldOfWork.trim())
          newErrors.fieldOfWork = "Field of work is required";
        break;
      case 2:
        organization.leads.forEach((lead, index) => {
          if (!lead.name.trim())
            newErrors[`lead_${index}_name`] = "Lead name is required";
          if (!lead.email.trim())
            newErrors[`lead_${index}_email`] = "Email is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
            newErrors[`lead_${index}_email`] = "Invalid email format";
          }
          if (!lead.phone.trim())
            newErrors[`lead_${index}_phone`] = "Phone is required";
          if (!lead.position.trim())
            newErrors[`lead_${index}_position`] = "Position is required";
        });
        break;
      case 3:
        organization.branches.forEach((branch, index) => {
          if (!branch.name.trim())
            newErrors[`branch_${index}_name`] = "Branch name is required";
          if (!branch.hr.trim())
            newErrors[`branch_${index}_hr`] = "HR name is required";
          if (!branch.email.trim())
            newErrors[`branch_${index}_email`] = "Email is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(branch.email)) {
            newErrors[`branch_${index}_email`] = "Invalid email format";
          }
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const addLead = () => {
    setOrganization({
      ...organization,
      leads: [
        ...organization.leads,
        { name: "", email: "", phone: "", position: "", responsibilities: "" },
      ],
    });
  };

  const removeLead = (index: number) => {
    if (organization.leads.length > 1) {
      const newLeads = organization.leads.filter((_, i) => i !== index);
      setOrganization({ ...organization, leads: newLeads });
    }
  };

  const addBranch = () => {
    setOrganization({
      ...organization,
      branches: [...organization.branches, { name: "", hr: "", email: "" }],
    });
  };

  const removeBranch = (index: number) => {
    if (organization.branches.length > 1) {
      const newBranches = organization.branches.filter((_, i) => i !== index);
      setOrganization({ ...organization, branches: newBranches });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    try {
      const validatedData = organizationSchema.parse(organization);
      const formattedData = `${validatedData.name} is a company working in ${
        validatedData.fieldOfWork
      }. 
      Key people in the organization: 
      ${validatedData.leads
        .map(
          (lead) =>
            `{
            Name: ${lead.name}
            Position: (${lead.position})
            Contact: ${lead.email} | ${lead.phone}
            Responsibilities: ${lead.responsibilities}
            },`
        )
        .join(" ")}. 
        Branches and their HR: 
        ${validatedData.branches
          .map(
            (branch) =>
              `{
            Location: ${branch.name}
            HR: (${branch.hr})
            Contact: ${branch.email}
            }`
          )
          .join(", ")}.
        Other information: 
        ${validatedData.otherInformation}`;

      mutate({
        knowledgeBase: formattedData,
      });
    } catch (error) {
      toast.error("Please check all required fields");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Organization Details
              </h3>
              <p className="text-slate-600">Tell us about your company</p>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="orgName"
                  className="text-sm font-semibold text-slate-700"
                >
                  Organization Name *
                </Label>
                <Input
                  id="orgName"
                  value={organization.name}
                  onChange={(e) =>
                    setOrganization({ ...organization, name: e.target.value })
                  }
                  placeholder="Enter your organization name"
                  className={`h-12 ${
                    errors.name ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fieldOfWork"
                  className="text-sm font-semibold text-slate-700"
                >
                  Field of Work *
                </Label>
                <Input
                  id="fieldOfWork"
                  value={organization.fieldOfWork}
                  onChange={(e) =>
                    setOrganization({
                      ...organization,
                      fieldOfWork: e.target.value,
                    })
                  }
                  placeholder="e.g., Technology, Healthcare, Finance"
                  className={`h-12 ${
                    errors.fieldOfWork ? "border-red-500" : "border-slate-300"
                  }`}
                />
                {errors.fieldOfWork && (
                  <p className="text-red-500 text-sm">{errors.fieldOfWork}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Leadership Team
              </h3>
              <p className="text-slate-600">
                Add key personnel and their information
              </p>
            </div>

            <div className="space-y-6">
              {organization.leads.map((lead, index) => (
                <Card
                  key={index}
                  className="border-2 border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg">
                          Lead #{index + 1}
                        </CardTitle>
                      </div>
                      {organization.leads.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLead(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Full Name *
                        </Label>
                        <Input
                          value={lead.name}
                          onChange={(e) => {
                            const newLeads = [...organization.leads];
                            newLeads[index] = { ...lead, name: e.target.value };
                            setOrganization({
                              ...organization,
                              leads: newLeads,
                            });
                          }}
                          placeholder="John Doe"
                          className={`${
                            errors[`lead_${index}_name`] ? "border-red-500" : ""
                          }`}
                        />
                        {errors[`lead_${index}_name`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`lead_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          Position *
                        </Label>
                        <Input
                          value={lead.position}
                          onChange={(e) => {
                            const newLeads = [...organization.leads];
                            newLeads[index] = {
                              ...lead,
                              position: e.target.value,
                            };
                            setOrganization({
                              ...organization,
                              leads: newLeads,
                            });
                          }}
                          placeholder="CEO, Manager, etc."
                          className={`${
                            errors[`lead_${index}_position`]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors[`lead_${index}_position`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`lead_${index}_position`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email *
                        </Label>
                        <Input
                          type="email"
                          value={lead.email}
                          onChange={(e) => {
                            const newLeads = [...organization.leads];
                            newLeads[index] = {
                              ...lead,
                              email: e.target.value,
                            };
                            setOrganization({
                              ...organization,
                              leads: newLeads,
                            });
                          }}
                          placeholder="john@company.com"
                          className={`${
                            errors[`lead_${index}_email`]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors[`lead_${index}_email`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`lead_${index}_email`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          Phone *
                        </Label>
                        <Input
                          value={lead.phone}
                          onChange={(e) => {
                            const newLeads = [...organization.leads];
                            newLeads[index] = {
                              ...lead,
                              phone: e.target.value,
                            };
                            setOrganization({
                              ...organization,
                              leads: newLeads,
                            });
                          }}
                          placeholder="+1 (555) 123-4567"
                          className={`${
                            errors[`lead_${index}_phone`]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors[`lead_${index}_phone`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`lead_${index}_phone`]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">
                        Responsibilities (Optional)
                      </Label>
                      <Textarea
                        value={lead.responsibilities}
                        onChange={(e) => {
                          const newLeads = [...organization.leads];
                          newLeads[index] = {
                            ...lead,
                            responsibilities: e.target.value,
                          };
                          setOrganization({ ...organization, leads: newLeads });
                        }}
                        placeholder="Brief description of their role and responsibilities"
                        className="min-h-[80px]"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addLead}
                className="w-full h-12 border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50 text-slate-600 hover:text-blue-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Lead
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Branch Locations
              </h3>
              <p className="text-slate-600">
                Add your office locations and HR contacts
              </p>
            </div>

            <div className="space-y-6">
              {organization.branches.map((branch, index) => (
                <Card
                  key={index}
                  className="border-2 border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-white" />
                        </div>
                        <CardTitle className="text-lg">
                          Branch #{index + 1}
                        </CardTitle>
                      </div>
                      {organization.branches.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeBranch(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          Branch Name *
                        </Label>
                        <Input
                          value={branch.name}
                          onChange={(e) => {
                            const newBranches = [...organization.branches];
                            newBranches[index] = {
                              ...branch,
                              name: e.target.value,
                            };
                            setOrganization({
                              ...organization,
                              branches: newBranches,
                            });
                          }}
                          placeholder="New York Office"
                          className={`${
                            errors[`branch_${index}_name`]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors[`branch_${index}_name`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`branch_${index}_name`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          HR Manager *
                        </Label>
                        <Input
                          value={branch.hr}
                          onChange={(e) => {
                            const newBranches = [...organization.branches];
                            newBranches[index] = {
                              ...branch,
                              hr: e.target.value,
                            };
                            setOrganization({
                              ...organization,
                              branches: newBranches,
                            });
                          }}
                          placeholder="Jane Smith"
                          className={`${
                            errors[`branch_${index}_hr`] ? "border-red-500" : ""
                          }`}
                        />
                        {errors[`branch_${index}_hr`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`branch_${index}_hr`]}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          HR Email *
                        </Label>
                        <Input
                          type="email"
                          value={branch.email}
                          onChange={(e) => {
                            const newBranches = [...organization.branches];
                            newBranches[index] = {
                              ...branch,
                              email: e.target.value,
                            };
                            setOrganization({
                              ...organization,
                              branches: newBranches,
                            });
                          }}
                          placeholder="hr@company.com"
                          className={`${
                            errors[`branch_${index}_email`]
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        {errors[`branch_${index}_email`] && (
                          <p className="text-red-500 text-sm">
                            {errors[`branch_${index}_email`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addBranch}
                className="w-full h-12 border-2 border-dashed border-slate-300 hover:border-orange-500 hover:bg-orange-50 text-slate-600 hover:text-orange-600"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Branch
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Additional Context
              </h3>
              <p className="text-slate-600">
                Provide any additional information about your organization
              </p>
            </div>

            <div className="space-y-4">
              <Label
                htmlFor="otherInfo"
                className="text-sm font-semibold text-slate-700"
              >
                Additional Information (Optional)
              </Label>
              <Textarea
                id="otherInfo"
                value={organization.otherInformation}
                onChange={(e) =>
                  setOrganization({
                    ...organization,
                    otherInformation: e.target.value,
                  })
                }
                placeholder="Any other relevant information about your organization, policies, culture, or specific details that would help the AI understand your company better..."
                className="min-h-[200px] border-slate-300"
              />
              <p className="text-sm text-slate-500">
                This information will help train your AI to better understand
                your organization and provide more relevant responses.
              </p>
            </div>

            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Brain className="h-5 w-5" />
                  Training Summary
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Review the information that will be used to train your AI
                  assistant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Organization
                    </Badge>
                    <p className="font-medium">
                      {organization.name || "Not specified"}
                    </p>
                    <p className="text-slate-600">
                      {organization.fieldOfWork || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Team
                    </Badge>
                    <p className="font-medium">
                      {organization.leads.length} Lead(s)
                    </p>
                    <p className="text-slate-600">
                      {organization.branches.length} Branch(es)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const IconComponent = step.icon;

            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center gap-3 ${
                    index > 0 ? "ml-4" : ""
                  }`}
                >
                  <div
                    className={`
                    w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        : "bg-white border-2 border-slate-300 text-slate-400"
                    }
                  `}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <IconComponent className="h-6 w-6" />
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p
                      className={`font-semibold text-sm ${
                        isActive ? "text-blue-600" : "text-slate-600"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-20 h-0.5 mx-4 ${
                      isCompleted ? "bg-green-500" : "bg-slate-300"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile Step Indicator */}
        <div className="md:hidden text-center">
          <p className="text-sm font-semibold text-slate-700">
            Step {currentStep} of {steps.length}: {steps[currentStep - 1].title}
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="border-2 border-slate-200 shadow-xl">
        <CardContent className="p-8">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 py-3"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep < steps.length ? (
          <Button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Training AI...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Train AI Assistant
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default KnowledgeBaseForm;
