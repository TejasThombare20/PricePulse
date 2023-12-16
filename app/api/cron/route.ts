import Product from "@/app/lib/modals/product.modals";
import { connectToDB } from "@/app/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/app/lib/nodemailer";
import { scrapAmazonProduct } from "@/app/lib/scraper";
import {
  getAveragePrice,
  getEmailNotifType,
  getHighestPrice,
  getLowestPrice,
} from "@/app/lib/utils";
import { NextResponse } from "next/server";

// export const maxDuration = 300 ;  // 5 minutes
export const dynamic  = "force-dynamic"
export const revalidate = 0; 

export async function GET() {
  try {
    connectToDB();

    const products = await Product.find({});

    if (!products) throw new Error("No products found");

    const updatedProducts = await Promise.all(
      products.map(async (currentProduct) => {
        const scrapedProduct = await scrapAmazonProduct(currentProduct.url);

        if (!scrapedProduct) throw new Error("No product found");

        const updatedPriceHistory = [
          ...currentProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];

        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };

        const updatedproduct = await Product.findOneAndUpdate(
          { url: product.url },
          product
        );

        const emailNotifType = getEmailNotifType(
          scrapedProduct,
          currentProduct
        );

        if (emailNotifType && updatedproduct.user.length > 0) {
          const productInfo = {
            title: updatedproduct.title,
            url: updatedproduct.url,
          };

          const emailContent = await generateEmailBody(
            productInfo,
            emailNotifType
          );

          const userEmails = updatedproduct.user.map((user: any) => user.email);

          await sendEmail(emailContent, userEmails);
        }
        return updatedproduct;
      })
    );
    return NextResponse.json({
      message: "Ok",
      data: updatedProducts,
    });
  } catch (error) {
    throw new Error(`Error in GET ${error}`);
  }
}
