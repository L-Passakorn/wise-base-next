import { ErrorMessage, Field, FieldArray, Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { getTRPCClientLive } from 'effects/trpcClient.live'
import { BookForm, bookFormSchema } from 'modules/book'

const initialValues: BookForm = {
  title: '',
  thumbnailUrl: '',
  numberPage: 0,
  detail: '',
  category: [],
  author: {
    name: '',
    age: 0,
    retired: false,
  },
}
export default function Book(): React.ReactElement {
  // Corrected the return type

  // const [book, setBook] = useState<BookForm>(initialValues)
  const handleSubmit = async (values: BookForm): Promise<void> => {
    console.log(values)
    // setBook(values)
    // console.log(book)
    const trpcClient = getTRPCClientLive(process.env.WEB_BASE_URL as string)
    await trpcClient.book.manage.create.mutate(values)
  }
  // setTitle(value.title)
  // setNumberPage(value.numberPage)
  // setDetails(value.details)
  // setCatagory(value.catagory)
  // setName(value.name)
  // setAge(value.age)
  // setRetired(value.retired)

  return (
    <div className="bg-gray-500">
      <Formik
        validationSchema={toFormikValidationSchema(bookFormSchema)}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values }) => (
          <Form>
            <div className="m-5 flex max-w-sm flex-col space-y-5">
              <Field className="text-black" name="title" type="text" />
              <ErrorMessage name="title" className="text-red-500" />

              <Field className="text-black" name="thumbnailUrl" type="text" />
              <ErrorMessage name="thumbnailUrl" className="text-red-500" />

              <Field className="text-black" name="numberPage" type="number" />
              <ErrorMessage name="numberPage" className="text-red-500" />

              <Field className="text-black" name="detail" type="text" />
              <ErrorMessage name="detail" className="text-red-500" />

              <FieldArray name="category">
                {({ push, remove }) => (
                  <div>
                    {values.category.map((cat, index) => (
                      <div key={index}>
                        <Field name={`category[${index}]`} />
                        <button type="button" onClick={() => remove(index)}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {push('')}}>
                      Add Category
                    </button>
                  </div>
                )}
              </FieldArray>
              {/* <Field className="text-black" name="category" type="text" />
              <ErrorMessage name="category" className="text-red-500" /> */}

              <Field className="text-black" name="author.name" type="text" />
              <ErrorMessage name="author.name" className="text-red-500" />

              <Field className="text-black" name="author.age" type="number" />
              <ErrorMessage name="author.age" className="text-red-500" />

              <Field
                className="text-black"
                name="author.retired"
                type="checkbox"
              />
              <ErrorMessage name="author.retired" className="text-red-500" />

              <button
                type="submit"
                className="border bg-green-500 p-1 disabled:bg-slate-500"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
      {/* {book && (
        <div className="text-gray-950 flex flex-col space-y-2">
          <div>title: {book.title}</div>
          <div>thumbnailUrl: {book.thumbnailUrl}</div>
          <div>numberPage: {book.numberPage}</div>
          <div>detail: {book.detail}</div>
          <div>category: {book.category}</div>
          <div>name: {book.author.name}</div>
          <div>Age: {book.author.age}</div>
          <div>retired: {book.author.retired ? 'Yes' : 'No'}</div>
        </div>
      )} */}
    </div>
  )
}
