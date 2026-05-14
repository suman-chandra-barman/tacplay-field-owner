/** @format */
"use client";
import React, { useMemo } from "react";
import { Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import {
  useGetFieldOwnerSubscriptionPlansQuery,
  useGetFieldOwnerSubscriptionStatusQuery,
  useUpgradeFieldOwnerSubscriptionMutation,
} from "@/redux/features/subscriptions/subscriptionsAPI";
import { useAppDispatch } from "@/redux/hooks";
import {
  setLastPaymentUrl,
  setSelectedPlanCode,
} from "@/redux/features/subscriptions/subscriptionsSlice";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLAN_FEATURES: Record<string, string[]> = {
  field_bronze_monthly: [
    "Create and manage sessions",
    "Accept player bookings",
    "Appear in field search results",
    "Basic booking overview",
    "Push Notification",
    "Player Review & Rating",
    "Host ranked matches",
  ],
  field_silver_monthly: [
    "Everything in Bronze",
    "Advanced booking analytics",
    "Priority listing in search",
    "Ai Smart Scheduling",
    "Discount code & Promotion",
    "Email & Push Campaign",
    "Priority Email Support",
  ],
  field_gold_monthly: [
    "Everything in Silver",
    "Unlimited session creation",
    "Full earnings tracking",
    "Detailed performance insights",
    "Custom field branding",
    "Coming Soon & blend Out",
  ],
};

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const dispatch = useAppDispatch();

  const {
    data: plansResponse,
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    isError: isPlansError,
  } = useGetFieldOwnerSubscriptionPlansQuery(undefined, {
    skip: !isOpen,
  });

  const {
    data: statusResponse,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
  } = useGetFieldOwnerSubscriptionStatusQuery(undefined, {
    skip: !isOpen,
  });

  const [upgradeSubscription, { isLoading: isUpgrading }] =
    useUpgradeFieldOwnerSubscriptionMutation();

  const plans = plansResponse?.data ?? [];
  const currentPlanCode = statusResponse?.data?.plan_code ?? null;

  const handleUpgrade = async (planCode: string) => {
    if (currentPlanCode === planCode) {
      toast.success("This plan is already active.");
      return;
    }

    const paymentWindow = window.open("about:blank", "_blank");

    try {
      const response = await upgradeSubscription({
        plan_code: planCode,
      }).unwrap();
      const paymentUrl = response.data.payment_url;

      dispatch(setSelectedPlanCode(planCode));
      dispatch(setLastPaymentUrl(paymentUrl));

      if (paymentWindow) {
        paymentWindow.location.href = paymentUrl;
      } else {
        window.open(paymentUrl, "_blank");
      }

      toast.success(
        getSuccessMessage(
          response,
          "Stripe checkout session created successfully.",
        ),
      );
      onClose();
    } catch (error) {
      if (paymentWindow) {
        paymentWindow.close();
      }
      toast.error(
        getErrorMessage(error, "Failed to start subscription upgrade."),
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-[#0b0b0f] border border-[#2C2740] max-w-300 sm:max-w-300 w-full max-h-[90vh] overflow-y-auto p-0 rounded-2xl"
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4 text-center ">
          <DialogClose asChild>
            <button
              onClick={onClose}
              className="cursor-pointer absolute top-4 right-4 flex items-center gap-1.5 text-[#9a98b8] hover:text-white text-sm font-medium transition-colors"
            >
              Cancel
              <span className="w-6 h-6 rounded-full border border-[#2C2740] flex items-center justify-center">
                <X size={12} />
              </span>
            </button>
          </DialogClose>

          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2">
            Power Your Field. Control Every Match.
          </h2>
          <p className="text-secondary text-sm max-w-md mx-auto leading-relaxed">
            Choose a plan that unlocks the right tools to manage sessions, host
            ranked games, and grow your arena on TACPLAY.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-8 items-start">
          {isPlansLoading || isPlansFetching ? (
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((placeholder) => (
                <div
                  key={placeholder}
                  className="h-105 rounded-2xl border border-[#2C2740] bg-[#0b0b0f] animate-pulse"
                />
              ))}
            </div>
          ) : isPlansError ? (
            <div className="md:col-span-3 rounded-2xl border border-[#2C2740] bg-[#0b0b0f] p-6 text-sm text-red-400">
              Failed to load subscription plans.
            </div>
          ) : (
            plans.map((plan) => {
              const isComingSoonPlan = plan.code === "field_gold_monthly";
              const isSelected = plan.is_current && !isComingSoonPlan;
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    if (!isComingSoonPlan) {
                      dispatch(setSelectedPlanCode(plan.code));
                    }
                  }}
                  className={cn(
                    "relative rounded-2xl p-5 transition-all duration-200",
                    isSelected
                      ? "border-2 border-transparent bg-[linear-gradient(#0b0b0f,#0b0b0f)_padding-box,linear-gradient(135deg,#cdba20,#C00069)_border-box] shadow-[0_0_24px_rgba(205,186,32,0.35)]"
                      : "border border-[#2C2740]",
                    isComingSoonPlan
                      ? "opacity-80 cursor-not-allowed"
                      : "cursor-pointer",
                    "bg-[#0b0b0f]",
                  )}
                >
                  {/* Popular badge */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <Button className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 border border-emerald-500/30">
                        Current Plan
                      </Button>
                    </div>
                  )}

                  {isComingSoonPlan && (
                    <div className="absolute top-4 right-4">
                      <Button className="bg-[#cdba20]/15 text-[#cdba20] text-xs font-semibold px-3 py-1 border border-[#cdba20]/40">
                        Coming Soon
                      </Button>
                    </div>
                  )}

                  {/* Plan name + avatars */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white font-semibold text-sm">
                      {plan.name}
                    </span>
                  </div>

                  {isComingSoonPlan ? (
                    <div className="flex items-center justify-center h-36 md:min-h-80 text-[#cdba20] text-sm font-semibold tracking-wide">
                      Coming Soon
                    </div>
                  ) : (
                    <>
                      {/* Price */}
                      <div className="mb-1">
                        <span className="text-white text-4xl font-bold">
                          {plan.currency} {plan.price}
                        </span>
                        <span className="text-[#9a98b8] text-sm ml-1">
                          / {plan.billing_cycle}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[#cdba20] text-xs mb-4">
                        {plan.description}
                      </p>

                      {/* Button */}
                      <button
                        className={cn(
                          "w-full cur-pointer py-2.5 rounded-xl text-sm font-semibold transition-all mb-5",
                          plan.is_current
                            ? "bg-transparent border border-emerald-500/30 text-emerald-400 cursor-default"
                            : plan.code.includes("silver")
                              ? "bg-linear-to-r from-[#980009] via-[#C00069] to-[#980009] text-white shadow-[0_0_12px_rgba(192,0,105,0.4)] hover:opacity-90"
                              : "bg-transparent border border-[#525273] text-white hover:border-white",
                        )}
                        disabled={plan.is_current || isUpgrading}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpgrade(plan.code);
                        }}
                      >
                        {isUpgrading ? "Redirecting..." : plan.button_text}
                      </button>

                      {/* Features */}
                      <div>
                        <p className="text-white font-semibold text-sm mb-3">
                          Included Features:
                        </p>
                        <ul className="space-y-2">
                          {(PLAN_FEATURES[plan.code] ?? []).map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-xs text-[#d1cfe8]"
                            >
                              <Check
                                size={14}
                                className="text-[#980009] shrink-0"
                                strokeWidth={3}
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
