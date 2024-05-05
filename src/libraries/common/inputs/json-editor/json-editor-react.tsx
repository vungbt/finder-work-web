/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import React, { useEffect, useRef, useState } from 'react';

export interface JSONEditorReactProps extends JSONEditorOptions {
  json?: object;
  text?: string;
  schema?: object;
  schemaRefs?: object;

  isLoading?: boolean;
  className?: string;
  isHaveError?: boolean;
}

export const JSONEditorReact: React.FC<JSONEditorReactProps> = ({
  json,
  text,
  mode = 'code',
  schema,
  schemaRefs,
  isHaveError,
  className,
  ...options
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [jsoneditor, setJsonEditor] = useState<JSONEditor | null>(null);
  let prevSchema = cloneDeep(schema);
  let prevSchemaRefs = cloneDeep(schemaRefs);

  useEffect(() => {
    loadJSONEditor();
    return () => {
      if (jsoneditor) {
        jsoneditor.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (jsoneditor) {
      if (json) jsoneditor.update(json);
      if (text) jsoneditor.updateText(text);
      if (mode) jsoneditor.setMode(mode);

      const schemaChanged = !isEqual(schema, prevSchema);
      const schemaRefsChanged = !isEqual(schemaRefs, prevSchemaRefs);
      if (schemaChanged || schemaRefsChanged) {
        prevSchema = cloneDeep(schema);
        prevSchemaRefs = cloneDeep(schemaRefs);
        jsoneditor.setSchema(schema ?? {}, schemaRefs);
      }
    }
  }, [json, text, mode, schema, schemaRefs, jsoneditor]);

  const loadJSONEditor = async () => {
    const { default: JSONEditor } = await import('jsoneditor');
    if (containerRef.current) {
      const jsoneditor = new JSONEditor(containerRef.current, {
        ...options,
        mode,
        schema,
        schemaRefs,
        mainMenuBar: false
      });

      if (json) jsoneditor.set(json);
      if (text) jsoneditor.setText(text);
      prevSchema = cloneDeep(schema);
      prevSchemaRefs = cloneDeep(schemaRefs);
      setJsonEditor(jsoneditor as any);
    }
  };

  return (
    <div
      className={clsx(
        'jsoneditor-react-container',
        {
          'jsoneditor-react-container__error': isHaveError
        },
        className
      )}
      ref={containerRef}
    />
  );
};
