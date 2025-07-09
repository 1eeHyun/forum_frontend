const inputClass =
  "w-full px-4 py-2 rounded-lg border border-border dark:border-dark-card-bg bg-input-bg dark:bg-dark-action text-input-text dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";

export default function SelectInput({ label, name, value, onChange, options, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={inputClass}
      >
        {options.map(({ value: optValue, label: optLabel }) => (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
