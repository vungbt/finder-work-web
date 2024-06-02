import { RenderIcon } from '@/libraries/icons';
import { Link } from '@/utils/navigation';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { InputForm } from '../inputs';
import clsx from 'clsx';
import { PaginationTop } from '../pagination';

type FunctionBarProps = {
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  addUrl?: string;
  onSort?: () => void;
  onChangePage?: (page: number) => void;
  pagination?: {
    total: number;
    currentPage?: number;
    limit?: number;
    className?: string;
  };
  searchValidation?: Yup.ObjectSchema<
    {
      search: string;
    },
    Yup.AnyObject,
    {
      search: undefined;
    },
    ''
  >;
  className?: string;
};

export function FunctionBar({
  onSearch,
  onAdd,
  onSort,
  onChangePage,
  addUrl,
  pagination,
  className,
  searchValidation
}: FunctionBarProps) {
  const validationSchema = Yup.object({
    search: Yup.string().trim()
  });

  return (
    <div
      className={clsx(
        'flex items-center justify-between p-2 bg-gray-100 rounded-lg gap-4',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* add button */}
        {onAdd && (
          <button className="p-1" onClick={onAdd}>
            <RenderIcon className="!w-5 !h-5" name="add" />
          </button>
        )}

        {/* add link */}
        {addUrl && (
          <Link href={addUrl} className="p-1">
            <RenderIcon className="!w-5 !h-5" name="add" />
          </Link>
        )}

        {/* sort action */}
        {onSort && (
          <button className="p-1" onClick={onSort}>
            <RenderIcon className="!w-5 !h-5" name="sort" />
          </button>
        )}
      </div>

      {onSearch && (
        <div className="flex items-center justify-end gap-4">
          {/* pagination */}
          {onChangePage && pagination && (
            <PaginationTop {...pagination} onChangePage={onChangePage} />
          )}
          <Formik
            initialValues={{ search: '' }}
            validationSchema={searchValidation ?? validationSchema}
            onSubmit={(values) => onSearch(values.search.trim())}
          >
            {() => {
              return (
                <Form className="max-h-8">
                  <Field
                    size="middle"
                    classNameWrap="bg-gray-200 max-w-[160px]"
                    placeholder="Search"
                    iconLeft="search"
                    name="search"
                    component={InputForm}
                  />
                  <button hidden type="submit"></button>
                </Form>
              );
            }}
          </Formik>
        </div>
      )}
    </div>
  );
}
