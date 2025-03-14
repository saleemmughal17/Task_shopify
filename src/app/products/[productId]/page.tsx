import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';
import { getProductByHandle } from '@/utils/shopify';

type Props = {
  params: { productId: string };
};

const getProductData = async (handle: string) => {
  return getProductByHandle(handle);
};

const SingleProductPage = async ({ params }: Props) => {
  const selectedProduct = await getProductData(params.productId);

  if (!selectedProduct) {
    return <div className="text-center text-red-500 text-xl mt-10">Product not found!</div>;
  }

  return (
    <div className="container mx-auto px-4 lg:px-16 py-10">
      {/* Back Button */}
      <Link href="/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
        <MdArrowBack className="text-2xl" />
        <span className="text-lg">Back to Products</span>
      </Link>

      {/* Product Details */}
      <div className="mt-8 flex flex-col lg:flex-row gap-10 items-center">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{selectedProduct.title}</h1>
          <p className="text-xl font-semibold text-gray-700">${selectedProduct.price}</p>
          <p className="text-gray-600">{selectedProduct.description}</p>

          {/* Buy Now Button */}
          <button className="mt-4 bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800 transition-all">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
