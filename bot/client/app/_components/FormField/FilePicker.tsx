/**
 * Назначение: компонент интерфейса.
 * Основные модули: React, Next.js, Tailwind.
 */
"use client";

import { useState } from "react";
import { ColorButtonKey } from "../../_interfaces";
import Button from "../Button";

type Props = {
  label?: string;
  icon?: string;
  accept?: string;
  color: ColorButtonKey;
  isRoundIcon?: boolean;
};

const FormFilePicker = ({ label, icon, accept, color, isRoundIcon }: Props) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event) => {
    setFile(event.currentTarget.files[0]);
  };

  const showFilename = !isRoundIcon && file;

  return (
    <div className="flex items-stretch justify-start relative">
      <label className="inline-flex">
        <Button
          className={`${isRoundIcon ? "w-12 h-12" : ""} ${showFilename ? "rounded-r-none" : ""}`}
          iconSize={isRoundIcon ? 24 : undefined}
          label={isRoundIcon ? null : label}
          icon={icon}
          color={color}
          roundedFull={isRoundIcon}
          asAnchor
        />
        <input
          type="file"
          className="absolute top-0 left-0 w-full h-full opacity-0 outline-hidden cursor-pointer -z-1"
          onChange={handleFileChange}
          accept={accept}
        />
      </label>
      {showFilename && (
        <div className="px-4 py-2 max-w-full grow-0 overflow-x-hidden bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 border rounded-r">
          <span className="text-ellipsis max-w-full line-clamp-1">
            {file.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default FormFilePicker;
