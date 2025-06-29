// Компонент выбора точки на карте Google
import React from "react";
import parseGoogleAddress from "../utils/parseGoogleAddress";
import { validateURL } from "../utils/validation";

interface MapSelectorProps {
  onSelect?: (res: { link: string; address: string }) => void
  onClose?: () => void
}

export default function MapSelector({ onSelect, onClose }: MapSelectorProps) {
  const [link, setLink] = React.useState("");
  const [error, setError] = React.useState("");

  const submit = () => {
    const sanitized = validateURL(link);
    if (!sanitized) {
      setError("Некорректная ссылка");
      return;
    }
    const address = parseGoogleAddress(sanitized);
    if (onSelect) onSelect({ link: sanitized, address });
    if (onClose) onClose();
  };

  return (
    <div className="bg-opacity-30 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-xl space-y-2 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
        <iframe
          src="https://www.google.com/maps/embed?output=embed"
          className="h-64 w-full rounded"
          allowFullScreen
        ></iframe>
        <p className="text-sm text-gray-600">
          После выбора места нажмите в Google Maps «Поделиться» и скопируйте
          ссылку
        </p>
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder='Вставьте ссылку "Поделиться"'
          className="w-full rounded border px-2 py-1"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button className="btn-gray" onClick={onClose}>
            Отмена
          </button>
          <button className="btn-blue" onClick={submit}>
            Вставить
          </button>
        </div>
      </div>
    </div>
  );
}
