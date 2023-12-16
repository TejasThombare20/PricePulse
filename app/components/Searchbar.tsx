"use client";

import { FormEvent, useState } from "react";
import { scarpeAndStoreProduct } from "../lib/actions";

const Searchbar = () => {
  const [searchPrompts, setSearchPrompts] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValidAmazonProductURL = (url: string) => {
    try {
      const parsedURL = new URL(url);
      const hostname = parsedURL.hostname;
      if (
        hostname.includes("amazon.com ") ||
        hostname.includes("amazon") ||
        hostname.endsWith("amazon")
      ) {
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(searchPrompts);

    // alert(isValidLink ? "Valid link" : "Invalid link");

    if (!isValidLink) {
      return alert("please provide a valid Amazon link");
    }

    try {
      setIsLoading(true);
      
    //   scarping logic
    const product = await scarpeAndStoreProduct(searchPrompts) 

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchPrompts}
        onChange={(e) => setSearchPrompts(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <button
        type="submit"
        className="searchbar-btn"
        disabled={searchPrompts === ""}
      >
        {isLoading ? "Seaching..." : "Search"}
      </button>
    </form>
  );
};

export default Searchbar;
