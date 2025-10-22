export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Select an option',
  error,
  required = false,
  searchable = false,
  ...props 
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-dark-card border ${
          error ? 'border-red-500' : 'border-dark-border'
        } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none cursor-pointer`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

