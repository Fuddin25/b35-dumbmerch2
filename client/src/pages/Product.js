import { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-css";
import { Container, Row, Col } from "react-bootstrap";
import { useDebounce } from "use-debounce";

import { UserContext } from "../context/userContext";

import Navbar from "../components/Navbar";
import ProductCard from "../components/card/ProductCard";

import imgEmpty from "../assets/empty.svg";

// Import useQuery
import { useQuery } from "react-query";

// API config
import { API } from "../config/api";

export default function Product() {
  let api = API();

  const [searchFilter, setSearchFilter] = useState("");

  const [value] = useDebounce(searchFilter, 1000);

  const title = "Shop";
  document.title = "DumbMerch | " + title;

  // Fetching product data from database
  let { data: products, refetch } = useQuery("productsCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/products", config);
    return response.data;
  });

  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  const filterByWord = products?.filter((item) => {
    //if no input the return the original
    if (value === "") {
      return item;
    }
    //return the item which contains the user input
    else {
      return item.name?.toLowerCase().includes(value);
    }
  });

  console.log("filter Products: ", filterByWord);

  const handleChangeSearch = (e) => {
    let lowerCase = e.target?.value.toLowerCase();
    setSearchFilter(lowerCase);
  };


  return (
    <div>
      <Navbar title={title} />
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="text-header-product">Product</div>
          </Col>
          <div className="form ms-auto me-3">
            <input type="text" name="search" onChange={handleChangeSearch} placeholder="Search" style={{ width: "40vw" }} />
          </div>
        </Row>
        <Row className="my-4">
          {products?.length != 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {products?.map((item, index) => (
                <ProductCard item={item} index={index} />
              ))}
            </Masonry>
          ) : (
            <Col>
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "40%" }}
                />
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}
