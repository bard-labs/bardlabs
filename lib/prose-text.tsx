import type { ReactNode } from "react"

function renderInline(text: string): ReactNode[] {
  const tokens: ReactNode[] = []
  const pattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g
  let last = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) tokens.push(text.slice(last, match.index))
    const label = match[1]
    const markdownUrl = match[2]
    const bareUrl = match[3]
    const href = markdownUrl || bareUrl || ""
    const display = label || href.replace(/^https?:\/\//, "").replace(/\/$/, "")
    tokens.push(
      <a
        key={`link-${key++}`}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="font-normal text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
      >
        {display}
      </a>,
    )
    last = match.index + match[0].length
  }

  if (last < text.length) tokens.push(text.slice(last))
  return tokens
}

export function ProseText({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n{2,}/)

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <p key={index} className="mt-4 whitespace-pre-line font-normal first:mt-0">
          {renderInline(block)}
        </p>
      ))}
    </div>
  )
}

export function hasRtl(text: string) {
  return /[\u0600-\u06FF]/.test(text)
}

export function plainText(text: string) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/\n+/g, " ")
    .trim()
}
