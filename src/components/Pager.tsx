import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

type SetPageCursors = (prev: Record<number, string>) => void;
export type Fetcher = (options: {
  setPageCursors: SetPageCursors;
  setCursor: (cursor: string) => void;
  currentPage: number;
  cursor: string | null;
  after: string;
  itemsPerPage: number;
}) => void;

const Pager: React.FC<{
  fetcher: Fetcher;
  total: number;
  pageInfo: PageInfo;
  itemsPerPage?: number;
}> = ({ fetcher, total, pageInfo, itemsPerPage = 10 }) => {
  const maxPagerItem = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  const pageLength = (offset: number) => {
    const length = totalPages - offset;
    return length > maxPagerItem ? maxPagerItem : length;
  };
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cursor, setCursor] = useState<string>("");
  const [pageCursors, setPageCursors] = useState<Record<number, string>>({
    1: "",
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (page in pageCursors) {
      setCursor(pageCursors[page]);

      fetcher({
        setPageCursors,
        setCursor,
        currentPage: page,
        cursor: pageCursors[page],
        after: pageCursors[page],
        itemsPerPage,
      });
    } else {
      fetcher({
        setPageCursors,
        setCursor,
        currentPage: page,
        cursor,
        after: cursor || pageInfo.endCursor || "",
        itemsPerPage,
      });
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        {pageInfo.hasPreviousPage && (
          <PaginationItem key="prev">
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(
                  pageInfo.hasPreviousPage ? currentPage - 1 : 1
                );
              }}
            />
          </PaginationItem>
        )}

        {Array.from(
          { length: pageLength(pageOffset) },
          (_, i) => i + 1 + pageOffset
        ).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              {...(page === currentPage && { isActive: true })}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {pageLength(pageOffset) > maxPagerItem && (
          <PaginationItem>
            <PaginationEllipsis
              onClick={(e) => {
                e.preventDefault();
                setPageOffset((pageOffset) => pageOffset + maxPagerItem);
              }}
            />
          </PaginationItem>
        )}

        {pageInfo.hasNextPage && (
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
};

export default Pager;
