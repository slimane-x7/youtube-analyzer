
import React from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { DocumentData, DocElementType } from '../types';

interface DocPreviewProps {
  data: DocumentData;
  onRemoveElement: (id: string) => void;
}

const DocPreview: React.FC<DocPreviewProps> = ({ data, onRemoveElement }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full min-h-[600px]">
      <div className="p-4 border-bottom bg-slate-50/50 flex justify-between items-center rounded-t-xl border-b">
        <div className="flex items-center gap-2 text-slate-700 font-medium">
          <FileText size={18} />
          <span>Structural Preview</span>
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">
          US Letter Format
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 max-h-[800px]">
        {data.elements.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Plus size={32} />
            </div>
            <p>Use the architect to start building content</p>
          </div>
        ) : (
          <>
            <div className="pb-6 mb-6 border-b border-slate-100">
              <h1 className="text-3xl font-bold text-slate-900 mb-1">{data.title}</h1>
              <p className="text-sm text-slate-400">By: {data.author}</p>
            </div>

            {data.elements.map((el) => (
              <div key={el.id} className="group relative border border-transparent hover:border-blue-100 rounded-lg p-2 transition-all">
                <button 
                  onClick={() => onRemoveElement(el.id)}
                  className="absolute -right-2 -top-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 shadow-sm"
                >
                  <Trash2 size={14} />
                </button>

                {el.type === DocElementType.HEADING1 && (
                  <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-500 pl-4 py-1">{el.content}</h2>
                )}
                
                {el.type === DocElementType.HEADING2 && (
                  <h3 className="text-xl font-semibold text-slate-700 border-l-4 border-slate-300 pl-4 py-1">{el.content}</h3>
                )}

                {el.type === DocElementType.PARAGRAPH && (
                  <p className="text-slate-600 leading-relaxed text-sm">{el.content}</p>
                )}

                {(el.type === DocElementType.LIST_BULLET || el.type === DocElementType.LIST_NUMBER) && (
                  <ul className={`space-y-2 text-sm text-slate-600 pl-4 ${el.type === DocElementType.LIST_NUMBER ? 'list-decimal' : 'list-disc'}`}>
                    {el.items?.map((item, idx) => (
                      <li key={idx} className="pl-2">{item}</li>
                    ))}
                  </ul>
                )}

                {el.type === DocElementType.TABLE && el.rows && (
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-slate-200">
                        {el.rows.map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-50 font-semibold' : ''}>
                            {row.cells.map((cell, cIdx) => (
                              <td key={cIdx} className="p-3 border-r border-slate-200 last:border-0">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {el.type === DocElementType.PAGE_BREAK && (
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-dashed border-slate-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-white px-2 text-xs text-slate-400 font-medium">PAGE BREAK</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DocPreview;
