import React, { forwardRef } from 'react'

// ============================================================
// HeroUI Shim Module — Figma Design System
// Replaces @heroui/react with native HTML + Tailwind
// Primary: #6B4FDB, Background: #EDEEF3, Pills buttons
// ============================================================

export const HeroUIProvider = ({ children }: any) => <>{children}</>

// ===== CARD =====
export const Card = forwardRef<HTMLDivElement, any>(
  ({ className = '', children, as: As, to, href, ...props }, ref) => {
    const cls = `bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-200 ${className}`
    if (As && to) return <As to={to} ref={ref} className={cls} {...props}>{children}</As>
    if (href) return <a href={href} ref={ref} className={cls} {...props}>{children}</a>
    return <div ref={ref} className={cls} {...props}>{children}</div>
  }
)

export const CardBody = forwardRef<HTMLDivElement, any>(
  ({ className = '', children, ...props }, ref) => (
    <div ref={ref} className={`p-5 ${className}`} {...props}>{children}</div>
  )
)

// ===== BUTTON — Figma Pill Style =====
export const Button = forwardRef<HTMLButtonElement, any>(
  ({ className = '', children, startContent, endContent, isDisabled, isLoading, isIconOnly, color, variant, size, as: As, to, onPress, onClick, ...props }, ref) => {
    const handleClick = onPress || onClick
    const baseSize = isIconOnly ? 'w-8 h-8 p-0' : size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-5 py-2.5 text-sm'
    
    let colorCls = 'bg-[#6B4FDB] text-white shadow-[0_4px_12px_rgba(107,79,219,0.25)] hover:bg-[#5A3DCA] hover:shadow-[0_6px_16px_rgba(107,79,219,0.35)]'
    if (color === 'danger') colorCls = 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
    else if (color === 'success') colorCls = 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
    else if (variant === 'bordered' || variant === 'outline') colorCls = 'bg-white text-[#374151] border border-[#E5E7EB] hover:border-[#6B4FDB] hover:text-[#6B4FDB] hover:bg-[#EAE8F5]'
    else if (variant === 'light' || variant === 'ghost') colorCls = 'bg-transparent text-[#374151] hover:bg-[#F3F4F6] hover:text-[#111827]'
    else if (variant === 'flat' || variant === 'faded') colorCls = 'bg-[#EAE8F5] text-[#6B4FDB] hover:bg-[#DDD9F5]'

    const disabledCls = isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
    const cls = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 ${baseSize} ${colorCls} ${disabledCls} ${className}`

    if (As && to) return <As to={to} ref={ref} className={cls} onClick={handleClick} {...props}>{startContent && <span>{startContent}</span>}{children}{endContent && <span>{endContent}</span>}</As>
    return (
      <button ref={ref} className={cls} disabled={isDisabled} onClick={handleClick} {...props}>
        {isLoading && <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />}
        {startContent && !isLoading && <span>{startContent}</span>}
        {children}
        {endContent && <span>{endContent}</span>}
      </button>
    )
  }
)

// ===== INPUT =====
export const Input = forwardRef<HTMLInputElement, any>(
  ({ className = '', classNames = {}, startContent, endContent, label, labelPlacement, onValueChange, value, isDisabled, variant, radius, placeholder, ...props }, ref) => (
    <div className={`w-full ${className}`}>
      {label && labelPlacement === 'outside' && (
        <label className="block text-sm font-semibold text-[#374151] mb-1.5">{label}</label>
      )}
      <div className={`flex items-center bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 focus-within:border-[#6B4FDB] focus-within:ring-2 focus-within:ring-[#6B4FDB]/10 transition-all ${classNames.inputWrapper || ''}`}>
        {startContent && <span className="mr-2 text-[#9CA3AF] flex-shrink-0">{startContent}</span>}
        <input
          ref={ref}
          value={value}
          onChange={onValueChange ? (e) => onValueChange(e.target.value) : props.onChange}
          disabled={isDisabled}
          placeholder={placeholder}
          className={`bg-transparent outline-none w-full text-sm text-[#111827] placeholder:text-[#9CA3AF] ${classNames.input || ''}`}
          {...(({ onChange, ...rest }) => rest)(props)}
        />
        {endContent && <span className="ml-2 text-[#9CA3AF] flex-shrink-0">{endContent}</span>}
      </div>
    </div>
  )
)

// ===== TEXTAREA =====
export const Textarea = forwardRef<HTMLTextAreaElement, any>(
  ({ className = '', classNames = {}, onValueChange, value, isDisabled, minRows, maxRows, ...props }, ref) => (
    <div className={`w-full ${className}`}>
      <textarea
        ref={ref}
        value={value}
        onChange={onValueChange ? (e) => onValueChange(e.target.value) : props.onChange}
        disabled={isDisabled}
        rows={minRows || 3}
        className={`w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#6B4FDB] focus:ring-2 focus:ring-[#6B4FDB]/10 transition-all resize-y ${classNames.inputWrapper || ''}`}
        {...(({ onChange, ...rest }) => rest)(props)}
      />
    </div>
  )
)

// ===== CHIP / BADGE =====
export const Chip = forwardRef<HTMLSpanElement, any>(
  ({ className = '', children, startContent, color, variant, size, ...props }, ref) => {
    let colorCls = 'bg-[#EAE8F5] text-[#6B4FDB]'
    if (color === 'success') colorCls = 'bg-emerald-50 text-emerald-700'
    else if (color === 'danger') colorCls = 'bg-red-50 text-red-600'
    else if (color === 'warning') colorCls = 'bg-amber-50 text-amber-700'
    else if (color === 'default') colorCls = 'bg-[#F3F4F6] text-[#4B5563]'
    else if (color === 'secondary') colorCls = 'bg-purple-50 text-purple-700'
    const sz = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
    return (
      <span ref={ref} className={`inline-flex items-center gap-1 rounded-full font-semibold ${sz} ${colorCls} ${className}`} {...props}>
        {startContent}
        {children}
      </span>
    )
  }
)

// ===== AVATAR =====
export const Avatar = forwardRef<HTMLDivElement, any>(
  ({ name = '', className = '', size, ...props }, ref) => (
    <div ref={ref} className={`rounded-full flex items-center justify-center font-bold text-white bg-[#6B4FDB] ${size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'} ${className}`} {...props}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
)

// ===== PROGRESS =====
export const Progress = forwardRef<HTMLDivElement, any>(
  ({ value = 0, maxValue = 100, className = '', classNames = {}, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / maxValue) * 100))
    return (
      <div ref={ref} className={`w-full h-2 bg-[#E5E7EB] rounded-full overflow-hidden ${className}`} {...props}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${classNames.indicator || 'bg-[#6B4FDB]'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    )
  }
)

// ===== DROPDOWN =====
export const Dropdown = ({ children }: any) => (
  <div className="relative group">{children}</div>
)

export const DropdownTrigger = ({ children }: any) => <div>{children}</div>

export const DropdownMenu = ({ children, 'aria-label': _ }: any) => (
  <div className="absolute right-0 mt-1 w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 py-1 overflow-hidden">
    {children}
  </div>
)

export const DropdownItem = ({ children, onPress, color, href, key: _key }: any) => {
  const Cmp = href ? 'a' : 'button'
  return (
    <Cmp
      href={href}
      onClick={onPress}
      className={`px-4 py-2 text-sm w-full text-left hover:bg-[#F3F4F6] transition-colors font-medium ${color === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-[#374151] hover:text-[#6B4FDB]'}`}
    >
      {children}
    </Cmp>
  )
}

// ===== TABS =====
export const Tabs = ({ children, classNames }: any) => (
  <div className="flex flex-col">{children}</div>
)

export const Tab = ({ title, children }: any) => (
  <div>
    <div className="text-base font-bold text-[#374151] pb-4 mb-4">{title}</div>
    {children}
  </div>
)

// ===== SELECT =====
export const Select = ({ children, className = '', classNames = {}, selectedKeys, onChange, ...props }: any) => (
  <select
    className={`bg-white border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm text-[#374151] outline-none focus:border-[#6B4FDB] transition-all ${classNames.trigger || ''} ${className}`}
    onChange={onChange}
    value={selectedKeys ? selectedKeys[0] : undefined}
    {...props}
  >
    {children}
  </select>
)

export const SelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
)
