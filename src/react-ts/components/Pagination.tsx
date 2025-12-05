import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalRows: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  counter?: string;
  buttonCount?: number;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalRows,
  pageSizeOptions = [10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  counter = 'rows',
  buttonCount = 5,
  className = ''
}) => {
  const getPageButtons = () => {
    const buttons: number[] = [];
    const halfButtons = Math.floor(buttonCount / 2);
    
    let start = Math.max(1, currentPage - halfButtons);
    let end = Math.min(totalPages, start + buttonCount - 1);
    
    if (end - start < buttonCount - 1) {
      start = Math.max(1, end - buttonCount + 1);
    }
    
    for (let i = start; i <= end; i++) {
      buttons.push(i);
    }
    
    return buttons;
  };

  const getCounterText = () => {
    if (!counter) return '';
    
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalRows);
    
    if (counter === 'rows') {
      return `Showing ${start} to ${end} of ${totalRows} rows`;
    }
    return `${currentPage} of ${totalPages}`;
  };

  return (
    <div className={`tabulator-paginator ${className}`}>
      <div className="tabulator-paginator-contents">
        {counter && (
          <div className="tabulator-paginator-counter">
            {getCounterText()}
          </div>
        )}
        
        <div className="tabulator-paginator-pages">
          <button
            className="tabulator-page tabulator-page-first"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          
          <button
            className="tabulator-page tabulator-page-prev"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          
          {getPageButtons().map(page => (
            <button
              key={page}
              className={`tabulator-page ${page === currentPage ? 'tabulator-page-active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          
          <button
            className="tabulator-page tabulator-page-next"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          
          <button
            className="tabulator-page tabulator-page-last"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
        
        {pageSizeOptions.length > 0 && (
          <div className="tabulator-paginator-size">
            <label>
              Rows per page:
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="tabulator-page-size"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;

