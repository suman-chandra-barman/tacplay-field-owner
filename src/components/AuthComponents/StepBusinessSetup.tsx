/** @format */

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type MatchRulesStepForm = {
  minimum_players_per_team: string;
  maximum_players_per_team: string;
  minimum_players_per_session: string;
  maximum_players_per_session: string;
  default_session_duration: string;
  duration_unit: string;
  base_price_per_player: string;
  allow_social_matches: boolean;
  allow_ranked_matches: boolean;
};

type StepBusinessSetupProps = {
  value: MatchRulesStepForm;
  onChange: (patch: Partial<MatchRulesStepForm>) => void;
};

const StepBusinessSetup = ({ value, onChange }: StepBusinessSetupProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Match Requirements &amp; Capacity
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Adjust minimum players, team format, and session limits to ensure fair
          gameplay and ranked match qualification.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Minimum Players Per Team
            </label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 6"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.minimum_players_per_team}
              onChange={(e) =>
                onChange({ minimum_players_per_team: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Maximum Players Per Team
            </label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 8"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.maximum_players_per_team}
              onChange={(e) =>
                onChange({ maximum_players_per_team: e.target.value })
              }
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
              min={1}
              placeholder="e.g. 16"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.minimum_players_per_session}
              onChange={(e) =>
                onChange({ minimum_players_per_session: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              Maximum Players Per Sessions
            </label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 16"
              className="bg-input/30 border-white/10 text-primary h-11"
              value={value.maximum_players_per_session}
              onChange={(e) =>
                onChange({ maximum_players_per_session: e.target.value })
              }
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
              min={1}
              placeholder="e.g. 50"
              className="bg-input/30 border-white/10 text-primary h-11 flex-1"
              value={value.default_session_duration}
              onChange={(e) =>
                onChange({ default_session_duration: e.target.value })
              }
            />
            <Select
              value={value.duration_unit}
              onValueChange={(v) => onChange({ duration_unit: v })}
            >
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
            placeholder="0.00"
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.base_price_per_player}
            onChange={(e) =>
              onChange({ base_price_per_player: e.target.value })
            }
          />
        </div>

        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <label className="text-sm font-medium text-primary">
            Allow Social Matches
          </label>
          <div className="flex items-center gap-3">
            <Switch
              className="data-[state=checked]:bg-custom-yellow"
              checked={value.allow_social_matches}
              onCheckedChange={(v) => onChange({ allow_social_matches: v })}
            />
            <span className="text-sm text-muted-foreground">
              {value.allow_social_matches ? "On" : "Off"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-white/5">
          <label className="text-sm font-medium text-primary">
            Allow Ranked Matches
          </label>
          <div className="flex items-center gap-3">
            <Switch
              className="data-[state=checked]:bg-custom-yellow"
              checked={value.allow_ranked_matches}
              onCheckedChange={(v) => onChange({ allow_ranked_matches: v })}
            />
            <span className="text-sm text-muted-foreground">
              {value.allow_ranked_matches ? "On" : "Off"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepBusinessSetup;
