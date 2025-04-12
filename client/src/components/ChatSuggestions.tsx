import { Button } from "@/components/ui/button";

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export default function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const suggestions = [
    "كيف يمكنني تعلم لغة برمجة جديدة؟",
    "ما هي أفضل طرق تحسين اللياقة البدنية؟",
    "اقترح لي كتب عن تطوير الذات",
    "اكتب لي قصة قصيرة عن الصداقة"
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="bg-gray-100 hover:bg-gray-200 rounded-lg p-3 text-sm text-right transition-colors h-auto"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
