import React, { useEffect, useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera } from "lucide-react";
import { City, Country, type ICity, type ICountry } from "country-state-city";

export type ArenaStepForm = {
  field_name: string;
  description: string;
  country: string;
  city: string;
  full_address: string;
  images: File[];
};

type StepArenaInfoProps = {
  value: ArenaStepForm;
  onChange: (patch: Partial<ArenaStepForm>) => void;
};

const ImagePreviewItem = ({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) => {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!url) return null;

  return (
    <div className="w-16 h-16 rounded-lg bg-input/30 border border-white/10 overflow-hidden relative group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="Arena preview"
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center text-[8px] transition-colors outline-none cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

const StepArenaInfo = ({ value, onChange }: StepArenaInfoProps) => {
  const { t } = useTranslation("dashboard");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

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
      if (!value.country) {
        setCities([]);
        return;
      }

      const selectedCountry = countries.find(
        (country) => country.name === value.country,
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
  }, [countries, value.country]);



  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-primary">
          {t("onboardingFields.arena.title")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t("onboardingFields.arena.subtitle")}
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.arena.nameLabel")}
          </label>
          <Input
            placeholder={t("onboardingFields.arena.namePlaceholder")}
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.field_name}
            onChange={(e) => onChange({ field_name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.arena.descLabel")}
          </label>
          <Textarea
            placeholder={t("onboardingFields.arena.descPlaceholder")}
            className="bg-input/30 border-white/10 text-primary min-h-25"
            value={value.description}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-primary">
              {t("onboardingFields.arena.countryLabel")}
            </label>
            <Select
              value={value.country}
              onValueChange={(v) => onChange({ country: v, city: "" })}
            >
              <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder={t("onboardingFields.arena.countryPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {countries.map((country) => (
                  <SelectItem key={country.isoCode} value={country.name}>
                    {country.name}
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
              value={value.city}
              onValueChange={(v) => onChange({ city: v })}
            >
              <SelectTrigger className="w-full bg-input/30 border-white/10 text-primary h-11">
                <SelectValue placeholder={t("onboardingFields.arena.cityPlaceholder")} />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                {cities.map((city) => (
                  <SelectItem key={city.name} value={city.name}>
                    {city.name}
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
            className="bg-input/30 border-white/10 text-primary h-11"
            value={value.full_address}
            onChange={(e) => onChange({ full_address: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-primary">
            {t("onboardingFields.arena.thumbLabel")}
          </label>
          <p className="text-xs text-muted-foreground">
            {t("onboardingFields.arena.thumbDesc")}
          </p>
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const files = e.target.files ? Array.from(e.target.files) : [];
              if (files.length > 0) {
                onChange({ images: [...(value.images || []), ...files] });
              }
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
            }}
          />
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {(value.images || []).map((file, idx) => (
              <ImagePreviewItem
                key={`${file.name}-${idx}`}
                file={file}
                onRemove={() => {
                  const updated = (value.images || []).filter((_, i) => i !== idx);
                  onChange({ images: updated });
                }}
              />
            ))}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-16 h-16 rounded-lg bg-input/10 hover:bg-input/20 border border-dashed border-white/10 hover:border-white/20 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground font-medium">Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepArenaInfo;
