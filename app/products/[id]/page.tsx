import { Product } from "@/Types";
import Modal from "@/app/components/Modal";
import PriceInfo from "@/app/components/PriceInfo";
import ProductCard from "@/app/components/ProductCard";
import { getProductById, getSimilarProducts } from "@/app/lib/actions";
import { formatNumber } from "@/app/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

const ProductDetails = async ({ params: { id } }: Props) => {
  const product: Product = await getProductById(id);

  if (!product) redirect("/ ");

  const similarProduct = await getSimilarProducts(id);
  return (
    <div className="product-container">
      <div className="flex gap-28 xl:flex-row flex-col">
        <div className="product-image">
          <Image
            src={product.image}
            alt={product.title}
            width={580}
            height={400}
            className="mx-auto"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-5 flex-wrap pb-6 ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] text-secondary font-semibold">
                {product.title}
              </p>
              <Link
                href={product.url}
                target="_blank"
                className="text-base text-black opacity-50"
              >
                Visit Product
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="product-hearts">
                <Image
                  src="/assets/icons/red-heart.svg"
                  alt="heart"
                  width={20}
                  height={20}
                />
                <p className="text-base font-semibold text-[#46F77]">
                  {product.reviewsCount}
                </p>
              </div>
              <div className="p-2 bg-white rounded-10 ">
                <Image
                  src="/assets/icons/bookmark.svg"
                  alt="bookmark"
                  width={20}
                  height={20}
                />
              </div>

              <div className="p-2 bg-white rounded-10 ">
                <Image
                  src="/assets/icons/share.svg"
                  alt="share"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          <div className="product-info">
            <div className="flex flex-col gap-2">
              <p className="text-[34px] text-secondary font-bold ">
                {product.currency} {formatNumber(product.currentPrice)}
              </p>
              <p className="text-[21px] text-black opacity-50 line-through font-bold ">
                {product.category} {formatNumber(product.originalPrice)}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <div className="product-stars">
                  <Image
                    src="/assets/icons/star.svg"
                    alt="start"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-primary-orange font-semibold">
                    {product.stars || "25"}
                  </p>
                </div>
                <div className="product-reviews">
                  <Image
                    src={"/assets/icons/comment.svg"}
                    alt="comment"
                    width={16}
                    height={16}
                  />
                  <p className="text-sm text-secondary font-semibold">
                    {product.reviewsCount} Reviews
                  </p>
                </div>
              </div>
              <p>
                <span>93%</span> of buyers have recommended this.
              </p>
            </div>
          </div>
          <div className="my-7 flex flex-col gap-5 ">
            <div className="flex gap-5 flex-wrap">
              <div className="flex gap-5 flex-wrap">
                <PriceInfo
                  title="Current Price"
                  iconSrc="/assets/icons/price-tag.svg"
                  value={`${product.currency} ${formatNumber(
                    product.currentPrice
                  )}`}
                />
                <PriceInfo
                  title="Average Price"
                  iconSrc="/assets/icons/chart.svg"
                  value={`${product.currency} ${formatNumber(
                    product.averagePrice
                  )}`}
                />
                <PriceInfo
                  title="Hightest Price"
                  iconSrc="/assets/icons/arrow-up.svg"
                  value={`${product.currency} ${formatNumber(
                    product.highestPrice
                  )}`}
                />
                <PriceInfo
                  title="Lowest Price"    
                  iconSrc="/assets/icons/arrow-down.svg"
                  value={`${product.currency} ${formatNumber(
                    product.lowestPrice
                  )}`}
                />
              </div>
            </div>
            <Modal productId={id}/>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16 ">
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl text-secondary font-semibold  ">
            Product Description
          </h3>

          <div className="flex flex-col gap-4">
            {product?.description?.split("\n")}
          </div>
        </div>

        <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
          <Image
            className=""
            src={"/assets/icons/bag.svg"}
            alt="check"
            width={22}
            height={22}
          />
          <Link href="/" className="text-base text-white">
            Buy Now
          </Link>
        </button>
      </div>
      {similarProduct && similarProduct?.length > 0 && (
        <div className="py-14 flex flex-col gap-2 w-full ">
          <p className="section-text">Similar Products</p>

          <div className="flex flex-wrap gap-10 mt-7 w-full">
            {similarProduct.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
