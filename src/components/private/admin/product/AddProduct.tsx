/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm} from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useApiGet } from "../../../../api/ApiGet";
import { useApiMutation } from "../../../../api/ApiMutation";
import { apiUrl } from "../../../../api/api";
import { Button } from "../../../ui/Button";
import FormInput from "../../../ui/FormInput";

// ✅ Define the form data type
interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: FileList;
}

// ✅ Type for category options
interface Category {
  _id: string;
  name: string;
}

const AddProduct = () => {
  const { register, handleSubmit, setValue, watch, reset } = useForm<ProductFormValues>();
  const { mutate: createProduct } = useApiMutation("post", `/api/products/addProduct`);

  const { data: categories = [] } = useApiGet<Category[]>({
    endpoint: `${apiUrl}/api/categories/category`,
    queryKey: "Categories",
  });

  const categoryOptions = categories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
    const formData = {
      ...data,
      image: data.image[0], // extract the File from FileList
    };

    createProduct(formData, {
      onSuccess: (res: any) => {
        reset();
        toast.success(res?.data?.message || "Product added successfully");
      },
      onError: (res: any) => {
        toast.error(res?.message || "Failed to add product");
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
              labelText="Product Name"
              labelFor="name"
              id="name"
              name="name"
              type="text"
              register={register}
            />
            <FormInput
              labelText="Product Image"
              labelFor="image"
              id="image"
              name="image"
              type="file"
              register={register}
            />
            <FormInput
              labelText="Product Description"
              labelFor="description"
              id="description"
              name="description"
              type="text"
              register={register}
            />
            <FormInput
              labelText="Price"
              labelFor="price"
              id="price"
              name="price"
              type="number"
              register={register}
            />
            <FormInput
              labelText="Stock"
              labelFor="stock"
              id="stock"
              name="stock"
              type="number"
              register={register}
            />
            <FormInput
              labelText="Category"
              labelFor="category"
              id="category"
              name="category"
              type="select"
              options={categoryOptions}
              value={selectedCategory}
              handleSelectChange={(value) => setValue("category", value as string)}
              register={register}
            />
          </div>
          <Button type="submit" children="Add" />
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
