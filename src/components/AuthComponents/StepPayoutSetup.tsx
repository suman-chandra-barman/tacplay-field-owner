/** @format */

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const BUSINESS_TYPES: { value: string; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "registered_company", label: "Registered Company" },
];

const StepPayoutSetup = ({ value, onChange }: StepPayoutSetupProps) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Business &amp; Payout Information
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Provide business details and payout information to receive booking
          payments and manage subscriptions securely.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Business Name
          </label>
          <Input
            placeholder="Enter business name"
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.business_name}
            onChange={(e) => onChange({ business_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Business Type
          </label>
          <Select
            value={value.business_type}
            onValueChange={(v) => onChange({ business_type: v })}
          >
            <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              {BUSINESS_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Contact Phone Number
          </label>
          <Input
            placeholder="+44 7700 900123"
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.contact_phone_number}
            onChange={(e) => onChange({ contact_phone_number: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-lg font-bold text-primary">
            Payout Account Details
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Provide your bank details to receive payments from player bookings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Bank Account Holder Name
            </label>
            <Input
              placeholder="Account holder name"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.bank_account_holder_name}
              onChange={(e) =>
                onChange({ bank_account_holder_name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Bank Name
            </label>
            <Input
              placeholder="Bank name"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.bank_name}
              onChange={(e) => onChange({ bank_name: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Account Number
          </label>
          <Input
            placeholder="Enter account number"
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.account_number}
            onChange={(e) => onChange({ account_number: e.target.value })}
            autoComplete="off"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Confirm Account Number
          </label>
          <Input
            placeholder="Re-enter account number"
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
              IBAN / Routing Number
            </label>
            <Input
              placeholder="IBAN or routing number"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.iban_routing_number}
              onChange={(e) =>
                onChange({ iban_routing_number: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              SWIFT / BIC Code
            </label>
            <Input
              placeholder="SWIFT code"
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
