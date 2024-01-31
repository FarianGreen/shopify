import express from "express";
import mongoose, { model } from "mongoose";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3001;


mongoose
  .connect("mongodb://localhost:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Ok"))
  .catch((err) => console.warn("DB Errore", err));

app.use(cors());
app.use(express.json());


const Product = model("Product", {
  id: String,
  bodyHtml: String,
  images: [String],
});


app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/api/fetch-products", async (req, res) => {
  try {
    const response = await post(
      "https://cpb-new-developer.myshopify.com/admin/api/2023-10/graphql.json",
      {
        query: `
          query {
            products {
              edges {
                node {
                  id
                  bodyHtml
                  images(first: 1) {
                    edges {
                      node {
                        src
                      }
                    }
                  }
                }
              }
            }
          }
        `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": "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",
        },
      }
    );

    const productsData = response.data.data.products.edges.map(({ node }) => ({
      id: node.id,
      bodyHtml: node.bodyHtml,
      images: node.images.edges.map(({ node }) => node.src),
    }));

    // Сохранение продуктов в базу данных
    await Product.insertMany(productsData);

    res.json(productsData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
