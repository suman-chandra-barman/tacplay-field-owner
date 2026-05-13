/** @format */

"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "react-toastify";
import StepArenaInfo, {
  type ArenaStepForm,
} from "@/components/AuthComponents/StepArenaInfo";
import StepBusinessSetup, {
  type MatchRulesStepForm,
} from "@/components/AuthComponents/StepBusinessSetup";
import StepPackageManagement, {
  type PackageEntryForm,
} from "@/components/AuthComponents/StepPackageManagement";
import StepPayoutSetup, {
  type PayoutStepForm,
} from "@/components/AuthComponents/StepPayoutSetup";
import {
  useSubmitStep1ArenaInfoMutation,
  useSubmitStep2MatchRequirementsMutation,
  useSubmitStep3PackageManagementMutation,
  useSubmitStep4PayoutBusinessMutation,
  type CompletionFlowResponse,
  type Step2MatchRequirementsBody,
} from "@/redux/features/arenaManagement/arenaManagementAPI";
import { setArenaField } from "@/redux/features/arenaManagement/arenaManagementSlice";
import { useAppDispatch } from "@/redux/hooks";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";

const TOAST = {
  autoClose: 4200,
  theme: "dark" as const,
  position: "top-center" as const,
};

function ToastTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold leading-snug text-primary pr-6">
      {children}
    </p>
  );
}

function ToastDetail({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs leading-snug text-muted-foreground mt-1 max-w-[min(100%,320px)]">
      {children}
    </p>
  );
}

function toastStepSuccess(apiMessage: string, nextHint: string | null) {
  toast.success(
    <div className="text-left">
      <ToastTitle>{apiMessage}</ToastTitle>
      {nextHint ? <ToastDetail>{nextHint}</ToastDetail> : null}
    </div>,
    TOAST,
  );
}

function toastStepError(title: string, detail: string) {
  toast.error(
    <div className="text-left">
      <ToastTitle>{title}</ToastTitle>
      <ToastDetail>{detail}</ToastDetail>
    </div>,
    TOAST,
  );
}

function toastApiError(err: unknown, fallbackDetail: string) {
  const line = getErrorMessage(err, fallbackDetail);
  toast.error(
    <div className="text-left">
      <ToastTitle>Couldn&apos;t save this step</ToastTitle>
      <ToastDetail>{line}</ToastDetail>
    </div>,
    TOAST,
  );
}

const steps = [
  { id: 1, label: "Arena Info" },
  { id: 2, label: "Business Setup" },
  { id: 3, label: "Package Management" },
  { id: 4, label: "Payout & Business Setup" },
];

const defaultArena: ArenaStepForm = {
  field_name: "",
  description: "",
  country: "Bangladesh",
  city: "Dhaka",
  full_address: "",
  image: null,
};

const defaultMatchRules: MatchRulesStepForm = {
  minimum_players_per_team: "6",
  maximum_players_per_team: "8",
  minimum_players_per_session: "16",
  maximum_players_per_session: "16",
  default_session_duration: "50",
  duration_unit: "minute",
  base_price_per_player: "25.25",
  allow_social_matches: true,
  allow_ranked_matches: false,
};

const defaultPackages: PackageEntryForm[] = [
  {
    package_name: "",
    description: "",
    package_fee: "",
    include_items: "",
  },
  {
    package_name: "",
    description: "",
    package_fee: "",
    include_items: "",
  },
];

const defaultPayout: PayoutStepForm = {
  business_name: "",
  business_type: "registered_company",
  contact_phone_number: "",
  bank_account_holder_name: "",
  bank_name: "",
  account_number: "",
  confirm_account_number: "",
  iban_routing_number: "",
  swift_bic_code: "",
};

function parseIncludeItems(raw: string): string[] {
  return raw
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePositiveInt(raw: string, label: string): number {
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) {
    throw new Error(`${label} must be a positive number`);
  }
  return n;
}

function buildStep2Body(match: MatchRulesStepForm): Step2MatchRequirementsBody {
  return {
    minimum_players_per_team: parsePositiveInt(
      match.minimum_players_per_team,
      "Minimum players per team",
    ),
    maximum_players_per_team: parsePositiveInt(
      match.maximum_players_per_team,
      "Maximum players per team",
    ),
    minimum_players_per_session: parsePositiveInt(
      match.minimum_players_per_session,
      "Minimum players per session",
    ),
    maximum_players_per_session: parsePositiveInt(
      match.maximum_players_per_session,
      "Maximum players per session",
    ),
    default_session_duration: parsePositiveInt(
      match.default_session_duration,
      "Default session duration",
    ),
    base_price_per_player: match.base_price_per_player.trim(),
    allow_social_matches: match.allow_social_matches,
    allow_ranked_matches: match.allow_ranked_matches,
  };
}

const ProfileSetupPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [arena, setArena] = useState<ArenaStepForm>(defaultArena);
  const [matchRules, setMatchRules] =
    useState<MatchRulesStepForm>(defaultMatchRules);
  const [packages, setPackages] = useState<PackageEntryForm[]>(defaultPackages);
  const [payout, setPayout] = useState<PayoutStepForm>(defaultPayout);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const [submitStep1, { isLoading: loading1 }] =
    useSubmitStep1ArenaInfoMutation();
  const [submitStep2, { isLoading: loading2 }] =
    useSubmitStep2MatchRequirementsMutation();
  const [submitStep3, { isLoading: loading3 }] =
    useSubmitStep3PackageManagementMutation();
  const [submitStep4, { isLoading: loading4 }] =
    useSubmitStep4PayoutBusinessMutation();

  const busy = loading1 || loading2 || loading3 || loading4;

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveArenaSuccess = (response: CompletionFlowResponse) => {
    dispatch(setArenaField(response.data));
  };

  const handlePrimaryAction = async () => {
    if (busy) return;

    try {
      if (currentStep === 0) {
        if (
          !arena.field_name.trim() ||
          !arena.description.trim() ||
          !arena.country.trim() ||
          !arena.city.trim() ||
          !arena.full_address.trim()
        ) {
          toastStepError(
            "Arena details incomplete",
            "Enter your arena name, description, country, city, and full address.",
          );
          return;
        }
        if (!arena.image) {
          toastStepError(
            "Arena photo required",
            "Upload a thumbnail image so players can recognize your field.",
          );
          return;
        }
        const response = await submitStep1({
          field_name: arena.field_name.trim(),
          description: arena.description.trim(),
          country: arena.country.trim(),
          city: arena.city.trim(),
          full_address: arena.full_address.trim(),
          image: arena.image,
        }).unwrap();
        saveArenaSuccess(response);
        toastStepSuccess(
          getSuccessMessage(response, "Step 1 saved successfully"),
          "Next: configure match capacity, session length, and base pricing.",
        );
        setCurrentStep(1);
        return;
      }

      if (currentStep === 1) {
        const body = buildStep2Body(matchRules);
        if (!body.base_price_per_player) {
          toastStepError(
            "Base price missing",
            "Enter a base price per player so bookings can be priced correctly.",
          );
          return;
        }
        const response = await submitStep2(body).unwrap();
        saveArenaSuccess(response);
        toastStepSuccess(
          getSuccessMessage(response, "Step 2 saved successfully"),
          "Next: define equipment packages for your players.",
        );
        setCurrentStep(2);
        return;
      }

      if (currentStep === 2) {
        const trimmed = packages.map((p) => ({
          package_name: p.package_name.trim(),
          description: p.description.trim(),
          package_fee: p.package_fee.trim(),
          include_items: parseIncludeItems(p.include_items),
        }));
        for (const p of trimmed) {
          if (!p.package_name || !p.description || !p.package_fee) {
            toastStepError(
              "Packages incomplete",
              "Each package needs a name, description, and fee. Check both package blocks.",
            );
            return;
          }
        }
        const response = await submitStep3({ packages: trimmed }).unwrap();
        saveArenaSuccess(response);
        toastStepSuccess(
          getSuccessMessage(response, "Step 3 saved successfully"),
          "Next: add your business and payout details to finish onboarding.",
        );
        setCurrentStep(3);
        return;
      }

      if (currentStep === 3) {
        if (
          !payout.business_name.trim() ||
          !payout.business_type.trim() ||
          !payout.contact_phone_number.trim()
        ) {
          toastStepError(
            "Business details incomplete",
            "Enter your business name, type, and a contact phone number.",
          );
          return;
        }
        if (
          !payout.bank_account_holder_name.trim() ||
          !payout.bank_name.trim() ||
          !payout.account_number.trim() ||
          !payout.confirm_account_number.trim() ||
          !payout.iban_routing_number.trim() ||
          !payout.swift_bic_code.trim()
        ) {
          toastStepError(
            "Payout details incomplete",
            "Fill in bank holder, bank name, account numbers, IBAN/routing, and SWIFT/BIC.",
          );
          return;
        }
        if (payout.account_number !== payout.confirm_account_number) {
          toastStepError(
            "Account numbers don't match",
            "Re-enter the same account number in both fields.",
          );
          return;
        }

        const response = await submitStep4({
          business_name: payout.business_name.trim(),
          business_type: payout.business_type.trim(),
          contact_phone_number: payout.contact_phone_number.trim(),
          bank_account_holder_name: payout.bank_account_holder_name.trim(),
          bank_name: payout.bank_name.trim(),
          account_number: payout.account_number.trim(),
          confirm_account_number: payout.confirm_account_number.trim(),
          iban_routing_number: payout.iban_routing_number.trim(),
          swift_bic_code: payout.swift_bic_code.trim(),
        }).unwrap();
        saveArenaSuccess(response);
        const doneMessage = getSuccessMessage(
          response,
          "Account completion flow submitted successfully",
        );
        toastStepSuccess(
          doneMessage,
          "Your application is being reviewed. Taking you to the home page…",
        );
        window.setTimeout(() => {
          router.push("/");
        }, 1400);
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("must be")) {
        toastStepError("Check your match settings", err.message);
      } else {
        toastApiError(
          err,
          "Something went wrong. Please try again in a moment.",
        );
      }
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepArenaInfo
            value={arena}
            onChange={(patch) => setArena((prev) => ({ ...prev, ...patch }))}
          />
        );
      case 1:
        return (
          <StepBusinessSetup
            value={matchRules}
            onChange={(patch) =>
              setMatchRules((prev) => ({ ...prev, ...patch }))
            }
          />
        );
      case 2:
        return (
          <StepPackageManagement
            value={packages}
            onChange={(index, patch) =>
              setPackages((prev) =>
                prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
              )
            }
          />
        );
      case 3:
        return (
          <StepPayoutSetup
            value={payout}
            onChange={(patch) => setPayout((prev) => ({ ...prev, ...patch }))}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-root-bg">
      <aside className="hidden md:flex w-72 lg:w-80 flex-col border-r border-white/5 bg-card/50 p-6">
        <div className="h-6 flex items-center justify-center">
          <Image
            src="/Tacplay-logo-2.png"
            alt="TacPlay"
            width={200}
            height={200}
            className="object-contain h-12 "
            priority
          />
        </div>

        <nav className="flex-1 space-y-2">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (index <= currentStep) setCurrentStep(index);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-white/5 text-primary"
                    : isCompleted
                      ? "text-primary"
                      : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold transition-colors ${
                    isCompleted
                      ? "bg-green-500/20 text-green-400 border border-green-500/40"
                      : isActive
                        ? "bg-custom-red/20 text-custom-red border border-custom-red/40"
                        : "bg-white/5 text-muted-foreground border border-white/10"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span className="text-sm font-medium">{step.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5">
          <Image
            src="/Tacplay-logo.png"
            alt="TacPlay"
            width={100}
            height={35}
            className="object-contain"
          />
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>

        <div className="md:hidden flex items-center gap-2 px-4 pt-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            return (
              <div
                key={step.id}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <div
                  className={`h-1.5 w-full rounded-full transition-colors ${
                    isCompleted
                      ? "bg-green-500"
                      : isActive
                        ? "bg-custom-red"
                        : "bg-white/10"
                  }`}
                />
                <span className="text-[10px] text-muted-foreground truncate max-w-full">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-3xl">
          {renderStepContent()}
        </div>

        <div className="border-t border-white/5 p-4 sm:p-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentStep === 0
                ? "opacity-0 pointer-events-none"
                : "border border-white/10 bg-input/30 text-primary hover:bg-input/50"
            }`}
          >
            ← Previous
          </button>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={busy}
            className="px-6 py-2.5 rounded-lg bg-custom-red text-white text-sm font-semibold hover:bg-custom-red/90 transition-colors border-2 border-border disabled:opacity-60 disabled:pointer-events-none"
          >
            {busy
              ? "Please wait…"
              : isLastStep
                ? "Submit & Approve"
                : "Continue"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileSetupPage;
