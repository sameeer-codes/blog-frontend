export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  actions = null,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            {eyebrow}
          </p>
        )}
        <div className="space-y-2">
          <h1 className="text-4xl tracking-tight">{title}</h1>
          {description && (
            <p className="max-w-3xl text-sm leading-7 text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}
