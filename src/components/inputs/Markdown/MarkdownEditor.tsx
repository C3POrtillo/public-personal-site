import dynamic from 'next/dynamic';

import type { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';
import 'react-markdown-editor-lite/lib/index.css';

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false,
});

const ReactMarkdown = dynamic(() => import('react-markdown'), {
  ssr: false,
});

interface MarkdownEditorProps extends PropsWithChildren {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const MarkdownEditor: FC<MarkdownEditorProps> = ({ value, onChange, children }) => (
  <div className="size-full overflow-hidden rounded-lg border-2 border-black shadow-md shadow-black">
    <MdEditor
      className="markdown-styles h-full"
      plugins={[
        'header',
        'font-bold',
        'font-italic',
        'font-underline',
        'list-unordered',
        'list-ordered',
        'block-wrap',
        'link',
        'clear',
        'logger',
        'mode-toggle',
        'full-screen',
      ]}
      value={value}
      renderHTML={text => (
        <>
          <ReactMarkdown>{text}</ReactMarkdown>
          {children}
        </>
      )}
      onChange={({ text }) => onChange(text)}
    />
  </div>
);

export default MarkdownEditor;
