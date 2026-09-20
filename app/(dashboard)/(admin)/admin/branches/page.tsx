"use client";

import { AdminOnly } from "@/lib/role-guard";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Plus,
  Users,
  Edit,
  Trash2,
  Building as DepartmentIcon,
  Briefcase,
  Settings,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useNavbarStore } from "../../../_components/layoutWrapper";
import { Separator } from "@/components/ui/separator";
import {
  useBranches,
  useCreateBranch,
  useDeleteBranch,
  useCreateDepartment,
  useDeleteDepartment,
} from "@/features/branch/api/branch";
import toast from "react-hot-toast";

export default function BranchManagementPage() {
  const { user } = useNavbarStore();
  const organizationId = user?.organizationId;

  // API hooks
  const {
    data: branches = [],
    isLoading,
    error,
  } = useBranches(organizationId || "");
  const createBranchMutation = useCreateBranch();
  const deleteBranchMutation = useDeleteBranch();
  const createDepartmentMutation = useCreateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();

  // UI state
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [showBranchDialog, setShowBranchDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);

  // Form states
  const [branchForm, setBranchForm] = useState({
    name: "",
    city: "",
    state: "",
  });
  const [departmentForm, setDepartmentForm] = useState({
    name: "",
  });

  const handleCreateBranch = async () => {
    if (!organizationId) return;

    try {
      await createBranchMutation.mutateAsync({
        ...branchForm,
        organizationId,
      });

      setBranchForm({ name: "", city: "", state: "" });
      setShowBranchDialog(false);
      toast.success("Branch created successfully!");
    } catch (error) {
      toast.error("Failed to create branch");
    }
  };

  const handleCreateDepartment = async () => {
    if (!selectedBranch || !organizationId) return;

    try {
      await createDepartmentMutation.mutateAsync({
        name: departmentForm.name,
        branchId: selectedBranch.id,
        organizationId,
      });

      setDepartmentForm({ name: "" });
      setShowDepartmentDialog(false);
      toast.success("Department created successfully!");
    } catch (error) {
      toast.error("Failed to create department");
    }
  };

  const handleDeleteBranch = async (branchId: string) => {
    if (!organizationId) return;

    try {
      await deleteBranchMutation.mutateAsync({
        id: branchId,
        orgId: organizationId,
      });
      toast.success("Branch deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete branch");
    }
  };

  const handleDeleteDepartment = async (deptId: string) => {
    if (!organizationId) return;

    try {
      await deleteDepartmentMutation.mutateAsync({
        id: deptId,
        orgId: organizationId,
      });
      toast.success("Department deleted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete department");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span className="text-slate-600">Loading branches...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Error Loading Branches
          </h2>
          <p className="text-slate-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
                  Branch & Department Management
                </h1>
                <p className="text-slate-600 mt-1">
                  Organize your company structure and manage locations
                </p>
              </div>
            </div>

            <Dialog open={showBranchDialog} onOpenChange={setShowBranchDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Branch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                    Create New Branch
                  </DialogTitle>
                  <DialogDescription>
                    Add a new branch location to your organization.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      value={branchForm.name}
                      onChange={(e) =>
                        setBranchForm({ ...branchForm, name: e.target.value })
                      }
                      placeholder="e.g., Main Office, Regional Hub"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={branchForm.city}
                        onChange={(e) =>
                          setBranchForm({ ...branchForm, city: e.target.value })
                        }
                        placeholder="New York"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={branchForm.state}
                        onChange={(e) =>
                          setBranchForm({
                            ...branchForm,
                            state: e.target.value,
                          })
                        }
                        placeholder="NY"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowBranchDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateBranch}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                  >
                    Create Branch
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Total Branches
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">
                      {branches.length}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Total Departments
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">
                      {branches.reduce(
                        (total, branch) => total + branch.departments.length,
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <DepartmentIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Total Employees
                    </p>
                    <p className="text-3xl font-bold text-slate-800 mt-1">
                      {branches.reduce(
                        (total, branch) =>
                          total +
                          branch.departments.reduce(
                            (deptTotal, dept) =>
                              deptTotal + (dept._count?.users || 0),
                            0
                          ),
                        0
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Branches List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {branches.map((branch) => (
            <Card
              key={branch.id}
              className="border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-slate-800">
                        {branch.name}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-slate-600 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-sm">
                          {branch.city}, {branch.state}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteBranch(branch.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Departments ({branch.departments.length})
                  </h4>
                  <Dialog
                    open={
                      showDepartmentDialog && selectedBranch?.id === branch.id
                    }
                    onOpenChange={(open) => {
                      setShowDepartmentDialog(open);
                      if (open) setSelectedBranch(branch);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Department
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <DepartmentIcon className="h-5 w-5 text-blue-600" />
                          Add Department to {branch.name}
                        </DialogTitle>
                        <DialogDescription>
                          Create a new department within this branch.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="deptName">Department Name</Label>
                          <Input
                            id="deptName"
                            value={departmentForm.name}
                            onChange={(e) =>
                              setDepartmentForm({
                                ...departmentForm,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g., Engineering, Marketing, Sales"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowDepartmentDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleCreateDepartment}
                          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          Create Department
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="space-y-3">
                  {branch.departments.length > 0 ? (
                    branch.departments.map((department) => (
                      <div
                        key={department.id}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md">
                            <Briefcase className="h-3 w-3 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">
                              {department.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {department._count?.users || 0} employees
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {department._count?.users || 0}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                            onClick={() =>
                              handleDeleteDepartment(department.id)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-500">
                      <DepartmentIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No departments yet</p>
                      <p className="text-xs">
                        Add your first department to get started
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {branches.length === 0 && (
          <Card className="border-2 border-dashed border-slate-300 bg-slate-50/50">
            <CardContent className="p-12 text-center">
              <Building2 className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No branches yet
              </h3>
              <p className="text-slate-500 mb-6">
                Create your first branch to start organizing your company
                structure.
              </p>
              <Button
                onClick={() => setShowBranchDialog(true)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Branch
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminOnly>
  );
}
