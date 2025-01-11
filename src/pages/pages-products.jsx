import Navbar from "../components/navbar/navbar";
import ProductListing from "../components/products/ProductListing";

const ProductsPage = () => {
    return (
        <div>
            <Navbar />
            <ProductListing />
            <h1>Products</h1>
        </div>
    )
}

export default ProductsPage;