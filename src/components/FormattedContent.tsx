interface FormattedContentProps {
  content: string;
}

const FormattedContent = ({ content }: FormattedContentProps) => {
  // Parse markdown-style content and convert to JSX
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-2 mb-6 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-primary mt-1.5">•</span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    const formatInline = (text: string) => {
      // Bold text: **text** or __text__
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
      text = text.replace(/__(.+?)__/g, '<strong class="font-semibold text-foreground">$1</strong>');
      // Italic: *text* or _text_
      text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
      text = text.replace(/_(.+?)_/g, '<em class="italic">$1</em>');
      return text;
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      // Skip empty lines
      if (!trimmed) {
        if (inList) flushList();
        return;
      }

      // Headers
      if (trimmed.startsWith('####')) {
        if (inList) flushList();
        const text = trimmed.replace(/^####\s*/, '');
        elements.push(
          <h4 key={`h4-${index}`} className="text-lg font-semibold text-foreground mb-3 mt-6">
            {text}
          </h4>
        );
      } else if (trimmed.startsWith('###')) {
        if (inList) flushList();
        const text = trimmed.replace(/^###\s*/, '');
        elements.push(
          <h3 key={`h3-${index}`} className="text-xl font-semibold text-foreground mb-4 mt-6">
            {text}
          </h3>
        );
      } else if (trimmed.startsWith('##')) {
        if (inList) flushList();
        const text = trimmed.replace(/^##\s*/, '');
        elements.push(
          <h2 key={`h2-${index}`} className="text-2xl font-bold text-foreground mb-4 mt-8">
            {text}
          </h2>
        );
      } else if (trimmed.startsWith('#')) {
        if (inList) flushList();
        const text = trimmed.replace(/^#\s*/, '');
        elements.push(
          <h1 key={`h1-${index}`} className="text-3xl font-bold text-foreground mb-5 mt-8">
            {text}
          </h1>
        );
      }
      // List items
      else if (trimmed.match(/^[-*]\s+/)) {
        const text = trimmed.replace(/^[-*]\s+/, '');
        listItems.push(text);
        inList = true;
      }
      // Numbered lists
      else if (trimmed.match(/^\d+\.\s+/)) {
        if (inList && listItems.length > 0) flushList();
        const text = trimmed.replace(/^\d+\.\s+/, '');
        listItems.push(text);
        inList = true;
      }
      // Regular paragraph
      else {
        if (inList) flushList();
        elements.push(
          <p 
            key={`p-${index}`} 
            className="text-muted-foreground leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }}
          />
        );
      }
    });

    // Flush any remaining list
    if (inList) flushList();

    return elements;
  };

  return (
    <div className="prose prose-invert max-w-none">
      {parseContent(content)}
    </div>
  );
};

export default FormattedContent;
