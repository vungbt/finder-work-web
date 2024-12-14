'use client';
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '../buttons';
import { RenderIcon } from '@/libraries/icons';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer({ file }: { file: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: any) => {
    setCurrentPage(1);
    setTotalPage(nextNumPages);
  };

  const onChangePage = (status: 'next' | 'previous') => {
    if (status === 'next' && currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
    if (status === 'previous' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          loading={<RenderIcon name="loading" />}
          pageNumber={currentPage}
          width={600}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      </Document>
      <p>
        {currentPage} / {totalPage}
      </p>

      <div className="flex items-center gap-3">
        <Button label="Prev" onClick={() => onChangePage('previous')} />
        <Button label="Next" onClick={() => onChangePage('next')} />
      </div>
    </div>
  );
}
