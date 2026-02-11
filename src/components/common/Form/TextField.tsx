import clsx from "clsx";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  showCount?: boolean;
  multiline?: boolean;
  rows?: number;
  className?: string;
  inputClassName?: string;
  id?: string;
  ariaLabel?: string;
  error?: string | null;
};

export default function TextField({
  value,
  onChange,
  placeholder,
  maxLength,
  showCount = false,
  multiline = false,
  rows = 3,
  className = "",
  inputClassName = "",
  id,
  ariaLabel,
  error = null,
}: Props) {
  const commonCls =
    "w-full rounded-lg bg-surface-container-10 px-4 typo-body1 ";

  const baseTextColor = "text-color-highest";
  const baseBorder = "border border-surface-container-10";
  const focusCls = error
    ? "focus:outline-none focus:border-[#FF0000] focus:ring-0"
    : "focus:border-[2px] focus:outline-none focus:border-primary focus:ring-0";
  const placeholderCls = "placeholder:text-color-mid";

  const errorId = id ? `${id}-error` : undefined;
  const countId = id ? `${id}-count` : undefined;

  return (
    <div className={clsx("relative", className)}>
      {multiline ? (
        <>
          <textarea
            id={id}
            aria-label={ariaLabel}
            value={value}
            rows={rows}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={clsx(
              commonCls,
              baseTextColor,
              baseBorder,
              focusCls,
              placeholderCls,
              inputClassName,
              "resize-none min-h-174 py-5"
            )}
          />
        </>
      ) : (
        <>
          <input
            id={id}
            aria-label={ariaLabel}
            value={value}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={
              error ? errorId : showCount && maxLength ? countId : undefined
            }
            className={clsx(
              commonCls,
              baseTextColor,
              baseBorder,
              focusCls,
              placeholderCls,
              inputClassName,
              "h-10 py-[9.5px] pr-28"
            )}
          />
          {showCount && typeof maxLength === "number" && (
            <div
              id={countId}
              className="absolute right-4 bottom-3 typo-body2 text-color-mid"
              aria-hidden="true"
            >
              ({value.length}/{maxLength})
            </div>
          )}
        </>
      )}
    </div>
  );
}
