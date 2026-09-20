"use client";

import * as z from "zod";
import axios, { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  User,
  UserPlus,
  Mail,
  MapPin,
  Building,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Branch, Department } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";

const formSchema = z.object({
  firstName: z.string().min(1, {
    message: "First name is required",
  }),
  lastName: z.string().min(1, {
    message: "Last name is required",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email is required",
    })
    .email("Please enter a valid email address"),
  branchId: z.string().min(1, {
    message: "Branch selection is required",
  }),
  departmentId: z.string().min(1, {
    message: "Department selection is required",
  }),
  role: z.string().min(1, {
    message: "Role selection is required",
  }),
});

export const CreateUserForm = ({
  orgId,
  branchs,
}: {
  orgId: string;
  branchs: (Branch & { departments: Department[] })[];
}) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      branchId: "",
      departmentId: "",
      role: "USER",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/user`, {
        ...values,
        userId: userId,
        orgId: orgId,
      });

      toast.success("User created successfully!");
      form.reset();
      setSelectedBranch("");
      router.refresh();
    } catch (e) {
      if (isAxiosError(e)) {
        toast.error("Failed to create user. Please try again.");
      }
    }
  };

  const selectedBranchData = branchs.find(
    (branch) => branch.id === selectedBranch
  );

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-4">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">
          Create New User Account
        </h3>
        <p className="text-slate-600 text-sm">
          Add a new team member to your organization
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Card */}
          <Card className="border-2 border-emerald-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-b border-emerald-200">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter first name"
                            className="pl-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            disabled={isSubmitting}
                            placeholder="Enter last name"
                            className="pl-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          disabled={isSubmitting}
                          placeholder="Enter email address"
                          type="email"
                          className="pl-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Organization Details Card */}
          <Card className="border-2 border-blue-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Building className="w-5 h-5" />
                Organization Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Branch Location
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedBranch(value);
                              form.setValue("departmentId", ""); // Reset department when branch changes
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {branchs.map((branch) => (
                                <SelectItem key={branch.id} value={branch.id}>
                                  {branch.state} - {branch.city}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Department
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedBranch}
                          >
                            <SelectTrigger className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue
                                placeholder={
                                  selectedBranch
                                    ? "Select department"
                                    : "Select branch first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedBranchData?.departments.map(
                                (department) => (
                                  <SelectItem
                                    key={department.id}
                                    value={department.id}
                                  >
                                    {department.name}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">
                      User Role
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USER">User</SelectItem>
                            <SelectItem value="ADMIN">Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              disabled={!isValid || isSubmitting}
              type="submit"
              className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-3 text-lg font-medium shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating User...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create User Account
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
