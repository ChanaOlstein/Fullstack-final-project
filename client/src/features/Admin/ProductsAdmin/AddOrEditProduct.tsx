import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setCurrentProduct, type Product } from "../../Products/productsSlice";
import {
  createProduct,
  editProduct,
  fetchProductById,
} from "../../api/productApi";
import { useNavigate, useParams } from "react-router";
import styles from "./AddOrEditProduct.module.css";

const AddOrEditProduct = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentProduct = useAppSelector(
    (state) => state.product.currentProduct
  ); //Retrieves the current product from Redux
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Product>({
    _id: "",
    name: "",
    price: 0,
    currency: "",
    description: "",
    image: "",
  }); //A local variable that holds the product form values ​​(for creation or editing).

  useEffect(() => {
    if (id && !currentProduct) {
      fetchProductById(id).then((data) => setFormData(data));
      //If there is an id in the address (edit) and there is no current product in Redux,
      //a call is pulled from the server.
    } else if (currentProduct) {
      setFormData(currentProduct); //If there is a current product, fills out the form from it.
    }
  }, [id, currentProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "price" ? Number(value) : value,
    }));
  }; //When changing a field in a form, you update formData. If it's a price, you convert it to a number.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //Prevents page refresh
    setMessage(null); //resets previous messages.
    setError(null);
    if (
      !formData.name ||
      !formData.price ||
      !formData.currency ||
      !formData.description ||
      !formData.image
    ) {
      setError("Please fill in all fields.");
      return; //Check that all fields are filled in.
    }
    if (formData.price <= 0) {
      setError("Price must be a positive number.");
      return;
    } //Check that the price is correct.

    try {
      if (formData._id) {
        await editProduct(formData); //If there is _id => edit.
        setMessage("product edited successfully");
      } else {
        const { ...productData } = formData;
        await createProduct(productData); //If no _id => create.
        setMessage("product created successfully");
        setFormData({
          _id: "",
          name: "",
          price: 0,
          currency: "",
          description: "",
          image: "",
        }); //After creation, reset the form.
      }
      dispatch(setCurrentProduct(null)); //Reset the current product in Redux
      navigate("/admin/products"); //return to the product management page.
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        {formData._id ? "Edit Product" : "Add Product"}
      </h2>
      {/*If there is an ID - edit page, if there is none - create page */}
      {error && <span className={styles.error}>{error}</span>}
      {message && <span className={styles.success}>{message}</span>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/*Product name field. */}
        <label htmlFor="name"></label>
        <input
          type="text"
          name="name"
          placeholder="name"
          required
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
        />

        {/* product price field*/}
        <label htmlFor="price"></label>
        <input
          type="number"
          name="price"
          placeholder="price"
          required
          value={formData.price}
          onChange={handleChange}
          className={styles.input}
        />

        {/* product currency field*/}
        <label htmlFor="currency"></label>
        <input
          type="text"
          name="currency"
          placeholder="currency"
          required
          value={formData.currency}
          onChange={handleChange}
          className={styles.input}
        />

        {/* product description field*/}
        <label htmlFor="description"></label>
        <input
          type="text"
          name="description"
          placeholder="description"
          required
          value={formData.description}
          onChange={handleChange}
          className={styles.input}
        />

        <label htmlFor="image link"></label>
        <input
          type="text"
          name="image"
          placeholder="image link"
          required
          value={formData.image}
          onChange={handleChange}
          className={styles.input}
        />

        <button type="submit" className={styles.submitBtn}>
          {formData._id ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default AddOrEditProduct;
