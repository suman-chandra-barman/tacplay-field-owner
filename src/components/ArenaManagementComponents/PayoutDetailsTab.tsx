/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Pen, Save } from "lucide-react";
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
  const { data, isLoading, isFetching, isError } = useGetPayoutDetailsQuery();
  const [editPayoutDetails, { isLoading: isSaving }] =
    useEditPayoutDetailsMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PayoutForm | null>(null);

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
        getSuccessMessage(response, "Payout details updated successfully."),
      );

      setDraft(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update payout details."));
      // Keep edit mode open so user can retry.
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading payout details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-sm text-destructive">
        Failed to load payout details.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Business &amp; Payout Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Provide business details and payout information to receive booking
            payments and manage subscriptions securely.
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
            {isEditing ? "Cancel Edit" : "Edit Information"}
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
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Business Name
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
            Business Type
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
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent className="bg-card border-white/10">
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="registered_company">
                Registered Company
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Contact Phone Number
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
              Bank Name
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
            Account Number
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
              IBAN / Routing Number
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
              SWIFT / BIC Code
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
