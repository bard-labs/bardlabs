import Link from "next/link"

const productLinks = [
  { href: "/#now", label: "Now" },
  { href: "/#disciplines", label: "Lab" },
  { href: "/projects", label: "Projects" },
  { href: "/brain", label: "Brain" },
]

const resourceLinks = [
  { href: "https://bardiamardan.xyz", label: "bardiamardan.xyz", external: true },
  { href: "https://github.com/BardiaMardan", label: "GitHub", external: true },
  { href: "https://www.linkedin.com/in/bardiamardan", label: "LinkedIn", external: true },
  { href: "mailto:hello@bardialabs.com", label: "Contact" },
  { href: "/dashboard", label: "Admin" },
]

export const FOOTER_REVEAL_HEIGHT = "min(72svh, 640px)"

export function SiteFooter() {
  return (
    <footer
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex flex-col justify-end bg-white text-black"
      style={{ height: FOOTER_REVEAL_HEIGHT }}
    >
      <div className="pointer-events-auto mx-auto flex h-full w-full max-w-6xl flex-col justify-between gap-6 px-5 py-6 sm:gap-8 sm:px-8 sm:py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-[14ch] text-lg font-medium tracking-tight text-neutral-900 sm:text-2xl md:text-3xl">
            Experience liftoff
          </p>

          <div className="grid grid-cols-2 gap-8 sm:gap-16">
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-900">Lab</p>
              <ul className="space-y-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-600 transition-colors hover:text-black"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-900">Resources</p>
              <ul className="space-y-2">
                {resourceLinks.map((link) =>
                  link.external ? (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-neutral-600 transition-colors hover:text-black"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-600 transition-colors hover:text-black"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="min-w-0 overflow-hidden">
          <p
            className="select-none font-semibold tracking-[-0.04em] text-black uppercase"
            style={{
              fontSize: "clamp(2.5rem, 17vw, 11rem)",
              lineHeight: 0.85,
            }}
          >
            BARDLABS
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 text-[10px] tracking-[0.18em] text-neutral-500 uppercase sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
          <p>© {new Date().getFullYear()} Bardlabs</p>
          <p>Not a résumé</p>
        </div>
      </div>
    </footer>
  )
}

/** Transparent spacer so the fixed footer can be revealed under the page. */
export function FooterRevealSpacer() {
  return <div aria-hidden className="relative z-10" style={{ height: FOOTER_REVEAL_HEIGHT }} />
}
