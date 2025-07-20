import { useForm } from "react-hook-form";
import { useApiMutation } from "../../../../api/ApiMutation";
import { Button } from "../../../ui/Button";
import FormInput from "../../../ui/FormInput";

const AddCategory = () => {
  const { register, handleSubmit, reset } = useForm();
  const { mutate: createMutation } = useApiMutation(
    "post",
    `/api/categories/category`
  );
  const onsubmit = (data: any) => {
    createMutation(data, {
      onSuccess: () => reset(),
      onError: (err) => {
        console.log("Mutation error:", err); // Check this in the browser console
      },
    });
  };

  return (
    <div className="flex w-full min-h-screen items-start justify-center px-4 py-10">
      <div className="bg-white w-full max-w-5xl p-6 sm:p-10 rounded-xl shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-8">Add Product</h2>
        <form onSubmit={handleSubmit(onsubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              labelText="Category"
              labelFor="name"
              id="name"
              name="name"
              type="text"
              register={register}
            ></FormInput>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
