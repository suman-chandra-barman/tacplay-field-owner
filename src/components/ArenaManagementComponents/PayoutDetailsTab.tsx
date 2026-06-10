/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Pen, Save, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditPayoutDetailsMutation,
  useGetPayoutDetailsQuery,
} from "@/redux/features/arenaManagement/arenaManagementAPI";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import UpgradeModal from "@/components/CommonComponents/UpgradeModal";

type PayoutForm = {
  business_name: string;
  business_type: string;
  contact_phone_number: string;
  bank_account_holder_name: string;
  bank_name: string;
  account_number: string;
  iban_routing_number: string;
  swift_bic_code: string;
};

const PayoutDetailsTab = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading, isFetching, isError, error } = useGetPayoutDetailsQuery();
  const [editPayoutDetails, { isLoading: isSaving }] =
    useEditPayoutDetailsMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PayoutForm | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const baseForm = useMemo<PayoutForm>(
    () => ({
      business_name: data?.data.business_name ?? "",
      business_type: data?.data.business_type ?? "",
      contact_phone_number: data?.data.contact_phone_number ?? "",
      bank_account_holder_name: data?.data.bank_account_holder_name ?? "",
      bank_name: data?.data.bank_name ?? "",
      account_number: data?.data.account_number ?? "",
      iban_routing_number: data?.data.iban_routing_number ?? "",
      swift_bic_code: data?.data.swift_bic_code ?? "",
    }),
    [data],
  );

  const form = isEditing ? (draft ?? baseForm) : baseForm;

  const handleToggleEdit = () => {
    if (isEditing) {
      setDraft(null);
      setIsEditing(false);
      return;
    }

    setDraft(baseForm);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!draft) return;

    try {
      const response = await editPayoutDetails({
        business_name: draft.business_name,
        business_type: draft.business_type,
        contact_phone_number: draft.contact_phone_number,
        bank_account_holder_name: draft.bank_account_holder_name,
        bank_name: draft.bank_name,
        account_number: draft.account_number,
        iban_routing_number: draft.iban_routing_number,
        swift_bic_code: draft.swift_bic_code,
      }).unwrap();

      toast.success(
        getSuccessMessage(response, t("arena.payoutTab.updated")),
      );

      setDraft(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, t("arena.payoutTab.updateFailed")));
      // Keep edit mode open so user can retry.
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        {t("arena.payoutTab.loading")}
      </div>
    );
  }

  if (isError) {
    const isForbidden = error && "status" in error && error.status === 403;
    const errorData = error && "status" in error ? (error.data as Record<string, unknown> | undefined) : undefined;
    const errorMsg = typeof errorData?.message === "string" ? errorData.message : "";

    if (isForbidden || errorMsg.includes("Bronze plan") || errorMsg.includes("Essential Starter for Fields")) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-card border border-white/5 rounded-2xl shadow-xl min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-custom-red/10 border border-custom-red/20 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(152,0,9,0.3)] animate-pulse">
            <Lock className="w-6 h-6 text-custom-red" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
            {t("arena.payoutTab.unlockTitle", "Unlock Payout Details")}
          </h3>
          <p className="text-sm text-secondary max-w-[420px] mb-6 leading-relaxed">
            {t(
              "arena.payoutTab.unlockDesc",
              "Upgrade your plan to Essential for Field Growth or Gold to view and edit your payout accounts, bank credentials, and manage business details."
            )}
          </p>
          <button
            onClick={() => setIsUpgradeModalOpen(true)}
            className="flex items-center gap-2 bg-linear-to-r from-[#980009] via-[#C00069] to-[#980009] text-white text-sm font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-[0_0_15px_rgba(192,0,105,0.4)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Crown className="w-4 h-4 text-[#cdba20]" />
            {t("sidebar.upgrade", "Upgrade")}
          </button>

          <UpgradeModal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
          />
        </div>
      );
    }

    return (
      <div className="py-10 text-sm text-destructive">
        {t("arena.payoutTab.loadFailed")}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {t("onboardingFields.payout.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("onboardingFields.payout.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="w-fit flex items-center gap-2"
            onClick={handleToggleEdit}
          >
            <Pen className="w-4 h-4" />
            {isEditing ? t("arena.cancelEdit") : t("arena.editInfo")}
          </Button>
          {isEditing && (
            <Button
              variant="default"
              size="sm"
              className="w-fit flex items-center gap-2"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {t("arena.save")}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.bizNameLabel")}
          </label>
          <Input
            value={form.business_name}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      business_name: event.target.value,
                    }
                  : previous,
              )
            }
            readOnly={!isEditing}
            className="bg-input/30 border-white/10 text-primary h-11"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.bizTypeLabel")}
          </label>
          <Select
            value={form.business_type}
            onValueChange={(value) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      business_type: value,
                    }
                  : previous,
              )
            }
            disabled={!isEditing}
          >
            <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
              <SelectValue placeholder={t("onboardingFields.payout.bizTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              <SelectItem value="individual">{t("onboardingFields.payout.typeIndividual")}</SelectItem>
              <SelectItem value="registered_company">
                {t("onboardingFields.payout.typeCompany")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.phoneLabel")}
          </label>
          <Input
            value={form.contact_phone_number}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      contact_phone_number: event.target.value,
                    }
                  : previous,
              )
            }
            readOnly={!isEditing}
            className="bg-input/30 border-white/10 text-primary h-11"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-primary">
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
              value={form.bank_account_holder_name}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        bank_account_holder_name: event.target.value,
                      }
                    : previous,
                )
              }
              readOnly={!isEditing}
              className="bg-input/30 border-white/10 text-primary h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.bankLabel")}
            </label>
            <Input
              value={form.bank_name}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        bank_name: event.target.value,
                      }
                    : previous,
                )
              }
              readOnly={!isEditing}
              className="bg-input/30 border-white/10 text-primary h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.payout.numberLabel")}
          </label>
          <Input
            value={form.account_number}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      account_number: event.target.value,
                    }
                  : previous,
              )
            }
            readOnly={!isEditing}
            className="bg-input/30 border-white/10 text-primary h-11"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.ibanLabel")}
            </label>
            <Input
              value={form.iban_routing_number}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        iban_routing_number: event.target.value,
                      }
                    : previous,
                )
              }
              readOnly={!isEditing}
              className="bg-input/30 border-white/10 text-primary h-11"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.payout.swiftLabel")}
            </label>
            <Input
              value={form.swift_bic_code}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        swift_bic_code: event.target.value,
                      }
                    : previous,
                )
              }
              readOnly={!isEditing}
              className="bg-input/30 border-white/10 text-primary h-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutDetailsTab;
