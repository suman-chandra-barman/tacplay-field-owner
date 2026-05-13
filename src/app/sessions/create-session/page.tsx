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
  booking_cut_off_time: "",
  booking_cut_off_unit: "hours",
  team_a_player: "",
  team_b_player: "",
  session_type: "teams",
  team_a_name: "",
  team_b_name: "",
  entry_fee: "",
};

const SELECT_OPTIONS = {
  matchType: [
    { label: "Ranked", value: "ranked" },
    { label: "Social", value: "social" },
  ],
  sessionVisibility: [
    { label: "Premium", value: "premium" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
  ],
  bookingCutOffUnit: [
    { label: "Hours", value: "hours" },
    { label: "Minutes", value: "minutes" },
    { label: "Days", value: "days" },
  ],
  sessionType: [
    { label: "Team", value: "teams" },
    { label: "Individual Player", value: "manual_player" },
  ],
} as const;

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

    if (start === null || end === null) return "Auto count";

    const resolvedEnd = end <= start ? end + 24 * 60 : end;
    const durationMinutes = resolvedEnd - start;

    return durationMinutes > 0 ? `${durationMinutes} min` : "Auto count";
  }, [form.end_time, form.start_time]);

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
    if (!form.session_name.trim()) return "Session name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.match_date) return "Match date is required.";

    if (!isValidTime(form.start_time)) {
      return "Start time must be in HH:MM format (24-hour).";
    }

    if (!isValidTime(form.end_time)) {
      return "End time must be in HH:MM format (24-hour).";
    }

    const start = convertToMinutes(form.start_time);
    const end = convertToMinutes(form.end_time);
    if (start === null || end === null) {
      return "Invalid start or end time.";
    }

    const resolvedEnd = end <= start ? end + 24 * 60 : end;
    if (resolvedEnd - start <= 0) {
      return "End time must be after start time.";
    }

    const cutOff = Number(form.booking_cut_off_time);
    if (!Number.isInteger(cutOff) || cutOff <= 0) {
      return "Booking cut-off time must be a positive whole number.";
    }

    const teamAPlayers = Number(form.team_a_player);
    const teamBPlayers = Number(form.team_b_player);
    if (!Number.isInteger(teamAPlayers) || teamAPlayers <= 0) {
      return "Team A player count must be a positive whole number.";
    }
    if (!Number.isInteger(teamBPlayers) || teamBPlayers <= 0) {
      return "Team B player count must be a positive whole number.";
    }

    const entryFee = Number(form.entry_fee);
    if (Number.isNaN(entryFee) || entryFee < 0) {
      return "Entry fee must be a valid positive number or zero.";
    }

    if (form.session_type === "manual_player") {
      if (!form.team_a_name.trim()) return "Team A name is required.";
      if (!form.team_b_name.trim()) return "Team B name is required.";
      if (!teamALogo) return "Team A logo is required for Manual Player mode.";
      if (!teamBLogo) return "Team B logo is required for Manual Player mode.";
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
        getSuccessMessage(response, "Session created successfully."),
      );
      router.push("/sessions");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create session."));
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
              Create New Session
            </h1>
          </div>
          <p className="text-sm text-secondary ml-10">
            Set a new match session with teams, players, pricing and ranking
            rules.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* ── Session Details ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">
              Session Details
            </h2>

            {/* Session Name */}
            <FormField label="Session Name">
              <input
                type="text"
                placeholder="Enter session name"
                className="form-input-style"
                value={form.session_name}
                onChange={(event) =>
                  handleFieldChange("session_name", event.target.value)
                }
              />
            </FormField>

            {/* Match Type */}
            <FormField label="Match Type">
              <CustomSelect
                placeholder="Select match type"
                options={SELECT_OPTIONS.matchType}
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
            <FormField label="Session Visibility">
              <CustomSelect
                placeholder="Select visibility"
                options={SELECT_OPTIONS.sessionVisibility}
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
            <FormField label="Description">
              <textarea
                rows={4}
                placeholder="Enter session description"
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
              Date &amp; Time Configuration
            </h2>

            {/* Match Date */}
            <FormField label="Match Date">
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
                  aria-label="Open date picker"
                  onClick={() => openNativePicker(matchDateRef)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </FormField>

            {/* Start & End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Start Time">
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
                    aria-label="Open start time picker"
                    onClick={() => openNativePicker(startTimeRef)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    <Clock3 className="w-4 h-4" />
                  </button>
                </div>
              </FormField>
              <FormField label="End Time">
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
                    aria-label="Open end time picker"
                    onClick={() => openNativePicker(endTimeRef)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  >
                    <Clock3 className="w-4 h-4" />
                  </button>
                </div>
              </FormField>
            </div>

            {/* Duration */}
            <FormField label="Duration">
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
            <FormField label="Booking Cut-Off Time">
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  placeholder="Enter cut-off value"
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
                  placeholder="Unit"
                  options={SELECT_OPTIONS.bookingCutOffUnit}
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
              Teams &amp; Capacity
            </h2>

            {/* Team A & B Player count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Team A Player">
                <input
                  type="number"
                  min={1}
                  placeholder="Enter Team A players"
                  className="form-input-style"
                  value={form.team_a_player}
                  onChange={(event) =>
                    handleFieldChange("team_a_player", event.target.value)
                  }
                />
              </FormField>
              <FormField label="Team B Player">
                <input
                  type="number"
                  min={1}
                  placeholder="Enter Team B players"
                  className="form-input-style"
                  value={form.team_b_player}
                  onChange={(event) =>
                    handleFieldChange("team_b_player", event.target.value)
                  }
                />
              </FormField>
            </div>

            {/* Session Type */}
            <FormField label="Session Type">
              <CustomSelect
                placeholder="Select team mode"
                options={SELECT_OPTIONS.sessionType}
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
                  <FormField label="Team A Name">
                    <input
                      type="text"
                      placeholder="Enter Team A name"
                      className="form-input-style"
                      value={form.team_a_name}
                      onChange={(event) =>
                        handleFieldChange("team_a_name", event.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="Team B Name">
                    <input
                      type="text"
                      placeholder="Enter Team B name"
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
                  <FormField label="Team A Logo">
                    <div className="space-y-3">
                      <div
                        onClick={() => teamARef.current?.click()}
                        className="border border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-white/20 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-secondary" />
                        <p className="text-xs text-secondary text-center">
                          Choose a file or upload it here.
                        </p>
                        <p className="text-[10px] text-secondary/60 text-center">
                          Pick any format, up to 50 mb in size for uploads.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => teamARef.current?.click()}
                        className="px-4 py-1.5 text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-600/30 transition-colors"
                      >
                        Upload Logo
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
                        />
                      )}
                    </div>
                  </FormField>

                  {/* Team B Logo */}
                  <FormField label="Team B Logo">
                    <div className="space-y-3">
                      <div
                        onClick={() => teamBRef.current?.click()}
                        className="border border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-white/20 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-secondary" />
                        <p className="text-xs text-secondary text-center">
                          Choose a file or upload it here.
                        </p>
                        <p className="text-[10px] text-secondary/60 text-center">
                          Pick any format, up to 50 mb in size for uploads.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => teamBRef.current?.click()}
                        className="px-4 py-1.5 text-xs font-medium bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-md hover:bg-emerald-600/30 transition-colors"
                      >
                        Upload Logo
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
              Pricing &amp; Payment
            </h2>

            <FormField label="Entry Fee">
              <input
                type="number"
                min={0}
                placeholder="Enter entry fee amount"
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
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Session"}
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
}: {
  fileName: string;
  size: number;
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
        <span className="text-[10px]">Complete</span>
      </div>
    </div>
  );
};

export default CreateSessionPage;
