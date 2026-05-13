/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Pen, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useEditPackageManagementMutation,
  useGetPackageManagementQuery,
} from "@/redux/features/arenaManagement/arenaManagementAPI";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { toast } from "react-toastify";

type PackageForm = {
  id?: number;
  package_name: string;
  description: string;
  package_fee: string;
  include_items: string[];
  is_active: boolean;
};

const EMPTY_PACKAGE: PackageForm = {
  package_name: "",
  description: "",
  package_fee: "",
  include_items: [],
  is_active: true,
};

const PackageManagementTab = () => {
  const { data, isLoading, isFetching, isError } =
    useGetPackageManagementQuery();
  const [editPackageManagement, { isLoading: isSaving }] =
    useEditPackageManagementMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draftPackages, setDraftPackages] = useState<PackageForm[] | null>(
    null,
  );
  const [includeItemInputs, setIncludeItemInputs] = useState<
    Record<number, string>
  >({});

  const basePackages = useMemo(
    () =>
      (data?.data.packages ?? []).map((item) => ({
        id: item.id,
        package_name: item.package_name,
        description: item.description,
        package_fee: item.package_fee,
        include_items: item.include_items,
        is_active: item.is_active,
      })),
    [data],
  );

  const packages = isEditing ? (draftPackages ?? basePackages) : basePackages;

  const handleToggleEdit = () => {
    if (isEditing) {
      setDraftPackages(null);
      setIncludeItemInputs({});
      setIsEditing(false);
      return;
    }

    setDraftPackages(basePackages);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!draftPackages) return;

    try {
      const response = await editPackageManagement({
        packages: draftPackages.map((item) => ({
          package_name: item.package_name,
          description: item.description,
          package_fee: item.package_fee,
          include_items: item.include_items,
          is_active: item.is_active,
        })),
      }).unwrap();

      toast.success(
        getSuccessMessage(response, "Package management updated successfully."),
      );

      setDraftPackages(null);
      setIncludeItemInputs({});
      setIsEditing(false);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Failed to update package management."),
      );
      // Keep edit mode open so user can retry.
    }
  };

  const updatePackage = (index: number, patch: Partial<PackageForm>) => {
    setDraftPackages((previous) =>
      previous
        ? previous.map((item, i) =>
            i === index ? { ...item, ...patch } : item,
          )
        : previous,
    );
  };

  const addPackage = () => {
    setDraftPackages((previous) =>
      previous ? [...previous, { ...EMPTY_PACKAGE }] : [{ ...EMPTY_PACKAGE }],
    );
  };

  const removePackage = (index: number) => {
    setDraftPackages((previous) =>
      previous ? previous.filter((_, i) => i !== index) : previous,
    );
  };

  const addItem = (index: number, rawValue: string) => {
    const value = rawValue.trim();
    if (!value) return;

    setDraftPackages((previous) =>
      previous
        ? previous.map((pkg, pkgIndex) => {
            if (pkgIndex !== index) return pkg;

            const exists = pkg.include_items.includes(value);
            if (exists) return pkg;

            return {
              ...pkg,
              include_items: [...pkg.include_items, value],
            };
          })
        : previous,
    );

    setIncludeItemInputs((previous) => ({
      ...previous,
      [index]: "",
    }));
  };

  const setIncludeItemInput = (index: number, value: string) => {
    setIncludeItemInputs((previous) => ({
      ...previous,
      [index]: value,
    }));
  };

  const removeItem = (index: number, value: string) => {
    setDraftPackages((previous) =>
      previous
        ? previous.map((pkg, pkgIndex) =>
            pkgIndex === index
              ? {
                  ...pkg,
                  include_items: pkg.include_items.filter(
                    (item) => item !== value,
                  ),
                }
              : pkg,
          )
        : previous,
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading packages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-sm text-destructive">
        Failed to load packages.
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8 md:mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Field Packages Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create bundled packages for players and events including equipment
            and paintballs.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleToggleEdit}
          >
            <Pen className="w-4 h-4" />
            {isEditing ? "Cancel Edit" : "Edit Information"}
          </Button>
          {isEditing && (
            <>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex items-center gap-2"
                onClick={addPackage}
              >
                <Plus className="w-4 h-4" />
                Add New Package
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {packages.map((pkg, index) => (
          <div key={`${pkg.id ?? "new"}-${index}`} className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-primary">
                Package Type {index + 1}
              </h3>
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePackage(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Package Name
              </label>
              <Input
                value={pkg.package_name}
                onChange={(event) =>
                  updatePackage(index, { package_name: event.target.value })
                }
                readOnly={!isEditing}
                className="bg-input/30 border-white/10 text-primary h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Description
              </label>
              <Textarea
                value={pkg.description}
                onChange={(event) =>
                  updatePackage(index, { description: event.target.value })
                }
                readOnly={!isEditing}
                className="bg-input/30 border-white/10 text-primary min-h-25"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Package Fee
              </label>
              <Input
                type="number"
                inputMode="decimal"
                step="0.01"
                value={pkg.package_fee}
                onChange={(event) =>
                  updatePackage(index, { package_fee: event.target.value })
                }
                readOnly={!isEditing}
                className="bg-input/30 border-white/10 text-primary h-11"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-white/5">
              <label className="text-sm font-medium text-primary">
                Package Active
              </label>
              <div className="flex items-center gap-3">
                <Switch
                  checked={pkg.is_active}
                  onCheckedChange={(checked) =>
                    updatePackage(index, { is_active: checked })
                  }
                  disabled={!isEditing}
                  className="data-[state=checked]:bg-custom-yellow"
                />
                <span className="text-sm text-muted-foreground">
                  {pkg.is_active ? "On" : "Off"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary">
                Include Items
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Type an item and press Enter"
                  className="bg-input/30 border-white/10 text-primary h-11"
                  readOnly={!isEditing}
                  value={includeItemInputs[index] ?? ""}
                  onChange={(event) =>
                    setIncludeItemInput(index, event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" || !isEditing) return;
                    event.preventDefault();
                    addItem(index, includeItemInputs[index] ?? "");
                  }}
                />
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  disabled={!isEditing}
                  className="h-11 px-4"
                  onClick={() => addItem(index, includeItemInputs[index] ?? "")}
                >
                  Add
                </Button>
              </div>

              {pkg.include_items.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {pkg.include_items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 bg-primary/15 border border-primary/30 text-primary text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {item}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeItem(index, item)}
                          className="flex items-center justify-center hover:text-destructive transition-colors"
                          aria-label={`Remove ${item}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PackageManagementTab;
