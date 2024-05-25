import Markdown from 'markdown-to-jsx';

interface MarkdownRendererProps {
  content: string;
  h2Style?: React.CSSProperties;
  strongStyle?: React.CSSProperties;
  aStyle?: React.CSSProperties;
  preStyle?: React.CSSProperties;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  h2Style,
  strongStyle,
  aStyle,
  preStyle,
}) => {
  const overrides = {
    h2: {
      component: ({ children, ...props }: any) => (
        <h2 style={h2Style} {...props}>
          {children}
        </h2>
      ),
    },
    h3: {
      component: ({ children, ...props }: any) => (
        <h3 style={h2Style} {...props}>
          {children}
        </h3>
      ),
    },
    a: {
      component: ({ children, ...props }: any) => (
        <a style={aStyle} {...props}>
          {children}
        </a>
      ),
    },
    strong: {
      component: ({ children, ...props }: any) => (
        <strong style={strongStyle} {...props}>
          {children}
        </strong>
      ),
    },
    pre: {
      component: ({ children, ...props }: any) => (
        <pre style={preStyle} {...props}>
          {children}
        </pre>
      ),
    },
  };

  return <Markdown options={{ overrides }}>{content}</Markdown>;
};

export default MarkdownRenderer;
