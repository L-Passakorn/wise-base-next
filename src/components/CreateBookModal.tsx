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
export default function CreateBookForm(): React.ReactElement {
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
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-3xl">
          {/*content*/}
          <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between rounded-t border-b border-solid border-gray-200 p-5">
              <h3 className="text-3xl font-semibold">Create a book</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                onClick={() => {
                  settoggleCreateModal(false)
                }}
              >
                <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-30 outline-none focus:outline-none">
                  ×
                </span>
              </button>
            </div>
            {/*body*/}
            <div className="relative flex-auto p-6">
              <div className="bg-gray-500">
                <Formik
                  validationSchema={toFormikValidationSchema(bookFormSchema)}
                  initialValues={initialValues}
                  onSubmit={handleSubmit}
                >
                  {({ values }) => (
                    <Form>
                      <div className="m-5 flex max-w-sm flex-col space-y-5">
                        <Field
                          className="text-black"
                          name="title"
                          type="text"
                        />
                        <ErrorMessage name="title" className="text-red-500" />

                        <Field
                          className="text-black"
                          name="thumbnailUrl"
                          type="text"
                        />
                        <ErrorMessage
                          name="thumbnailUrl"
                          className="text-red-500"
                        />

                        <Field
                          className="text-black"
                          name="numberPage"
                          type="number"
                        />
                        <ErrorMessage
                          name="numberPage"
                          className="text-red-500"
                        />

                        <Field
                          className="text-black"
                          name="detail"
                          type="text"
                        />
                        <ErrorMessage name="detail" className="text-red-500" />

                        <FieldArray name="category">
                          {({ push, remove }) => (
                            <div>
                              {values.category.map((cat, index) => (
                                <div key={index}>
                                  <Field name={`category[${index}]`} />
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => {
                                  push('')
                                }}
                              >
                                Add Category
                              </button>
                            </div>
                          )}
                        </FieldArray>
                        {/* <Field className="text-black" name="category" type="text" />
            <ErrorMessage name="category" className="text-red-500" /> */}

                        <Field
                          className="text-black"
                          name="author.name"
                          type="text"
                        />
                        <ErrorMessage
                          name="author.name"
                          className="text-red-500"
                        />

                        <Field
                          className="text-black"
                          name="author.age"
                          type="number"
                        />
                        <ErrorMessage
                          name="author.age"
                          className="text-red-500"
                        />

                        <Field
                          className="text-black"
                          name="author.retired"
                          type="checkbox"
                        />
                        <ErrorMessage
                          name="author.retired"
                          className="text-red-500"
                        />

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
              {/* <p className="text-blueGray-500 my-4 text-lg leading-relaxed">
      Lorem ipsum dolor sit, amet consectetur adipisicing elit.
      Reiciendis, temporibus? Autem voluptatibus, exercitationem
      velit ipsum aliquid a voluptatum minus beatae, atque est
      delectus quos illo ab tempore quia vero reiciendis?
    </p> */}
            </div>
            {/*footer*/}
            <div className="flex items-center justify-end rounded-b border-t border-solid border-gray-200 p-6">
              <button
                className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => {
                  settoggleCreateModal(false)
                }}
              >
                Cancel
              </button>
              <button
                className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
                type="button"
                onClick={() => {
                  settoggleCreateModal(false)
                }}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </div>
  )
}
