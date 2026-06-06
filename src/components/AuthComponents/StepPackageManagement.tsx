import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

export type PackageEntryForm = {
  package_name: string;
  description: string;
  package_fee: string;
  include_items: string;
};

type StepPackageManagementProps = {
  value: PackageEntryForm[];
  onChange: (index: number, patch: Partial<PackageEntryForm>) => void;
  onAddPackage: () => void;
  onRemovePackage: (index: number) => void;
};

const StepPackageManagement = ({
  value,
  onChange,
  onAddPackage,
  onRemovePackage,
}: StepPackageManagementProps) => {
  const { t } = useTranslation("dashboard");
  const canRemove = value.length > 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {t("onboardingFields.packages.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("onboardingFields.packages.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={onAddPackage}
          className="px-4 py-2 rounded-lg border border-white/10 bg-input/30 text-sm text-primary hover:bg-input/50 transition-colors"
        >
          {t("onboardingFields.packages.addButton")}
        </button>
      </div>

      {value.map((pkg, index) => (
        <div
          key={index}
          className="space-y-5 border-t border-white/5 pt-6 first:border-t-0 first:pt-0"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-primary">
              {t("onboardingFields.packages.typeHeader", { index: index + 1 })}
            </h3>
            {canRemove ? (
              <button
                type="button"
                onClick={() => onRemovePackage(index)}
                className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {t("onboardingFields.packages.remove")}
              </button>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.packages.nameLabel")}
            </label>
            <Input
              placeholder={t("onboardingFields.packages.namePlaceholder")}
              className="bg-input/30 border-white/10 text-primary h-11"
              value={pkg.package_name}
              onChange={(e) =>
                onChange(index, { package_name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.packages.descLabel")}
            </label>
            <Textarea
              placeholder={t("onboardingFields.packages.descPlaceholder")}
              className="bg-input/30 border-white/10 text-primary min-h-25"
              value={pkg.description}
              onChange={(e) => onChange(index, { description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.packages.feeLabel")}
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
              {t("onboardingFields.packages.includeLabel")}
            </label>
            <p className="text-xs text-muted-foreground">
              {t("onboardingFields.packages.includeDesc")}
            </p>
            <Input
              placeholder={t("onboardingFields.packages.includePlaceholder")}
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
