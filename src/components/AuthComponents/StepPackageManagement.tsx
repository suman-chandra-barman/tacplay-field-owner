/** @format */

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type PackageEntryForm = {
  package_name: string;
  description: string;
  package_fee: string;
  include_items: string;
};

type StepPackageManagementProps = {
  value: PackageEntryForm[];
  onChange: (index: number, patch: Partial<PackageEntryForm>) => void;
};

const StepPackageManagement = ({
  value,
  onChange,
}: StepPackageManagementProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Field Packages Management
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Create bundled packages for players and events including equipment and
          paintballs.
        </p>
      </div>

      {value.map((pkg, index) => (
        <div
          key={index}
          className="space-y-5 border-t border-white/5 pt-6 first:border-t-0 first:pt-0"
        >
          <h3 className="text-lg font-bold text-primary">
            Package Type {index + 1}
          </h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Package Name
            </label>
            <Input
              placeholder="Enter package name"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={pkg.package_name}
              onChange={(e) =>
                onChange(index, { package_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Description
            </label>
            <Textarea
              placeholder="Describe this package..."
              className="bg-input/30 border-white/10 text-primary min-h-[100px]"
              value={pkg.description}
              onChange={(e) => onChange(index, { description: e.target.value })}
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
              placeholder="0.00"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={pkg.package_fee}
              onChange={(e) => onChange(index, { package_fee: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Include Items
            </label>
            <p className="text-xs text-muted-foreground">
              Comma-separated list (e.g. Mask, Gun, 100 Paintballs).
            </p>
            <Input
              placeholder="Mask, Gun, 100 Paintballs"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={pkg.include_items}
              onChange={(e) =>
                onChange(index, { include_items: e.target.value })
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StepPackageManagement;
