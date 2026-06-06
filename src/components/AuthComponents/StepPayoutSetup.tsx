import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export type PayoutStepForm = {
  business_name: string;
  business_type: string;
  contact_phone_number: string;
  bank_account_holder_name: string;
  bank_name: string;
  account_number: string;
  confirm_account_number: string;
  iban_routing_number: string;
  swift_bic_code: string;
};

type StepPayoutSetupProps = {
  value: PayoutStepForm;
  onChange: (patch: Partial<PayoutStepForm>) => void;
};

const BUSINESS_TYPES = [
  { value: "individual", label: "Individual" },
  { value: "registered_company", label: "Registered Company" },
];

const StepPayoutSetup = ({ value, onChange }: StepPayoutSetupProps) => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          {t("onboardingFields.payout.title")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("onboardingFields.payout.subtitle")}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.bizNameLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.payout.bizNamePlaceholder")}
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.business_name}
            onChange={(e) => onChange({ business_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.bizTypeLabel")}
          </label>
          <Select
            value={value.business_type}
            onValueChange={(v) => onChange({ business_type: v })}
          >
            <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
              <SelectValue placeholder={t("onboardingFields.payout.bizTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              {BUSINESS_TYPES.map((typeObj) => (
                <SelectItem key={typeObj.value} value={typeObj.value}>
                  {typeObj.value === "individual"
                    ? t("onboardingFields.payout.typeIndividual")
                    : t("onboardingFields.payout.typeCompany")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.phoneLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.payout.phonePlaceholder")}
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.contact_phone_number}
            onChange={(e) => onChange({ contact_phone_number: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-bold text-primary">
            {t("onboardingFields.payout.accountDetailsHeader")}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {t("onboardingFields.payout.accountDetailsDesc")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.holderLabel")}
            </label>
            <Input
              placeholder={t("onboardingFields.payout.holderPlaceholder")}
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.bank_account_holder_name}
              onChange={(e) =>
                onChange({ bank_account_holder_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.bankLabel")}
            </label>
            <Input
              placeholder={t("onboardingFields.payout.bankPlaceholder")}
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.bank_name}
              onChange={(e) => onChange({ bank_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.numberLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.payout.numberPlaceholder")}
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.account_number}
            onChange={(e) => onChange({ account_number: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.confirmNumberLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.payout.confirmNumberPlaceholder")}
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.confirm_account_number}
            onChange={(e) =>
              onChange({ confirm_account_number: e.target.value })
            }
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.ibanLabel")}
            </label>
            <Input
              placeholder={t("onboardingFields.payout.ibanPlaceholder")}
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.iban_routing_number}
              onChange={(e) =>
                onChange({ iban_routing_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.swiftLabel")}
            </label>
            <Input
              placeholder={t("onboardingFields.payout.swiftPlaceholder")}
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.swift_bic_code}
              onChange={(e) => onChange({ swift_bic_code: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepPayoutSetup;
