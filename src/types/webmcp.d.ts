import 'react';

declare module 'react' {
  interface FormHTMLAttributes<T> extends HTMLAttributes<T> {
    toolname?: string;
    tooldescription?: string;
    'data-webmcp-tool'?: string;
    'data-webmcp-description'?: string;
  }

  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparam?: string;
    toolparamdescription?: string;
    'data-webmcp-input'?: string;
    'data-webmcp-description'?: string;
  }

  interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparam?: string;
    toolparamdescription?: string;
    'data-webmcp-input'?: string;
    'data-webmcp-description'?: string;
  }

  interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    toolparam?: string;
    toolparamdescription?: string;
    'data-webmcp-input'?: string;
    'data-webmcp-description'?: string;
  }
}
