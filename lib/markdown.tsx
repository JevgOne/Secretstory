/**
 * Lightweight markdown parser for basic formatting
 * Replaces react-markdown (~40-50KB) with ~2KB custom solution
 */

export function parseMarkdown(content: string) {
  if (!content) return null;

  // Split by double newlines to get paragraphs
  const blocks = content.split('\n\n').filter(Boolean);

  return blocks.map((block, blockIndex) => {
    const trimmed = block.trim();

    // Headings
    if (trimmed.startsWith('### ')) {
      return <h3 key={blockIndex}>{trimmed.slice(4)}</h3>;
    }
    if (trimmed.startsWith('## ')) {
      return <h2 key={blockIndex}>{trimmed.slice(3)}</h2>;
    }
    if (trimmed.startsWith('# ')) {
      return <h1 key={blockIndex}>{trimmed.slice(2)}</h1>;
    }

    // Unordered lists
    if (trimmed.includes('\n- ') || trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter(line => line.trim().startsWith('- '));
      return (
        <ul key={blockIndex}>
          {items.map((item, i) => (
            <li key={i}>{parseInline(item.slice(2))}</li>
          ))}
        </ul>
      );
    }

    // Ordered lists
    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split('\n').filter(line => /^\d+\.\s/.test(line.trim()));
      return (
        <ol key={blockIndex}>
          {items.map((item, i) => (
            <li key={i}>{parseInline(item.replace(/^\d+\.\s/, ''))}</li>
          ))}
        </ol>
      );
    }

    // Regular paragraph
    return <p key={blockIndex}>{parseInline(trimmed)}</p>;
  });
}

/**
 * Parse inline markdown (bold, italic, links, code)
 */
function parseInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  // Regex for inline markdown
  const inlineRegex = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g;
  let match;

  while ((match = inlineRegex.exec(text)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Bold **text**
    if (match[1]) {
      parts.push(<strong key={key++}>{match[2]}</strong>);
    }
    // Italic *text*
    else if (match[3]) {
      parts.push(<em key={key++}>{match[4]}</em>);
    }
    // Code `text`
    else if (match[5]) {
      parts.push(<code key={key++}>{match[6]}</code>);
    }
    // Link [text](url)
    else if (match[7]) {
      parts.push(
        <a key={key++} href={match[9]} target="_blank" rel="noopener noreferrer">
          {match[8]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}
