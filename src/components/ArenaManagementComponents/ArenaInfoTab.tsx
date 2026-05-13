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
import {
  getDataCitysByCountry,
  getDataCountrys,
  type cityProps,
  type countryProps,
} from "country-state-city-nextjs";
import {
  useEditArenaInfoMutation,
  useGetArenaInfoQuery,
} from "@/redux/features/arenaManagement/arenaManagementAPI";
import { getErrorMessage, getSuccessMessage } from "@/lib/auth";
import { toast } from "react-toastify";

type ArenaInfoForm = {
  field_name: string;
  description: string;
  country: string;
  city: string;
  full_address: string;
};

const ArenaInfoTab = () => {
  const { data, isLoading, isFetching, isError } = useGetArenaInfoQuery();
  const [editArenaInfo, { isLoading: isSaving }] = useEditArenaInfoMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<ArenaInfoForm | null>(null);

  const [countries, setCountries] = useState<countryProps[]>([]);
  const [cities, setCities] = useState<cityProps[]>([]);

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

  const normalizedCountries = useMemo(() => {
    if (!form.country) return countries;
    const hasCurrent = countries.some(
      (country) => country.text === form.country,
    );
    if (hasCurrent) return countries;

    return [
      ...countries,
      {
        id: -1,
        text: form.country,
        code: "",
      },
    ];
  }, [countries, form.country]);

  const normalizedCities = useMemo(() => {
    if (!form.city) return cities;
    const hasCurrent = cities.some((city) => city.text === form.city);
    if (hasCurrent) return cities;

    return [
      ...cities,
      {
        id: -1,
        text: form.city,
        id_state: -1,
        id_country: -1,
      },
    ];
  }, [cities, form.city]);

  useEffect(() => {
    let active = true;

    const loadCountries = async () => {
      const data = (await getDataCountrys()) as countryProps[];
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

    const loadCities = async () => {
      const selectedCountry = countries.find(
        (item) => item.text === form.country,
      );
      if (!selectedCountry) {
        setCities([]);
        return;
      }

      const data = (await getDataCitysByCountry({
        id: selectedCountry.id,
        text: selectedCountry.text,
      })) as cityProps[];

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
        getSuccessMessage(response, "Arena info updated successfully."),
      );

      setDraft(null);
      setIsEditing(false);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update arena info."));
      // Keep edit mode open so user can retry.
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="py-10 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
        Loading arena info...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-sm text-destructive">
        Failed to load arena info.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-primary">
            Tell Us About Your Field
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            This information will be visible to players when they browse and
            book sessions at your arena.
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
            Field / Arena Name
          </label>
          <Input
            placeholder="Enter arena name"
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
            Description
          </label>
          <Textarea
            placeholder="Describe your arena..."
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
            <label className="text-sm font-medium text-primary">Country</label>
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
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {normalizedCountries.map((country) => (
                  <SelectItem key={country.id} value={country.text}>
                    {country.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">City</label>
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
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {normalizedCities.map((city) => (
                  <SelectItem key={city.id} value={city.text}>
                    {city.text}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Full Address
          </label>
          <Input
            placeholder="Enter your full address"
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
