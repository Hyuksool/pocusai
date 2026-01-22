import React from 'react';

/**
 * A lightweight custom formatter to handle basic markdown syntax
 * specifically tailored for the prompt's output requirements.
 * Handles: **bold**, [links](urls), and line breaks.
 */
export const formatMessageText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Split by newlines to handle paragraphs
  const lines = text.split('\n');

  return lines.map((line, lineIndex) => {
    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    // Regex to match bold text: **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // We need a way to parse both bold and links. 
    // Since they can be nested or adjacent, a simple split is tricky.
    // For this specific use case, we will process links first, then bold within non-link parts?
    // Let's do a simple recursive approach or just split by the most prominent feature (links).
    
    // Simplified approach: Split by links first.
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      // Push text before the link
      if (match.index > lastIndex) {
        const preText = line.substring(lastIndex, match.index);
        parts.push(<span key={`text-${lastIndex}`}>{processBold(preText)}</span>);
      }

      // Push the link
      parts.push(
        <a
          key={`link-${match.index}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline font-medium"
        >
          {match[1]}
        </a>
      );

      lastIndex = linkRegex.lastIndex;
    }

    // Push remaining text
    if (lastIndex < line.length) {
      parts.push(<span key={`text-${lastIndex}`}>{processBold(line.substring(lastIndex))}</span>);
    }

    // If the line is empty (double newline), render a break
    if (line.trim() === '') {
      return <div key={lineIndex} className="h-4" />;
    }

    return (
      <div key={lineIndex} className="min-h-[1.5rem] break-words">
        {parts.length > 0 ? parts : processBold(line)}
      </div>
    );
  });
};

// Helper to process **bold** inside a string and return React Nodes
const processBold = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  const boldRegex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(<strong key={match.index} className="font-bold text-slate-900">{match[1]}</strong>);
    lastIndex = boldRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};
