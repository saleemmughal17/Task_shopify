import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineDelete } from 'react-icons/ai';
import { TbBrandPaypal } from 'react-icons/tb';
import ButtonPrimary from '@/shared/Button/ButtonPrimary';

const CartPage = () => {
  const { cartItems } = useCart(); // Get cart items from the context

  if (cartItems.length === 0) {
    return <div className="text-center text-xl">Your cart is empty!</div>;
  }

  return (
    <div className="nc-CartPage">
      <main className="container py-16 lg:pb-28 lg:pt-20">
        <div className="mb-14">
          <h2 className="block text-2xl font-medium sm:text-3xl lg:text-4xl">Your Cart</h2>
        </div>

        <hr className="my-10 border-neutral-300 xl:my-12" />

        <div className="flex flex-col lg:flex-row">
          <div className="w-full divide-y divide-neutral-300 lg:w-[60%] xl:w-[55%]">
            {cartItems.map((item) => (
              <div key={item.id} className="flex py-5 last:pb-0">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    fill
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-top"
                  />
                  <Link className="absolute inset-0" href={`/products/${item.slug}`} />
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-medium">
                      <Link href={`/products/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <span className="font-medium">${item.price}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <AiOutlineDelete className="text-2xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="my-10 shrink-0 border-t border-neutral-300 lg:mx-10 lg:my-0 lg:border-l lg:border-t-0 xl:mx-16 2xl:mx-20" />
          <div className="flex-1">
            <div className="sticky top-28">
              <h3 className="text-2xl font-semibold">Summary</h3>
              <div className="mt-7 divide-y divide-neutral-300 text-sm">
                <div className="flex justify-between pb-4">
                  <span>Subtotal</span>
                  <span className="font-semibold">${cartItems.reduce((acc, item) => acc + item.price, 0)}</span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Estimated Delivery & Handling</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between py-4">
                  <span>Estimated taxes</span>
                  <span className="font-semibold">$24.90</span>
                </div>
                <div className="flex justify-between pt-4 text-base font-semibold">
                  <span>Total</span>
                  <span>${cartItems.reduce((acc, item) => acc + item.price, 0) + 24.90}</span>
                </div>
              </div>
              <ButtonPrimary href="/checkout" className="mt-8 w-full">Checkout Now</ButtonPrimary>
              <ButtonPrimary href="/checkout" className="mt-3 inline-flex w-full items-center gap-1 border-2 border-primary text-primary">
                <TbBrandPaypal className="text-2xl" />
                PayPal
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
