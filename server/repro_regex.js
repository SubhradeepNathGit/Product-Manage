const regex = /product-listing\/([^/.]+)/;

const urls = [
    "https://res.cloudinary.com/demo/image/upload/v1234/product-listing/simple.jpg",
    "https://res.cloudinary.com/demo/image/upload/v1234/product-listing/complex.name.jpg",
    "https://res.cloudinary.com/demo/image/upload/product-listing/no_version.png",
    "http://res.cloudinary.com/demo/image/upload/v1234/product-listing/some-file_name.jpeg"
];

console.log("Testing Regex:", regex);

urls.forEach(url => {
    const match = url.match(regex);
    console.log(`\nURL: ${url}`);
    if (match) {
        console.log(`Match[1]: ${match[1]}`);
        console.log(`Extracted Public ID: product-listing/${match[1]}`);
    } else {
        console.log("No match");
    }
});

// Implementation of better logic
console.log("\n--- Testing Better Logic ---");
urls.forEach(url => {
    const parts = url.split("product-listing/");
    if (parts.length > 1) {
        const afterFolder = parts[1];
        const lastDotIndex = afterFolder.lastIndexOf(".");
        const filename = lastDotIndex !== -1 ? afterFolder.substring(0, lastDotIndex) : afterFolder;
        const publicId = `product-listing/${filename}`;
        console.log(`URL: ${url} -> Extracted: ${publicId}`);
    } else {
        console.log(`URL: ${url} -> Failed to split`);
    }
});
