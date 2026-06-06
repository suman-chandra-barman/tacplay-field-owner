/** @format */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Pen, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { City, Country, type ICity, type ICountry } from "country-state-city";
import {
  useEditArenaInfoMutation,
  useGetArenaInfoQuery,
} from "@/redux/features/arenaManagement/arenaManagementAPI";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

type ArenaInfoForm = {
  field_name: string;
  description: string;
  country: string;
  city: string;
  full_address: string;
};

const ArenaInfoTab = () => {
  const { t } = useTranslation("dashboard");
  const { data, isLoading, isFetching, isError } = useGetArenaInfoQuery();
  const [editArenaInfo, { isLoading: isSaving }] = useEditArenaInfoMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ArenaInfoForm | null>(null);

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  const currentArena = data?.data;

  const baseForm = useMemo<ArenaInfoForm>(
    () => ({
      field_name: currentArena?.field_name ?? "",
      description: currentArena?.description ?? "",
      country: currentArena?.country?.name ?? "",
      city: currentArena?.city?.name ?? "",
      full_address: currentArena?.full_address ?? "",
    }),
    [currentArena],
  );

  const form = isEditing ? (draft ?? baseForm) : baseForm;

  const countryOptions = useMemo(() => {
    const options = countries.map((country) => ({
      key: country.isoCode,
      value: country.name,
    }));

    if (!form.country) return options;
    const hasCurrent = options.some(
      (country) => country.value === form.country,
    );
    if (hasCurrent) return options;

    return [
      ...options,
      {
        key: `custom-${form.country}`,
        value: form.country,
      },
    ];
  }, [countries, form.country]);

  const cityOptions = useMemo(() => {
    const options = cities.map((city) => ({
      key: city.name,
      value: city.name,
    }));

    if (!form.city) return options;
    const hasCurrent = options.some((city) => city.value === form.city);
    if (hasCurrent) return options;

    return [
      ...options,
      {
        key: `custom-${form.city}`,
        value: form.city,
      },
    ];
  }, [cities, form.city]);

  useEffect(() => {
    let active = true;

    const loadCountries = () => {
      const data = Country.getAllCountries();
      if (!active) return;
      setCountries(Array.isArray(data) ? data : []);
    };

    loadCountries();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadCities = () => {
      const selectedCountry = countries.find(
        (item) => item.name === form.country,
      );
      if (!selectedCountry) {
        setCities([]);
        return;
      }

      const data = City.getCitiesOfCountry(selectedCountry.isoCode);

      if (!active) return;
      setCities(Array.isArray(data) ? data : []);
    };

    loadCities();

    return () => {
      active = false;
    };
  }, [countries, form.country]);

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
      const response = await editArenaInfo({
        field_name: draft.field_name,
        description: draft.description,
        country: draft.country,
        city: draft.city,
        full_address: draft.full_address,
      }).unwrap();

      toast.success(
        getSuccessMessage(response, t("arena.arenaInfoTab.updated")),
      );

      setDraft(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, t("arena.arenaInfoTab.updateFailed")));
      // Keep edit mode open so user can retry.
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        {t("arena.arenaInfoTab.loading")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-sm text-destructive">
        {t("arena.arenaInfoTab.loadFailed")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            {t("onboardingFields.arena.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("onboardingFields.arena.subtitle")}
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
            {t("onboardingFields.arena.nameLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.arena.namePlaceholder")}
            value={form.field_name}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      field_name: event.target.value,
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
            {t("onboardingFields.arena.descLabel")}
          </label>
          <Textarea
            placeholder={t("onboardingFields.arena.descPlaceholder")}
            value={form.description}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      description: event.target.value,
                    }
                  : previous,
              )
            }
            readOnly={!isEditing}
            className="bg-input/30 border-white/10 text-primary min-h-25"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.arena.countryLabel")}
            </label>
            <Select
              value={form.country}
              onValueChange={(value) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        country: value,
                        city: "",
                      }
                    : previous,
                )
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder={t("onboardingFields.arena.countryPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {countryOptions.map((country) => (
                  <SelectItem key={country.key} value={country.value}>
                    {country.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.arena.cityLabel")}
            </label>
            <Select
              value={form.city}
              onValueChange={(value) =>
                setDraft((previous) =>
                  previous
                    ? {
                        ...previous,
                        city: value,
                      }
                    : previous,
                )
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder={t("onboardingFields.arena.cityPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {cityOptions.map((city) => (
                  <SelectItem key={city.key} value={city.value}>
                    {city.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.arena.addressLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.arena.addressPlaceholder")}
            value={form.full_address}
            onChange={(event) =>
              setDraft((previous) =>
                previous
                  ? {
                      ...previous,
                      full_address: event.target.value,
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
  );
};

export default ArenaInfoTab;
