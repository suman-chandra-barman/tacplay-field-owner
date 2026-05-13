/** @format */

"use client";

import React, { useMemo, useState } from "react";
import { Loader2, Pen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEditFieldSetupMutation,
  useGetFieldSetupQuery,
} from "@/redux/features/arenaManagement/arenaManagementAPI";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { toast } from "react-toastify";

type FieldSetupForm = {
  minimum_players_per_team: number;
  maximum_players_per_team: number;
  minimum_players_per_session: number;
  maximum_players_per_session: number;
  default_session_duration: number;
  duration_unit: string;
  base_price_per_player: string;
  allow_social_matches: boolean;
  allow_ranked_matches: boolean;
};

const FieldSetupTab = () => {
  const { data, isLoading, isFetching, isError } = useGetFieldSetupQuery();
  const [editFieldSetup, { isLoading: isSaving }] = useEditFieldSetupMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<FieldSetupForm | null>(null);

  const baseForm = useMemo<FieldSetupForm>(
    () => ({
      minimum_players_per_team: data?.data.minimum_players_per_team ?? 0,
      maximum_players_per_team: data?.data.maximum_players_per_team ?? 0,
      minimum_players_per_session: data?.data.minimum_players_per_session ?? 0,
      maximum_players_per_session: data?.data.maximum_players_per_session ?? 0,
      default_session_duration: data?.data.default_session_duration ?? 0,
      duration_unit: data?.data.duration_unit ?? "minute",
      base_price_per_player: data?.data.base_price_per_player ?? "",
      allow_social_matches: data?.data.allow_social_matches ?? false,
      allow_ranked_matches: data?.data.allow_ranked_matches ?? false,
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
      const response = await editFieldSetup({
        minimum_players_per_team: draft.minimum_players_per_team,
        maximum_players_per_team: draft.maximum_players_per_team,
        minimum_players_per_session: draft.minimum_players_per_session,
        maximum_players_per_session: draft.maximum_players_per_session,
        default_session_duration: draft.default_session_duration,
        base_price_per_player: draft.base_price_per_player,
        allow_social_matches: draft.allow_social_matches,
        allow_ranked_matches: draft.allow_ranked_matches,
      }).unwrap();

      toast.success(
        getSuccessMessage(response, "Field setup updated successfully."),
      );

      setDraft(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update field setup."));
      // Keep edit mode open so user can retry.
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading field setup...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-sm text-destructive">
        Failed to load field setup.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Match Requirements &amp; Capacity
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Adjust minimum players, team format, and session limits to ensure
            fair gameplay and ranked match qualification.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Minimum Players Per Team
            </label>
            <Input
              type="number"
              value={form.minimum_players_per_team}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        minimum_players_per_team: Number(event.target.value),
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
              Maximum Players Per Team
            </label>
            <Input
              type="number"
              value={form.maximum_players_per_team}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        maximum_players_per_team: Number(event.target.value),
                      }
                    : previous,
                )
              }
              readOnly={!isEditing}
              className="bg-input/30 border-white/10 text-primary h-11"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Minimum Players Per Sessions
            </label>
            <Input
              type="number"
              value={form.minimum_players_per_session}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        minimum_players_per_session: Number(event.target.value),
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
              Maximum Players Per Sessions
            </label>
            <Input
              type="number"
              value={form.maximum_players_per_session}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        maximum_players_per_session: Number(event.target.value),
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
            Default Session Duration
          </label>
          <div className="flex gap-3">
            <Input
              type="number"
              value={form.default_session_duration}
              onChange={(event) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        default_session_duration: Number(event.target.value),
                      }
                    : previous,
                )
              }
              readOnly={!isEditing}
              className="bg-input/30 border-white/10 text-primary h-11 flex-1"
            />
            <Select value={form.duration_unit} disabled>
              <SelectTrigger className="w-28 bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="minute">Minute</SelectItem>
                <SelectItem value="hour">Hour</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Base Price Per Player
          </label>
          <Input
            value={form.base_price_per_player}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      base_price_per_player: event.target.value,
                    }
                  : previous,
              )
            }
            readOnly={!isEditing}
            className="bg-input/30 border-white/10 text-primary h-11"
          />
        </div>

        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <label className="text-sm font-medium text-primary">
            Allow Social Matches
          </label>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.allow_social_matches}
              onCheckedChange={(checked) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        allow_social_matches: checked,
                      }
                    : previous,
                )
              }
              disabled={!isEditing}
              className="data-[state=checked]:bg-custom-yellow"
            />
            <span className="text-sm text-muted-foreground">
              {form.allow_social_matches ? "On" : "Off"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <label className="text-sm font-medium text-primary">
            Allow Ranked Matches
          </label>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.allow_ranked_matches}
              onCheckedChange={(checked) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        allow_ranked_matches: checked,
                      }
                    : previous,
                )
              }
              disabled={!isEditing}
              className="data-[state=checked]:bg-custom-yellow"
            />
            <span className="text-sm text-muted-foreground">
              {form.allow_ranked_matches ? "On" : "Off"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldSetupTab;
