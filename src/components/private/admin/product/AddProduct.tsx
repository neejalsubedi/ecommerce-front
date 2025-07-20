import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useApiGet } from "../../../../api/ApiGet";
import { useApiMutation } from "../../../../api/ApiMutation";
import { apiUrl } from "../../../../api/api";
import { Button } from "../../../ui/Button";
import FormInput from "../../../ui/FormInput";

const AddProduct = () => {
  const { register, handleSubmit, setValue, watch,reset } = useForm();
  const { mutate: createProduct } = useApiMutation(
    "post",
    `/api/products/addProduct`
  );
  const { data: categories = [] } = useApiGet({
    endpoint: `${apiUrl}/api/categories/category`,
    queryKey: "Categories",
  });
  const categoryOptions = categories.map((cat: any) => ({
    label: cat.name,
    value: cat._id,
  }));
  const onSubmit = (data: any) => {
    console.log(data);
    const formData = {
      ...data,
      image: data.image[0], // image is a FileList
    };
    createProduct(formData, {
      onSuccess: (res) => {
        reset()
        toast.success(res?.data.message);
      },
      onError: (res) => {
        toast.error(res?.message);
      },
    });
  };
  const selectedCategory = watch("category");
  return (
    <div className="flex w-full min-h-screen items-start justify-center px-4 py-10">
      <div className="bg-white w-full max-w-5xl p-6 sm:p-10 rounded-xl shadow border border-gray-200">
        <h2 className="text-2xl font-bold text-center mb-8">Add Product</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              labelText="product name"
              labelFor="name"
              id="name"
              name="name"
              type="text"
              register={register}
            ></FormInput>
            <FormInput
              labelText="Product Image"
              labelFor="image"
              id="image"
              name="image"
              type="file"
              register={register}
              // handleChange={(e) => {
              //   const files = e.target.files;
              //   if (files?.length) {
              //     console.log("Selected File:", files[0]);
              //   }
              // }}
            />

            <FormInput
              labelText="product description"
              labelFor="description"
              id="description"
              name="description"
              type="text"
              register={register}
            ></FormInput>
            <FormInput
              labelText="price"
              labelFor="price"
              id="price"
              name="price"
              type="number"
              register={register}
            ></FormInput>
             <FormInput
              labelText="stock  "
              labelFor="stock"
              id="stock"
              name="stock"
              type="number"
              register={register}
            ></FormInput>
            <FormInput
              labelText="Category"
              labelFor="category"
              id="category"
              name="category"
              type="select"
              options={categoryOptions}
              value={selectedCategory}
              handleSelectChange={(value) => {
                setValue("category", value);
              }}
              register={register}
            ></FormInput>
          </div>
          <Button type="submit" children="Add" />
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
