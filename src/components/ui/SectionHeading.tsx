interface SectionHeadingProps {
  eyebrow: string;
  title?: string;
  subtitle?: string;
  id?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  id,
  className,
}: SectionHeadingProps) {
  if (!title) {
    return (
      <div className={className ? `mb-5 ${className}` : "mb-5"}>
        <h2
          id={id}
          className="font-mono-tech text-xs font-medium uppercase tracking-[0.08em]"
          style={{ color: "var(--text-muted)" }}
        >
          {eyebrow}
        </h2>
        {subtitle ? (
          <p
            className="mt-2 max-w-[60ch] text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={className ? `mb-8 ${className}` : "mb-8"}>
      <p
        className="font-mono-tech text-xs font-medium uppercase tracking-[0.08em]"
        style={{ color: "var(--text-muted)" }}
      >
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-2 font-semibold tracking-tight"
        style={{
          color: "var(--text-primary)",
          fontSize: "clamp(1.5rem, 1.15rem + 1.4vw, 2.25rem)",
          lineHeight: 1.2,
        }}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className="mt-3 max-w-[62ch] text-sm sm:text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
