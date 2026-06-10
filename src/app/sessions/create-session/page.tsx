/** @format */

"use client";

import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Upload,
  Clock,
  Clock3,
  CheckCircle2,
  FileImage,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { useCreateOwnerSessionMutation } from "@/redux/features/sessions/sessionsAPI";
import { useTranslation } from "react-i18next";

type SessionType = "teams" | "manual_player";

type CreateSessionForm = {
  session_name: string;
  match_type: "ranked" | "social";
  session_visibility: "premium" | "public" | "private";
  description: string;
  match_date: string;
  start_time: string;
  end_time: string;
  booking_cut_off_time: string;
  booking_cut_off_unit: "hours" | "minutes" | "days";
  team_a_player: string;
  team_b_player: string;
  session_type: SessionType;
  team_a_name: string;
  team_b_name: string;
  entry_fee: string;
};

const DEFAULT_FORM: CreateSessionForm = {
  session_name: "",
  match_type: "ranked",
  session_visibility: "premium",
  description: "",
  match_date: "",
  start_time: "",
  end_time: "",
  booking_cut_off_time: "12",
  booking_cut_off_unit: "hours",
  team_a_player: "",
  team_b_player: "",
  session_type: "teams",
  team_a_name: "",
  team_b_name: "",
  entry_fee: "",
};

const isValidTime = (value: string) =>
  /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const convertToMinutes = (time: string) => {
  if (!isValidTime(time)) return null;

  const [hourString, minuteString] = time.split(":");
  const hour = Number(hourString);
  const minute = Number(minuteString);
  const normalizedHour = hour % 24;

  return normalizedHour * 60 + minute;
};

const to12HourTimeWithPeriod = (time: string) => {
  if (!isValidTime(time)) {
    return {
      time: "",
      period: "AM" as const,
    };
  }

  const [hourString, minuteString] = time.split(":");
  const hour24 = Number(hourString);
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {
    time: `${String(hour12).padStart(2, "0")}:${minuteString}`,
    period,
  };
};

const CreateSessionPage = () => {
  const router = useRouter();
  const { t } = useTranslation("dashboard");

  const selectOptions = useMemo(
    () =>
      ({
        matchType: [
          { label: t("sessions.create.options.ranked"), value: "ranked" },
          { label: t("sessions.create.options.social"), value: "social" },
        ],
        sessionVisibility: [
          { label: t("sessions.create.options.premium"), value: "premium" },
          { label: t("sessions.create.options.public"), value: "public" },
          { label: t("sessions.create.options.private"), value: "private" },
        ],
        bookingCutOffUnit: [
          { label: t("sessions.create.options.hours"), value: "hours" },
          { label: t("sessions.create.options.minutes"), value: "minutes" },
          { label: t("sessions.create.options.days"), value: "days" },
        ],
        sessionType: [
          { label: t("sessions.create.options.team"), value: "teams" },
          {
            label: t("sessions.create.options.individualPlayer"),
            value: "manual_player",
          },
        ],
      }) as const,
    [t],
  );

  const [createOwnerSession, { isLoading: isCreating }] =
    useCreateOwnerSessionMutation();

  const [form, setForm] = useState<CreateSessionForm>(DEFAULT_FORM);

  const [sessionTypeOpen, setSessionTypeOpen] = useState(false);
  const [matchTypeOpen, setMatchTypeOpen] = useState(false);
  const [visibilityOpen, setVisibilityOpen] = useState(false);
  const [cutOffUnitOpen, setCutOffUnitOpen] = useState(false);

  const [teamALogo, setTeamALogo] = useState<File | null>(null);
  const [teamBLogo, setTeamBLogo] = useState<File | null>(null);

  const teamARef = useRef<HTMLInputElement>(null);
  const teamBRef = useRef<HTMLInputElement>(null);
  const matchDateRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endTimeRef = useRef<HTMLInputElement>(null);

  const openNativePicker = (
    inputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    const input = inputRef.current;
    if (!input) return;

    const pickerInput = input as HTMLInputElement & {
      showPicker?: () => void;
    };

    if (typeof pickerInput.showPicker === "function") {
      pickerInput.showPicker();
      return;
    }

    input.focus();
    input.click();
  };

  const durationDisplay = useMemo(() => {
    const start = convertToMinutes(form.start_time);
    const end = convertToMinutes(form.end_time);

    if (start === null || end === null) return t("sessions.create.autoCount");

    const resolvedEnd = end <= start ? end + 24 * 60 : end;
    const durationMinutes = resolvedEnd - start;

    return durationMinutes > 0
      ? `${durationMinutes} ${t("sessions.create.min")}`
      : t("sessions.create.autoCount");
  }, [form.end_time, form.start_time, t]);

  const handleFieldChange = <T extends keyof CreateSessionForm>(
    key: T,
    value: CreateSessionForm[T],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleTeamAUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setTeamALogo(file);
  };

  const handleTeamBUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setTeamBLogo(file);
  };

  const validateForm = () => {
    if (!form.session_name.trim()) {
      return t("sessions.create.validation.sessionNameRequired");
    }
    if (!form.description.trim()) {
      return t("sessions.create.validation.descriptionRequired");
    }
    if (!form.match_date) {
      return t("sessions.create.validation.matchDateRequired");
    }

    if (!isValidTime(form.start_time)) {
      return t("sessions.create.validation.startTimeFormat");
    }

    if (!isValidTime(form.end_time)) {
      return t("sessions.create.validation.endTimeFormat");
    }

    const start = convertToMinutes(form.start_time);
    const end = convertToMinutes(form.end_time);
    if (start === null || end === null) {
      return t("sessions.create.validation.invalidTimes");
    }

    const resolvedEnd = end <= start ? end + 24 * 60 : end;
    if (resolvedEnd - start <= 0) {
      return t("sessions.create.validation.endTimeAfterStart");
    }

    const cutOff = Number(form.booking_cut_off_time);
    if (!Number.isInteger(cutOff) || cutOff <= 0) {
      return t("sessions.create.validation.cutOffPositive");
    }

    const teamAPlayers = Number(form.team_a_player);
    const teamBPlayers = Number(form.team_b_player);
    if (!Number.isInteger(teamAPlayers) || teamAPlayers <= 0) {
      return t("sessions.create.validation.teamAPlayersPositive");
    }
    if (!Number.isInteger(teamBPlayers) || teamBPlayers <= 0) {
      return t("sessions.create.validation.teamBPlayersPositive");
    }

    const entryFee = Number(form.entry_fee);
    if (Number.isNaN(entryFee) || entryFee < 0) {
      return t("sessions.create.validation.entryFeePositive");
    }

    if (form.session_type === "manual_player") {
      if (!form.team_a_name.trim()) {
        return t("sessions.create.validation.teamANameRequired");
      }
      if (!form.team_b_name.trim()) {
        return t("sessions.create.validation.teamBNameRequired");
      }
      if (!teamALogo) {
        return t("sessions.create.validation.teamALogoRequired");
      }
      if (!teamBLogo) {
        return t("sessions.create.validation.teamBLogoRequired");
      }
    }

    return null;
  };

  const buildPayload = () => {
    const payload = new FormData();

    payload.append("session_name", form.session_name.trim());
    payload.append("match_type", form.match_type);
    payload.append("session_visibility", form.session_visibility);
    payload.append("description", form.description.trim());
    payload.append("match_date", form.match_date);
    const start12 = to12HourTimeWithPeriod(form.start_time);
    const end12 = to12HourTimeWithPeriod(form.end_time);
    payload.append("start_time", start12.time);
    payload.append("start_time_period", start12.period);
    payload.append("end_time", end12.time);
    payload.append("end_time_period", end12.period);
    payload.append("booking_cut_off_time", form.booking_cut_off_time);
    payload.append("booking_cut_off_unit", form.booking_cut_off_unit);
    payload.append("team_a_player", form.team_a_player);
    payload.append("team_b_player", form.team_b_player);
    payload.append("session_type", form.session_type);
    payload.append("entry_fee", form.entry_fee);

    if (form.session_type === "manual_player") {
      payload.append("team_a_name", form.team_a_name.trim());
      payload.append("team_b_name", form.team_b_name.trim());

      if (teamALogo) payload.append("team_a_logo", teamALogo);
      if (teamBLogo) payload.append("team_b_logo", teamBLogo);
    }

    return payload;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const response = await createOwnerSession(buildPayload()).unwrap();
      toast.success(
        getSuccessMessage(response, t("sessions.create.messages.success")),
      );
      router.push("/sessions");
    } catch (error) {
      toast.error(getErrorMessage(error, t("sessions.create.messages.failed")));
    }
  };

  return (
    <div className="w-full p-3 md:p-4">
      <div className="max-w-625 mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href="/sessions">
              <button className="cursor-pointer p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-primary" />
              </button>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              {t("sessions.create.title")}
            </h1>
          </div>
          <p className="text-sm text-secondary ml-10">
            {t("sessions.create.subtitle")}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* ── Session Details ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              {t("sessions.create.sessionDetails")}
            </h2>

            {/* Session Name */}
            <FormField label={t("sessions.create.sessionName")}>
              <input
                type="text"
                placeholder={t("sessions.create.enterSessionName")}
                className="form-input-style"
                value={form.session_name}
                onChange={(event) =>
                  handleFieldChange("session_name", event.target.value)
                }
              />
            </FormField>

            {/* Match Type */}
            <FormField label={t("sessions.create.matchType")}>
              <CustomSelect
                placeholder={t("sessions.create.selectMatchType")}
                options={selectOptions.matchType}
                value={form.match_type}
                open={matchTypeOpen}
                onToggle={() => setMatchTypeOpen(!matchTypeOpen)}
                onSelect={(value) => {
                  handleFieldChange(
                    "match_type",
                    value as CreateSessionForm["match_type"],
                  );
                  setMatchTypeOpen(false);
                }}
              />
            </FormField>

            {/* Session Visibility */}
            <FormField label={t("sessions.create.sessionVisibility")}>
              <CustomSelect
                placeholder={t("sessions.create.selectVisibility")}
                options={selectOptions.sessionVisibility}
                value={form.session_visibility}
                open={visibilityOpen}
                onToggle={() => setVisibilityOpen(!visibilityOpen)}
                onSelect={(value) => {
                  handleFieldChange(
                    "session_visibility",
                    value as CreateSessionForm["session_visibility"],
                  );
                  setVisibilityOpen(false);
                }}
              />
            </FormField>

            {/* Description */}
            <FormField label={t("sessions.create.description")}>
              <textarea
                rows={4}
                placeholder={t("sessions.create.enterDescription")}
                className="form-input-style resize-none min-h-24"
                value={form.description}
                onChange={(event) =>
                  handleFieldChange("description", event.target.value)
                }
              />
            </FormField>
          </section>

          {/* ── Date & Time Configuration ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              {t("sessions.create.dateTimeConfig")}
            </h2>

            {/* Match Date */}
            <FormField label={t("sessions.create.matchDate")}>
              <div className="relative">
                <input
                  ref={matchDateRef}
                  type="date"
                  className="form-input-style pr-10"
                  value={form.match_date}
                  onChange={(event) =>
                    handleFieldChange("match_date", event.target.value)
                  }
                />
                <button
                  type="button"
                  aria-label={t("sessions.create.openDatePicker")}
                  onClick={() => openNativePicker(matchDateRef)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </FormField>

            {/* Start & End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={t("sessions.create.startTime")}>
                <div className="relative">
                  <input
                    ref={startTimeRef}
                    type="time"
                    step={60}
                    className="form-input-style pr-10"
                    value={form.start_time}
                    onChange={(event) =>
                      handleFieldChange("start_time", event.target.value)
                    }
                  />
                  <button
                    type="button"
                    aria-label={t("sessions.create.openStartTimePicker")}
                    onClick={() => openNativePicker(startTimeRef)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    <Clock3 className="w-4 h-4" />
                  </button>
                </div>
              </FormField>
              <FormField label={t("sessions.create.endTime")}>
                <div className="relative">
                  <input
                    ref={endTimeRef}
                    type="time"
                    step={60}
                    className="form-input-style pr-10"
                    value={form.end_time}
                    onChange={(event) =>
                      handleFieldChange("end_time", event.target.value)
                    }
                  />
                  <button
                    type="button"
                    aria-label={t("sessions.create.openEndTimePicker")}
                    onClick={() => openNativePicker(endTimeRef)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    <Clock3 className="w-4 h-4" />
                  </button>
                </div>
              </FormField>
            </div>

            {/* Duration */}
            <FormField label={t("sessions.create.duration")}>
              <div className="relative">
                <input
                  type="text"
                  value={durationDisplay}
                  className="form-input-style pr-10"
                  readOnly
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
              </div>
            </FormField>

            {/* Booking Cut-Off Time */}
            <FormField label={t("sessions.create.bookingCutOffTime")}>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder={t("sessions.create.enterCutOffValue")}
                  className="form-input-style flex-1"
                  value={form.booking_cut_off_time}
                  onChange={(event) =>
                    handleFieldChange(
                      "booking_cut_off_time",
                      event.target.value,
                    )
                  }
                />
                <CustomSelect
                  placeholder={t("sessions.create.unit")}
                  options={selectOptions.bookingCutOffUnit}
                  value={form.booking_cut_off_unit}
                  open={cutOffUnitOpen}
                  onToggle={() => setCutOffUnitOpen(!cutOffUnitOpen)}
                  onSelect={(val) => {
                    handleFieldChange(
                      "booking_cut_off_unit",
                      val as CreateSessionForm["booking_cut_off_unit"],
                    );
                    setCutOffUnitOpen(false);
                  }}
                  className="w-28"
                />
              </div>
            </FormField>
          </section>

          {/* ── Teams & Capacity ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              {t("sessions.create.teamsCapacity")}
            </h2>

            {/* Team A & B Player count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label={t("sessions.create.teamAPlayer")}>
                <input
                  type="number"
                  min={1}
                  placeholder={t("sessions.create.enterTeamAPlayers")}
                  className="form-input-style"
                  value={form.team_a_player}
                  onChange={(event) =>
                    handleFieldChange("team_a_player", event.target.value)
                  }
                />
              </FormField>
              <FormField label={t("sessions.create.teamBPlayer")}>
                <input
                  type="number"
                  min={1}
                  placeholder={t("sessions.create.enterTeamBPlayers")}
                  className="form-input-style"
                  value={form.team_b_player}
                  onChange={(event) =>
                    handleFieldChange("team_b_player", event.target.value)
                  }
                />
              </FormField>
            </div>

            {/* Session Type */}
            <FormField label={t("sessions.create.sessionType")}>
              <CustomSelect
                placeholder={t("sessions.create.selectTeamMode")}
                options={selectOptions.sessionType}
                value={form.session_type}
                open={sessionTypeOpen}
                onToggle={() => setSessionTypeOpen(!sessionTypeOpen)}
                onSelect={(val) => {
                  handleFieldChange(
                    "session_type",
                    val as CreateSessionForm["session_type"],
                  );
                  setSessionTypeOpen(false);
                }}
              />
            </FormField>

            {/* Conditional Team Fields - only when "Team" is selected */}
            {form.session_type === "manual_player" && (
              <>
                {/* Team Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label={t("sessions.create.teamAName")}>
                    <input
                      type="text"
                      placeholder={t("sessions.create.enterTeamAName")}
                      className="form-input-style"
                      value={form.team_a_name}
                      onChange={(event) =>
                        handleFieldChange("team_a_name", event.target.value)
                      }
                    />
                  </FormField>
                  <FormField label={t("sessions.create.teamBName")}>
                    <input
                      type="text"
                      placeholder={t("sessions.create.enterTeamBName")}
                      className="form-input-style"
                      value={form.team_b_name}
                      onChange={(event) =>
                        handleFieldChange("team_b_name", event.target.value)
                      }
                    />
                  </FormField>
                </div>

                {/* Team Logos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team A Logo */}
                  <FormField label={t("sessions.create.teamALogo")}>
                    <div className="space-y-3">
                      <div
                        onClick={() => teamARef.current?.click()}
                        className="border border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-white/20 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-secondary" />
                        <p className="text-xs text-secondary text-center">
                          {t("sessions.create.uploadInstructions")}
                        </p>
                        <p className="text-[10px] text-secondary/60 text-center">
                          {t("sessions.create.uploadLimit")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => teamARef.current?.click()}
                        className="px-4 py-1.5 text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-600/30 transition-colors"
                      >
                        {t("sessions.create.uploadLogo")}
                      </button>
                      <input
                        type="file"
                        ref={teamARef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleTeamAUpload}
                      />
                      {teamALogo && (
                        <FileUploadStatus
                          fileName={teamALogo.name}
                          size={teamALogo.size}
                          t={t}
                        />
                      )}
                    </div>
                  </FormField>

                  {/* Team B Logo */}
                  <FormField label={t("sessions.create.teamBLogo")}>
                    <div className="space-y-3">
                      <div
                        onClick={() => teamBRef.current?.click()}
                        className="border border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-white/20 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-secondary" />
                        <p className="text-xs text-secondary text-center">
                          {t("sessions.create.uploadInstructions")}
                        </p>
                        <p className="text-[10px] text-secondary/60 text-center">
                          {t("sessions.create.uploadLimit")}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => teamBRef.current?.click()}
                        className="px-4 py-1.5 text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-600/30 transition-colors"
                      >
                        {t("sessions.create.uploadLogo")}
                      </button>
                      <input
                        type="file"
                        ref={teamBRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleTeamBUpload}
                      />
                      {teamBLogo && (
                        <FileUploadStatus
                          fileName={teamBLogo.name}
                          size={teamBLogo.size}
                          t={t}
                        />
                      )}
                    </div>
                  </FormField>
                </div>
              </>
            )}
          </section>

          {/* ── Pricing & Payment ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              {t("sessions.create.pricingPayment")}
            </h2>

            <FormField label={t("sessions.create.entryFee")}>
              <input
                type="number"
                min={0}
                placeholder={t("sessions.create.enterEntryFee")}
                className="form-input-style"
                value={form.entry_fee}
                onChange={(event) =>
                  handleFieldChange("entry_fee", event.target.value)
                }
              />
            </FormField>
          </section>

          {/* ── Action Buttons ── */}
          <div className="flex items-center justify-center gap-4 pt-4 pb-8">
            <Link href="/sessions">
              <Button
                type="button"
                className="cursor-pointer bg-transparent px-10 py-2.5 rounded-lg border border-white/10 text-primary text-sm font-medium hover:bg-white/5 transition-colors"
              >
                {t("sessions.create.cancel")}
              </Button>
            </Link>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? t("sessions.create.creating") : t("sessions.create.createSession")}
            </Button>
          </div>
        </form>
      </div>

      {/* Styles for form inputs */}
      <style jsx>{`
        .form-input-style {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.875rem;
          color: var(--primary);
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input-style::placeholder {
          color: var(--secondary);
          opacity: 0.6;
        }
        .form-input-style:focus {
          border-color: rgba(152, 0, 9, 0.5);
        }
        .form-input-style[type="date"],
        .form-input-style[type="time"] {
          color-scheme: dark;
        }
        .form-input-style[type="date"]::-webkit-calendar-picker-indicator,
        .form-input-style[type="time"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

/* ── Reusable Sub-components ── */

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-sm text-primary font-medium">{label}</label>
    {children}
  </div>
);

const CustomSelect = ({
  placeholder,
  options,
  value,
  open,
  onToggle,
  onSelect,
  className = "",
}: {
  placeholder: string;
  options: readonly { label: string; value: string }[];
  value: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
  className?: string;
}) => {
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? "";

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-transparent border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-left outline-none hover:border-white/20 transition-colors"
      >
        <span className={selectedLabel ? "text-primary" : "text-secondary/60"}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-secondary transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-white/10 rounded-lg shadow-xl overflow-hidden">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onSelect(option.value)}
              className="w-full px-3.5 py-2 text-sm text-primary/80 hover:bg-muted/50 text-left transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FileUploadStatus = ({
  fileName,
  size,
  t,
}: {
  fileName: string;
  size: number;
  t: (key: string) => string;
}) => {
  const sizeKB = (size / 1024).toFixed(1);
  const sizeMB = (size / (1024 * 1024)).toFixed(2);

  return (
    <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2">
      <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center shrink-0">
        <FileImage className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-primary truncate">{fileName}</p>
        <p className="text-[10px] text-secondary">
          {Number(sizeMB) > 1 ? `${sizeMB} MB` : `${sizeKB} KB`}
        </p>
      </div>
      <div className="flex items-center gap-1 text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span className="text-[10px]">{t("sessions.create.uploadComplete")}</span>
      </div>
    </div>
  );
};

export default CreateSessionPage;
