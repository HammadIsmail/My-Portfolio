import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MarkdownEditor = ({ content, onChange }: MarkdownEditorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-lg p-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Markdown Input</h3>
        <Textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your content in markdown..."
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Preview</h3>
        <div className="prose prose-sm max-w-none min-h-[300px] p-4 border rounded-md bg-muted/30">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content || '*Preview will appear here*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
