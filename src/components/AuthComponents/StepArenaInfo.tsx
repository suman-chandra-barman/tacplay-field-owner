/** @format */

"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import {
  getDataCitysByCountry,
  getDataCountrys,
  type cityProps,
  type countryProps,
} from "country-state-city-nextjs";

export type ArenaStepForm = {
  field_name: string;
  description: string;
  country: string;
  city: string;
  full_address: string;
  image: File | null;
};

type StepArenaInfoProps = {
  value: ArenaStepForm;
  onChange: (patch: Partial<ArenaStepForm>) => void;
};

const StepArenaInfo = ({ value, onChange }: StepArenaInfoProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [countries, setCountries] = useState<countryProps[]>([]);
  const [cities, setCities] = useState<cityProps[]>([]);

  const imagePreviewUrl = useMemo(() => {
    if (!value.image) return null;
    return URL.createObjectURL(value.image);
  }, [value.image]);

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
      if (!value.country) {
        setCities([]);
        return;
      }

      const selectedCountry = countries.find(
        (country) => country.text === value.country,
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
  }, [countries, value.country]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          Tell Us About Your Field
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          This info will be visible to players when they browse and book
          sessions at your arena.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Field / Arena Name
          </label>
          <Input
            placeholder="Enter arena name"
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.field_name}
            onChange={(e) => onChange({ field_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Description
          </label>
          <Textarea
            placeholder="Describe your arena..."
            className="bg-input/30 border-white/10 text-primary min-h-[100px]"
            value={value.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">Country</label>
            <Select
              value={value.country}
              onValueChange={(v) => onChange({ country: v, city: "" })}
            >
              <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {countries.map((country) => (
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
              value={value.city}
              onValueChange={(v) => onChange({ city: v })}
            >
              <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {cities.map((city) => (
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
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.full_address}
            onChange={(e) => onChange({ full_address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            Arena Thumbnail
          </label>
          <p className="text-xs text-muted-foreground">
            Upload a photo to display as your arena&apos;s profile picture.
          </p>
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              onChange({ image: f ?? null });
            }}
          />
          <div className="flex items-center gap-4 mt-2">
            <div className="w-16 h-16 rounded-lg bg-input/30 border border-white/10 border-dashed flex items-center justify-center overflow-hidden relative">
              {imagePreviewUrl ? (
                // Local blob preview — next/image is not suitable here.
                // eslint-disable-next-line @next/next/no-img-element -- object URL from file input
                <img
                  src={imagePreviewUrl}
                  alt="Arena thumbnail preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-lg border border-white/10 bg-input/30 text-sm text-primary hover:bg-input/50 transition-colors"
            >
              Choose
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepArenaInfo;
